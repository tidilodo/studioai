import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import sharp from 'sharp'

export async function POST(request: Request) {
  // Rate limit: 20 requests per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { success: rateLimitOk } = rateLimit(ip, 20, 60_000)
  if (!rateLimitOk) {
    return NextResponse.json({ error: 'Muitas requisições. Aguarde um momento.' }, { status: 429 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  // Rate limit per user: 30 per minute (extra protection for PRO)
  const { success: userRateOk } = rateLimit(`user:${user.id}`, 30, 60_000)
  if (!userRateOk) {
    return NextResponse.json({ error: 'Limite de requisições por minuto atingido.' }, { status: 429 })
  }

  const admin = createAdminClient()

  // Check credits
  const { data: profile } = await admin
    .from('profiles')
    .select('plan, credits_remaining, credits_reset_at')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 })
  }

  // Reset daily credits if expired
  const now = new Date()
  if (new Date(profile.credits_reset_at) <= now && profile.plan === 'free') {
    await admin
      .from('profiles')
      .update({
        credits_remaining: 10,
        credits_reset_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', user.id)
    profile.credits_remaining = 10
  }

  // Check if user has credits (pro = unlimited)
  if (profile.plan === 'free' && profile.credits_remaining <= 0) {
    return NextResponse.json({
      error: 'Créditos esgotados! Faça upgrade para PRO ou aguarde o reset diário.',
    }, { status: 429 })
  }

  const { prompt, negative_prompt, model, width, height } = await request.json()

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt é obrigatório' }, { status: 400 })
  }

  try {
    // Generate image using HuggingFace Inference API
    let imageBuffer = await generateWithHF(model, prompt, negative_prompt, width, height)

    // Add watermark for free plan
    if (profile.plan === 'free') {
      imageBuffer = await addWatermark(imageBuffer)
    }

    // Upload to Supabase Storage
    const fileName = `${user.id}/${Date.now()}.png`
    const { data: upload, error: uploadError } = await admin.storage
      .from('generations')
      .upload(fileName, imageBuffer, { contentType: 'image/png' })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Erro ao salvar imagem' }, { status: 500 })
    }

    const { data: { publicUrl } } = admin.storage.from('generations').getPublicUrl(fileName)

    // Save generation record
    await admin.from('generations').insert({
      user_id: user.id,
      prompt,
      negative_prompt: negative_prompt || null,
      model,
      image_url: publicUrl,
      width: width || 1024,
      height: height || 1024,
      status: 'completed',
    })

    // Deduct credit (free plan only)
    if (profile.plan === 'free') {
      await admin
        .from('profiles')
        .update({
          credits_remaining: profile.credits_remaining - 1,
          total_generations: (profile as any).total_generations + 1,
        })
        .eq('id', user.id)
    } else {
      await admin
        .from('profiles')
        .update({ total_generations: (profile as any).total_generations + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({ image_url: publicUrl })
  } catch (err: any) {
    console.error('Generation error:', err)
    return NextResponse.json({ error: 'Erro ao gerar imagem. Tente novamente.' }, { status: 500 })
  }
}

async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer)
  const metadata = await image.metadata()
  const width = metadata.width || 1024
  const height = metadata.height || 1024

  const svg = `
    <svg width="${width}" height="${height}">
      <style>
        .watermark { fill: rgba(255,255,255,0.4); font-size: ${Math.round(width * 0.05)}px; font-family: sans-serif; font-weight: bold; }
      </style>
      <text x="${width * 0.5}" y="${height * 0.95}" text-anchor="middle" class="watermark">StudioAI — Free</text>
      <text x="${width * 0.5}" y="${height * 0.05 + 20}" text-anchor="middle" class="watermark" style="font-size: ${Math.round(width * 0.03)}px; fill: rgba(255,255,255,0.25)">studioai.vercel.app</text>
    </svg>`

  return image
    .composite([{ input: Buffer.from(svg), gravity: 'center' }])
    .png()
    .toBuffer()
}

async function generateWithHF(
  model: string,
  prompt: string,
  negativePrompt: string | undefined,
  width: number,
  height: number
): Promise<Buffer> {
  // Use FLUX.1-schnell for all — reliable on HF Inference API
  const hfModel = 'black-forest-labs/FLUX.1-schnell'

  const payload: any = { inputs: prompt }

  if (negativePrompt) {
    payload.parameters = { negative_prompt: negativePrompt }
  }

  const response = await fetch(`https://router.huggingface.co/hf-inference/models/${hfModel}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`HuggingFace API error: ${response.status} - ${err}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

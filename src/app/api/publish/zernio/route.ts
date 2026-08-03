import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { publishToZernio } from '@/lib/zernio'
import { NextResponse } from 'next/server'

const ALLOWED_PLATFORMS = new Set(['instagram', 'facebook', 'linkedin', 'threads', 'tiktok', 'google_business'])

type ContentPiece = {
  id: string
  user_id: string
  type: string
  topic: string
  copy_hook?: string | null
  copy_body?: string | null
  copy_cta?: string | null
  hashtags?: string[] | null
  image_url?: string | null
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }

  const { contentId, platforms, scheduledAt } = await request.json()

  if (!contentId) {
    return NextResponse.json({ error: 'contentId e obrigatorio' }, { status: 400 })
  }

  const selectedPlatforms = Array.isArray(platforms) && platforms.length
    ? platforms.filter((platform: string) => ALLOWED_PLATFORMS.has(platform))
    : ['instagram']

  if (!selectedPlatforms.length) {
    return NextResponse.json({ error: 'Nenhuma plataforma valida informada' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: content, error: contentError } = await admin
    .from('content_pieces')
    .select('*')
    .eq('id', contentId)
    .eq('user_id', user.id)
    .single()

  if (contentError || !content) {
    return NextResponse.json({ error: 'Conteudo nao encontrado' }, { status: 404 })
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('brand_name, instagram_handle, zernio_workspace_id')
    .eq('id', user.id)
    .single()

  try {
    let publishContent = content as ContentPiece

    if (selectedPlatforms.includes('instagram') && !publishContent.image_url) {
      const imageUrl = await createFallbackImage(publishContent, user.id, admin)
      publishContent = { ...publishContent, image_url: imageUrl }
    }

    const result = await publishToZernio({
      content: publishContent,
      profile: profile || {},
      platforms: selectedPlatforms,
      scheduledAt: scheduledAt || null,
    })

    const nextStatus = result.status
    const { error: updateError } = await admin
      .from('content_pieces')
      .update({
        image_url: publishContent.image_url || null,
        publish_status: nextStatus,
        platforms: selectedPlatforms,
        scheduled_at: scheduledAt || null,
        published_at: nextStatus === 'published' ? new Date().toISOString() : null,
        zernio_publication_id: result.publicationId || null,
        zernio_payload: result.payload,
        zernio_error: null,
      })
      .eq('id', content.id)
      .eq('user_id', user.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      configured: result.configured,
      status: nextStatus,
      publicationId: result.publicationId || null,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao publicar no Zernio'
    await admin
      .from('content_pieces')
      .update({
        publish_status: 'failed',
        platforms: selectedPlatforms,
        scheduled_at: scheduledAt || null,
        zernio_error: message,
      })
      .eq('id', content.id)
      .eq('user_id', user.id)

    return NextResponse.json({ error: message }, { status: 502 })
  }
}

async function createFallbackImage(content: ContentPiece, userId: string, admin: ReturnType<typeof createAdminClient>) {
  const sharp = (await import('sharp')).default
  const title = escapeXml(titleCase(content.topic || 'OraculoAI'))
  const hook = escapeXml(trimText(content.copy_hook || content.copy_body || 'Conteudo consciente para redes sociais.', 150))
  const cta = escapeXml(trimText(content.copy_cta || '@oraculoai', 90))

  const svg = `
    <svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#12091f"/>
          <stop offset="0.48" stop-color="#2a1248"/>
          <stop offset="1" stop-color="#08070c"/>
        </linearGradient>
        <radialGradient id="glow" cx="35%" cy="25%" r="65%">
          <stop offset="0" stop-color="#a855f7" stop-opacity="0.55"/>
          <stop offset="1" stop-color="#a855f7" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1080" height="1080" fill="url(#bg)"/>
      <rect width="1080" height="1080" fill="url(#glow)"/>
      <circle cx="890" cy="190" r="120" fill="none" stroke="#f5d77b" stroke-opacity="0.16" stroke-width="2"/>
      <circle cx="160" cy="880" r="170" fill="none" stroke="#a855f7" stroke-opacity="0.18" stroke-width="2"/>
      <text x="90" y="120" fill="#f5d77b" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="3">ORACULOAI</text>
      <text x="90" y="445" fill="#ffffff" font-family="Arial, sans-serif" font-size="72" font-weight="800">
        ${wrapSvgText(title, 16, 0, 88)}
      </text>
      <text x="92" y="660" fill="#d8c9ef" font-family="Arial, sans-serif" font-size="36" font-weight="500">
        ${wrapSvgText(hook, 34, 0, 48)}
      </text>
      <text x="90" y="960" fill="#f5d77b" font-family="Arial, sans-serif" font-size="30" font-weight="700">
        ${wrapSvgText(cta, 42, 0, 40)}
      </text>
    </svg>`

  const imageBuffer = await sharp(Buffer.from(svg)).png().toBuffer()
  const fileName = `${userId}/publish-${content.id}-${Date.now()}.png`
  const { error: uploadError } = await admin.storage
    .from('generations')
    .upload(fileName, imageBuffer, { contentType: 'image/png', upsert: true })

  if (uploadError) {
    throw new Error(`Erro ao criar imagem para Instagram: ${uploadError.message}`)
  }

  const { data: { publicUrl } } = admin.storage.from('generations').getPublicUrl(fileName)
  return publicUrl
}

function trimText(value: string, limit: number) {
  const compact = value.replace(/\s+/g, ' ').trim()
  return compact.length > limit ? `${compact.slice(0, limit - 1).trim()}...` : compact
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/(^|\s)\S/g, char => char.toUpperCase())
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function wrapSvgText(value: string, maxChars: number, xOffset: number, lineHeight: number) {
  const words = value.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }

  if (current) lines.push(current)

  return lines.slice(0, 4).map((line, index) => (
    `<tspan x="${90 + xOffset}" dy="${index === 0 ? 0 : lineHeight}">${line}</tspan>`
  )).join('')
}

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { publishToZernio } from '@/lib/zernio'
import { NextResponse } from 'next/server'

const ALLOWED_PLATFORMS = new Set(['instagram', 'facebook', 'linkedin', 'threads', 'tiktok', 'google_business'])

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
    const result = await publishToZernio({
      content,
      profile: profile || {},
      platforms: selectedPlatforms,
      scheduledAt: scheduledAt || null,
    })

    const nextStatus = result.status
    const { error: updateError } = await admin
      .from('content_pieces')
      .update({
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


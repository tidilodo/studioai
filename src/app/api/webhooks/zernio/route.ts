import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

const EVENT_STATUS: Record<string, string> = {
  'post.scheduled': 'scheduled',
  'post.published': 'published',
  'post.failed': 'failed',
  'post.cancelled': 'draft',
  'post.recycled': 'queued',
  'post.platform.published': 'published',
  'post.platform.failed': 'failed',
  'post.partial': 'scheduled',
}

type ZernioWebhookPayload = {
  event?: string
  type?: string
  id?: string
  post_id?: string
  publication_id?: string
  external_id?: string
  data?: {
    id?: string
    post_id?: string
    publication_id?: string
    external_id?: string
    error?: string
    platform?: string
    platforms?: string[]
    published_at?: string
    scheduled_at?: string
  }
  error?: string
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const secret = process.env.ZERNIO_WEBHOOK_SECRET

  if (secret && !isValidSignature(request, rawBody, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: ZernioWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = payload.event || payload.type || 'unknown'
  const status = EVENT_STATUS[event]
  const externalId = payload.external_id || payload.data?.external_id
  const publicationId = payload.publication_id || payload.post_id || payload.id || payload.data?.publication_id || payload.data?.post_id || payload.data?.id

  if (!externalId && !publicationId) {
    return NextResponse.json({ ok: true, ignored: true, reason: 'missing external_id/publication_id' })
  }

  const admin = createAdminClient()
  const update: Record<string, unknown> = {
    zernio_payload: payload,
    zernio_error: payload.error || payload.data?.error || null,
  }

  if (status) update.publish_status = status
  if (publicationId) update.zernio_publication_id = publicationId
  if (event.includes('published')) update.published_at = payload.data?.published_at || new Date().toISOString()
  if (payload.data?.scheduled_at) update.scheduled_at = payload.data.scheduled_at
  if (payload.data?.platforms) update.platforms = payload.data.platforms
  if (payload.data?.platform) update.platforms = [payload.data.platform]

  let query = admin.from('content_pieces').update(update)

  if (externalId) {
    query = query.eq('id', externalId)
  } else {
    query = query.eq('zernio_publication_id', publicationId)
  }

  const { error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, event, status: status || null })
}

export async function GET() {
  return NextResponse.json({ ok: true, service: 'OraculoAI Zernio webhook' })
}

function isValidSignature(request: Request, body: string, secret: string) {
  const signature = request.headers.get('x-zernio-signature')
  if (!signature) return false

  const digest = createHmac('sha256', secret).update(body).digest('hex')
  const normalizedSignature = signature.replace(/^sha256=/, '')

  try {
    const expected = Buffer.from(digest, 'hex')
    const received = Buffer.from(normalizedSignature, 'hex')
    return expected.length === received.length && timingSafeEqual(expected, received)
  } catch {
    return false
  }
}

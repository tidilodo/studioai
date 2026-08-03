type ContentPiece = {
  id: string
  type: string
  topic: string
  copy_hook?: string | null
  copy_body?: string | null
  copy_cta?: string | null
  hashtags?: string[] | null
  image_url?: string | null
  scheduled_at?: string | null
}

type Profile = {
  brand_name?: string | null
  instagram_handle?: string | null
  zernio_workspace_id?: string | null
}

export type ZernioPublishInput = {
  content: ContentPiece
  profile: Profile
  platforms: string[]
  scheduledAt?: string | null
}

export type ZernioPublishResult = {
  configured: boolean
  status: 'queued' | 'scheduled' | 'published'
  publicationId?: string
  payload: Record<string, unknown>
}

export function buildZernioPayload({ content, profile, platforms, scheduledAt }: ZernioPublishInput) {
  const caption = [
    content.copy_hook,
    content.copy_body,
    content.copy_cta,
    content.hashtags?.join(' '),
  ].filter(Boolean).join('\n\n')

  return {
    external_id: content.id,
    workspace_id: profile.zernio_workspace_id || undefined,
    brand: {
      name: profile.brand_name || 'OraculoAI',
      instagram_handle: profile.instagram_handle || undefined,
    },
    content: {
      type: content.type,
      topic: content.topic,
      caption,
      image_url: content.image_url || undefined,
      hashtags: content.hashtags || [],
    },
    platforms,
    scheduled_at: scheduledAt || null,
    source: 'oraculoai',
  }
}

export async function publishToZernio(input: ZernioPublishInput): Promise<ZernioPublishResult> {
  const payload = buildZernioPayload(input)
  const webhookUrl = process.env.ZERNIO_WEBHOOK_URL

  if (!webhookUrl) {
    return {
      configured: false,
      status: input.scheduledAt ? 'scheduled' : 'queued',
      payload,
    }
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.ZERNIO_API_KEY ? { Authorization: `Bearer ${process.env.ZERNIO_API_KEY}` } : {}),
    },
    body: JSON.stringify(payload),
  })

  const raw = await response.text()
  let data: unknown = null
  try {
    data = raw ? JSON.parse(raw) : null
  } catch {
    data = { raw }
  }

  if (!response.ok) {
    throw new Error(`Zernio error ${response.status}: ${raw || response.statusText}`)
  }

  return {
    configured: true,
    status: input.scheduledAt ? 'scheduled' : 'published',
    publicationId: extractPublicationId(data),
    payload,
  }
}
function extractPublicationId(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined

  const record = data as Record<string, unknown>
  if (typeof record.id === 'string') return record.id
  if (typeof record.publication_id === 'string') return record.publication_id

  if (record.data && typeof record.data === 'object') {
    const nested = record.data as Record<string, unknown>
    if (typeof nested.id === 'string') return nested.id
  }

  return undefined
}


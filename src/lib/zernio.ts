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

type ZernioPostResponse = {
  post?: {
    _id?: string
    id?: string
    status?: string
  }
  data?: {
    post?: {
      _id?: string
      id?: string
      status?: string
    }
  }
  id?: string
  publication_id?: string
}

type ZernioTargetPlatform = {
  platform: string
  accountId: string
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

  const accountMap = getAccountMap()
  const targetPlatforms = platforms
    .map(platform => normalizePlatform(platform))
    .map(platform => ({ platform, accountId: accountMap[platform] }))
    .filter((target): target is ZernioTargetPlatform => Boolean(target.accountId))

  return {
    title: content.topic,
    content: caption,
    mediaItems: content.image_url
      ? [{ type: 'image', url: content.image_url, title: content.topic }]
      : undefined,
    platforms: targetPlatforms,
    scheduledFor: scheduledAt || undefined,
    publishNow: !scheduledAt,
    timezone: process.env.ZERNIO_TIMEZONE || 'America/Sao_Paulo',
    hashtags: content.hashtags || [],
    metadata: {
      source: 'oraculoai',
      external_id: content.id,
      content_type: content.type,
      brand_name: profile.brand_name || undefined,
      instagram_handle: profile.instagram_handle || undefined,
      workspace_id: profile.zernio_workspace_id || process.env.ZERNIO_WORKSPACE_ID || undefined,
    },
  }
}

export async function publishToZernio(input: ZernioPublishInput): Promise<ZernioPublishResult> {
  const payload = buildZernioPayload(input)
  const apiUrl = process.env.ZERNIO_POSTS_API_URL || 'https://zernio.com/api/v1/posts'
  const apiKey = process.env.ZERNIO_API_KEY

  if (!apiKey) {
    return {
      configured: false,
      status: input.scheduledAt ? 'scheduled' : 'queued',
      payload,
    }
  }

  const targetPlatforms = payload.platforms as ZernioTargetPlatform[]
  if (!targetPlatforms.length) {
    throw new Error('Configure o accountId do Zernio para a plataforma selecionada.')
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
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

function getAccountMap() {
  const fromJson = process.env.ZERNIO_ACCOUNT_MAP
  if (fromJson) {
    try {
      return JSON.parse(fromJson) as Record<string, string>
    } catch {
      return {}
    }
  }

  return {
    instagram: process.env.ZERNIO_INSTAGRAM_ACCOUNT_ID,
    facebook: process.env.ZERNIO_FACEBOOK_ACCOUNT_ID,
    linkedin: process.env.ZERNIO_LINKEDIN_ACCOUNT_ID,
    threads: process.env.ZERNIO_THREADS_ACCOUNT_ID,
    tiktok: process.env.ZERNIO_TIKTOK_ACCOUNT_ID,
    youtube: process.env.ZERNIO_YOUTUBE_ACCOUNT_ID,
    googlebusiness: process.env.ZERNIO_GOOGLE_BUSINESS_ACCOUNT_ID,
  } as Record<string, string | undefined>
}

function normalizePlatform(platform: string) {
  if (platform === 'google_business') return 'googlebusiness'
  return platform
}

function extractPublicationId(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined

  const record = data as ZernioPostResponse
  if (typeof record.id === 'string') return record.id
  if (typeof record.publication_id === 'string') return record.publication_id
  if (typeof record.post?._id === 'string') return record.post._id
  if (typeof record.post?.id === 'string') return record.post.id
  if (typeof record.data?.post?._id === 'string') return record.data.post._id
  if (typeof record.data?.post?.id === 'string') return record.data.post.id

  return undefined
}



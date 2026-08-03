import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

export async function generateCopy(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!hasBedrockCredentials() || process.env.AI_PROVIDER === 'none') {
    return generateFallbackCopy(systemPrompt, userPrompt)
  }

  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-east-2',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })

  const modelId = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-sonnet-4-6-20250514-v1:0'

  const payload = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  }

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  })

  try {
    const response = await client.send(command)
    const result = JSON.parse(new TextDecoder().decode(response.body))
    return result.content[0].text
  } catch (err: any) {
    console.error('Bedrock error:', err.name, err.message)
    return generateFallbackCopy(systemPrompt, userPrompt)
  }
}

function hasBedrockCredentials() {
  return Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
}

function generateFallbackCopy(systemPrompt: string, userPrompt: string) {
  if (systemPrompt.toLowerCase().includes('image generation prompts')) {
    const topic = extractField(userPrompt, 'Topic') || extractField(userPrompt, 'Tema') || 'spiritual guidance'
    return `Mystic editorial composition about ${topic}, soft golden light, natural textures, symbolic celestial elements, calm premium atmosphere, professional photography, 4k, Instagram post format, square composition, no text`
  }

  const topic = extractField(userPrompt, 'Tema/Tópico') || extractField(userPrompt, 'Tema') || 'autoconhecimento'
  const type = inferContentType(userPrompt)
  const hashtags = buildHashtags(topic)

  if (type === 'stories') {
    return [
      `1. ${topic}: talvez esse seja o convite que você estava evitando ouvir.`,
      '2. Observe onde sua energia expande e onde ela se contrai.',
      '3. Nem toda resposta chega como certeza. Às vezes ela chega como alívio.',
      '4. Hoje, escolha um gesto pequeno que confirme a direção que você sente por dentro.',
      '5. Salve essa reflexão para voltar quando precisar se recentrar.',
      '',
      `Hashtags: ${hashtags.join(' ')}`,
      'Palavras-chave SEO: autoconhecimento, espiritualidade, presença',
      'Melhor horário para postar: noite, terça-feira',
    ].join('\n')
  }

  if (type === 'carousel') {
    return [
      `Slide 1: ${titleCase(topic)}`,
      'Slide 2: Antes de buscar respostas fora, perceba o que o seu corpo já está sinalizando.',
      'Slide 3: Clareza nasce quando você para de negociar com o que já sabe.',
      'Slide 4: A espiritualidade prática começa nas escolhas pequenas do dia.',
      'Slide 5: O que se repete na sua vida pode estar pedindo consciência, não culpa.',
      'Slide 6: Use esse tema como um espelho, não como sentença.',
      'Slide 7: Respire, observe e escolha um próximo passo possível.',
      'Slide 8: Salve para reler quando precisar de direção.',
      '',
      `Hashtags: ${hashtags.join(' ')}`,
      'Palavras-chave SEO: autoconhecimento, espiritualidade, consciência',
      'Melhor horário para postar: tarde, quarta-feira',
    ].join('\n')
  }

  return [
    `${titleCase(topic)} pode ser o lembrete que faltava para você voltar para si.`,
    '',
    'Existe um momento em que a busca por respostas precisa virar escuta. Não uma escuta ansiosa, querendo resolver tudo de uma vez, mas uma presença mais honesta com aquilo que você sente.',
    '',
    `Quando o tema é ${topic}, o convite é olhar para os sinais que aparecem nas suas escolhas, nos seus vínculos e na forma como você usa a sua energia.`,
    '',
    'Hoje, experimente transformar essa percepção em uma ação simples: escreva o que está claro, nomeie o que ainda está confuso e escolha um passo possível.',
    '',
    'Se essa mensagem fez sentido, salve para voltar depois e compartilhe com alguém que também está nesse processo.',
    '',
    `Hashtags: ${hashtags.join(' ')}`,
    'Palavras-chave SEO: autoconhecimento, espiritualidade, desenvolvimento pessoal',
    'Melhor horário para postar: noite, terça-feira',
  ].join('\n')
}

function extractField(text: string, field: string) {
  const escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = text.match(new RegExp(`${escaped}:\\s*(.+)`, 'i'))
  return match?.[1]?.split('\n')[0]?.trim()
}

function inferContentType(prompt: string) {
  const lower = prompt.toLowerCase()
  if (lower.includes('stories')) return 'stories'
  if (lower.includes('carrossel')) return 'carousel'
  if (lower.includes('reels')) return 'reels_script'
  if (lower.includes('blog')) return 'blog_seo'
  if (lower.includes('anúncio') || lower.includes('anuncio')) return 'ad_copy'
  return 'post_feed'
}

function buildHashtags(topic: string) {
  const clean = topic
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toLowerCase()

  return [`#${clean || 'oraculoai'}`, '#autoconhecimento', '#espiritualidade', '#conteudoconsciente', '#oraculoai']
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .replace(/(^|\s)\S/g, char => char.toUpperCase())
}

import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

function verifyMPSignature(request: Request, body: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET
  if (!secret) return true // Skip verification if secret not configured yet

  const xSignature = request.headers.get('x-signature')
  const xRequestId = request.headers.get('x-request-id')

  if (!xSignature || !xRequestId) return false

  const parts = xSignature.split(',')
  const ts = parts.find(p => p.trim().startsWith('ts='))?.split('=')[1]
  const hash = parts.find(p => p.trim().startsWith('v1='))?.split('=')[1]

  if (!ts || !hash) return false

  // Extract data.id from body
  const parsed = JSON.parse(body)
  const dataId = parsed.data?.id

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')

  return expected === hash
}

export async function POST(request: Request) {
  const rawBody = await request.text()

  if (!verifyMPSignature(request, rawBody)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const body = JSON.parse(rawBody)

  if (body.type !== 'payment') {
    return NextResponse.json({ ok: true })
  }

  const paymentId = body.data?.id
  if (!paymentId) {
    return NextResponse.json({ ok: true })
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    })

    const payment = await response.json()

    if (payment.status !== 'approved') {
      return NextResponse.json({ ok: true })
    }

    const ref = JSON.parse(payment.external_reference || '{}')
    const userId = ref.user_id

    if (!userId) {
      return NextResponse.json({ ok: true })
    }

    const admin = createAdminClient()

    // Upgrade user to PRO
    await admin
      .from('profiles')
      .update({ plan: 'pro', credits_remaining: 9999 })
      .eq('id', userId)

    // Record payment
    await admin.from('payments').insert({
      user_id: userId,
      mp_payment_id: String(paymentId),
      amount: payment.transaction_amount,
      status: 'approved',
      plan: 'pro',
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()

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

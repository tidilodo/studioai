import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { plan } = await request.json()

  if (plan !== 'pro') {
    return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const body = {
    items: [{
      title: 'StudioAI PRO — Mensal',
      quantity: 1,
      unit_price: 29.00,
      currency_id: 'BRL',
    }],
    payer: { email: user.email },
    external_reference: JSON.stringify({ user_id: user.id, plan: 'pro' }),
    back_urls: {
      success: `${appUrl}/studio?upgraded=true`,
      failure: `${appUrl}/pricing`,
      pending: `${appUrl}/pricing`,
    },
    auto_return: 'approved',
    notification_url: `${appUrl}/api/webhook`,
    statement_descriptor: 'STUDIOAI PRO',
  }

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('MP error:', data)
      return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 })
    }

    return NextResponse.json({ url: data.init_point })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

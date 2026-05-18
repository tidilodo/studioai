'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/studio')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">StudioAI</h1>
          <p className="text-zinc-500 text-sm mt-1">Crie sua conta gratuita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
              placeholder="Seu nome"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar conta grátis'}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-violet-400 hover:underline">Entrar</Link>
        </p>

        <p className="text-center text-zinc-600 text-xs mt-4">
          Plano gratuito: 10 gerações por dia
        </p>
      </div>
    </div>
  )
}

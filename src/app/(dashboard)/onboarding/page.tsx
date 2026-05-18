'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Moon, Star, Eye, Sun, Feather, Leaf, Sparkles, Palette } from 'lucide-react'

const SUB_NICHES = [
  { id: 'astrologia', label: 'Astrologia', icon: Star },
  { id: 'tarot', label: 'Tarot & Oráculos', icon: Eye },
  { id: 'reiki', label: 'Reiki & Energia', icon: Sun },
  { id: 'terapia_holistica', label: 'Terapia Holística', icon: Feather },
  { id: 'cristais', label: 'Cristais & Minerais', icon: Sparkles },
  { id: 'fitoterapia', label: 'Fitoterapia & Ervas', icon: Leaf },
  { id: 'numerologia', label: 'Numerologia', icon: Moon },
  { id: 'meditacao', label: 'Meditação & Mindfulness', icon: Moon },
]

const VISUAL_STYLES = [
  { id: 'mystic_dark', label: 'Místico Escuro', desc: 'Tons profundos, violeta, dourado sobre preto', colors: ['#1a0533', '#7c3aed', '#d4af37'] },
  { id: 'ethereal_light', label: 'Etéreo Claro', desc: 'Lavanda, branco perolado, tons pastel', colors: ['#f3e8ff', '#c4b5fd', '#fef3c7'] },
  { id: 'earth_organic', label: 'Terroso Orgânico', desc: 'Marrom, verde sage, terracota', colors: ['#44403c', '#84cc16', '#c2410c'] },
  { id: 'cosmic_vibrant', label: 'Cósmico Vibrante', desc: 'Azul profundo, roxo, gradientes galácticos', colors: ['#1e1b4b', '#7c3aed', '#06b6d4'] },
  { id: 'minimal_sacred', label: 'Minimalista Sagrado', desc: 'Preto e branco com toques dourados', colors: ['#18181b', '#f4f4f5', '#d4af37'] },
]

const VOICE_TONES = [
  { id: 'acolhedora', label: 'Acolhedora', desc: 'Gentil, empática, como uma conversa com uma amiga sábia' },
  { id: 'mistica', label: 'Mística', desc: 'Poética, simbólica, linguagem dos astros e elementos' },
  { id: 'educativa', label: 'Educativa', desc: 'Didática, clara, explica conceitos com acessibilidade' },
  { id: 'empoderada', label: 'Empoderada', desc: 'Direta, motivacional, convida à ação e transformação' },
  { id: 'contemplativa', label: 'Contemplativa', desc: 'Reflexiva, pausada, convida à introspecção' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [brandName, setBrandName] = useState('')
  const [subNiche, setSubNiche] = useState('astrologia')
  const [visualStyle, setVisualStyle] = useState('mystic_dark')
  const [voiceTone, setVoiceTone] = useState('acolhedora')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleFinish() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').update({
      brand_name: brandName || null,
      sub_niche: subNiche,
      visual_style: visualStyle,
      voice_tone: voiceTone,
      onboarding_done: true,
    }).eq('id', user.id)

    router.push('/studio')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="text-center mb-10">
        <Moon size={32} className="text-violet-400 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-white mb-2">Bem-vinda ao OráculoAI</h1>
        <p className="text-zinc-400">Vamos personalizar a IA para o seu trabalho</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-violet-500' : i < step ? 'w-8 bg-violet-500/50' : 'w-8 bg-zinc-800'}`} />
        ))}
      </div>

      {/* Step 0: Brand name */}
      {step === 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Nome da sua marca ou perfil</label>
            <input
              type="text"
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              placeholder="Ex: Lua & Cristais, Astral da Cris, Caminho Interior..."
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
            />
            <p className="text-xs text-zinc-500 mt-2">Opcional — usaremos isso para personalizar seus conteúdos</p>
          </div>
          <button onClick={() => setStep(1)} className="w-full py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition">
            Continuar
          </button>
        </div>
      )}

      {/* Step 1: Sub-niche */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-4">Qual é o seu nicho principal?</label>
            <div className="grid grid-cols-2 gap-3">
              {SUB_NICHES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSubNiche(id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition ${
                    subNiche === id
                      ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-lg border border-zinc-800 text-zinc-300 font-medium hover:border-zinc-700 transition">
              Voltar
            </button>
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition">
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Visual style */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Estilo visual das suas criações</label>
            <p className="text-xs text-zinc-500 mb-4">A IA vai gerar imagens e layouts nesse estilo</p>
            <div className="space-y-3">
              {VISUAL_STYLES.map(({ id, label, desc, colors }) => (
                <button
                  key={id}
                  onClick={() => setVisualStyle(id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg border text-left transition ${
                    visualStyle === id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex gap-1">
                    {colors.map(c => (
                      <div key={c} className="w-5 h-5 rounded-full border border-zinc-700" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${visualStyle === id ? 'text-violet-300' : 'text-zinc-300'}`}>{label}</p>
                    <p className="text-xs text-zinc-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg border border-zinc-800 text-zinc-300 font-medium hover:border-zinc-700 transition">
              Voltar
            </button>
            <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition">
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Voice tone */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Tom de voz dos seus textos</label>
            <p className="text-xs text-zinc-500 mb-4">A IA vai escrever copies com essa personalidade</p>
            <div className="space-y-3">
              {VOICE_TONES.map(({ id, label, desc }) => (
                <button
                  key={id}
                  onClick={() => setVoiceTone(id)}
                  className={`w-full flex flex-col px-4 py-3 rounded-lg border text-left transition ${
                    voiceTone === id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <p className={`text-sm font-medium ${voiceTone === id ? 'text-violet-300' : 'text-zinc-300'}`}>{label}</p>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-lg border border-zinc-800 text-zinc-300 font-medium hover:border-zinc-700 transition">
              Voltar
            </button>
            <button onClick={handleFinish} disabled={saving} className="flex-1 py-3 rounded-lg bg-violet-600 text-white font-medium hover:bg-violet-500 transition disabled:opacity-50">
              {saving ? 'Salvando...' : 'Começar a criar ✨'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { Clock, ImageIcon } from 'lucide-react'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: generations } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-2">Histórico</h2>
      <p className="text-zinc-500 text-sm mb-6">Todas as suas gerações</p>

      {!generations?.length ? (
        <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center">
          <Clock size={48} className="mx-auto mb-3 text-zinc-700" />
          <p className="text-zinc-500">Nenhuma geração ainda</p>
          <p className="text-zinc-600 text-sm mt-1">Vá ao Studio para criar sua primeira imagem!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {generations.map(gen => (
            <div key={gen.id} className="group relative rounded-xl overflow-hidden border border-zinc-800">
              {gen.image_url ? (
                <img
                  src={gen.image_url}
                  alt={gen.prompt}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-square bg-zinc-900 flex items-center justify-center">
                  <ImageIcon size={24} className="text-zinc-700" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3">
                <p className="text-white text-xs line-clamp-2 mb-1">{gen.prompt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-[10px]">
                    {new Date(gen.created_at).toLocaleDateString('pt-BR')}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    gen.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    gen.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {gen.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

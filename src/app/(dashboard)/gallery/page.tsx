import { createClient } from '@/lib/supabase/server'
import { Image as ImageIcon } from 'lucide-react'

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: generations } = await supabase
    .from('generations')
    .select('*')
    .eq('status', 'completed')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-2">Galeria</h2>
      <p className="text-zinc-500 text-sm mb-6">Imagens criadas pela comunidade</p>

      {!generations?.length ? (
        <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center">
          <ImageIcon size={48} className="mx-auto mb-3 text-zinc-700" />
          <p className="text-zinc-500">Nenhuma imagem pública ainda</p>
          <p className="text-zinc-600 text-sm mt-1">Seja o primeiro a criar e compartilhar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {generations.map(gen => (
            <div key={gen.id} className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition">
              <img
                src={gen.image_url}
                alt={gen.prompt}
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <p className="text-white text-xs line-clamp-2">{gen.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

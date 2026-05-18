import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { headers } from 'next/headers'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isOnboarding = pathname.includes('/onboarding')

  if (profile && !profile.onboarding_done && !isOnboarding) {
    redirect('/onboarding')
  }

  return (
    <div className="flex h-screen bg-zinc-950">
      <Sidebar profile={profile} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}

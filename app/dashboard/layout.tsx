import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const supabase = await createClient()
  // const { data: { user } } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/auth/login')
  // }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

import { AppHeader } from '@/components/app-header'
import { getCurrentUser } from '@/lib/session'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:py-8">{children}</main>
    </div>
  )
}

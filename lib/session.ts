import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export type Rol = 'admin' | 'cliente'

export type SessionUser = {
  id: string
  name: string
  email: string
  role: Rol
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null
  const role = (session.user as { role?: string }).role === 'admin' ? 'admin' : 'cliente'
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role,
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/?aviso=login')
  return user
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser()
  if (user.role !== 'admin') redirect('/menu')
  return user
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogIn, LogOut } from 'lucide-react'
import { BrandMark } from '@/components/brand-logo'
import { NavIcon } from '@/components/nav-icon'
import { authClient } from '@/lib/auth-client'
import { NAV_ITEMS, puedeAcceder } from '@/lib/nav'
import type { SessionUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export function AppHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const items = NAV_ITEMS.filter((i) => puedeAcceder(i, user?.role ?? null))

  async function salir() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-30 bg-brand text-brand-foreground shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/menu" aria-label="TepyCheck, ir al menú principal">
          <BrandMark />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-right text-sm leading-tight sm:block">
            <span className="block font-medium">{user ? user.name : 'Invitado'}</span>
            <span className="block text-xs text-white/70">
              {user ? (user.role === 'admin' ? 'Administrador' : 'Cliente') : 'Sin sesión'}
            </span>
          </span>
          {user ? (
            <button
              type="button"
              onClick={salir}
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Salir
            </button>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg bg-teal px-3 py-2 text-sm font-medium text-teal-foreground hover:bg-teal/90"
            >
              <LogIn className="size-4" aria-hidden="true" />
              Ingresar
            </Link>
          )}
        </div>
      </div>
      <nav aria-label="Principal" className="border-t border-white/10">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2">
          {items.map((item) => {
            const activo = pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={activo ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm transition-colors',
                    activo
                      ? 'border-teal font-medium text-white'
                      : 'border-transparent text-white/70 hover:text-white',
                  )}
                >
                  <NavIcon icon={item.icon} className="size-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}

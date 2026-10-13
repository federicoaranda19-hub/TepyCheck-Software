import Link from 'next/link'
import { Lock } from 'lucide-react'
import { NavIcon } from '@/components/nav-icon'
import { NAV_ITEMS, puedeAcceder } from '@/lib/nav'
import { getCurrentUser } from '@/lib/session'
import { cn } from '@/lib/utils'

export default async function MenuPage() {
  const user = await getCurrentUser()
  const rol = user?.role ?? null
  const items = NAV_ITEMS.filter((i) => i.acceso !== 'admin' || rol === 'admin')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance text-2xl font-bold md:text-3xl">
          {user ? `Hola, ${user.name.split(' ')[0]}` : 'Bienvenido a TepyCheck'}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {user
            ? '¿Qué querés hacer hoy?'
            : 'Estás como invitado: podés ver productos y promociones.'}
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const habilitado = puedeAcceder(item, rol)
          const destacado = item.icon === 'carrito'
          return (
            <li key={item.href}>
              <Link
                href={habilitado ? item.href : '/?aviso=login'}
                className={cn(
                  'flex h-full items-center gap-4 rounded-xl border p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md',
                  destacado && habilitado
                    ? 'border-brand bg-brand text-brand-foreground'
                    : 'bg-card',
                  !habilitado && 'opacity-70',
                )}
              >
                <span
                  className={cn(
                    'flex size-12 shrink-0 items-center justify-center rounded-lg',
                    destacado && habilitado ? 'bg-teal text-teal-foreground' : 'bg-accent text-accent-foreground',
                  )}
                >
                  <NavIcon icon={item.icon} className="size-6" />
                </span>
                <span className="flex flex-col">
                  <span className="text-lg font-semibold">{item.label}</span>
                  <span
                    className={cn(
                      'text-sm',
                      destacado && habilitado ? 'text-white/75' : 'text-muted-foreground',
                    )}
                  >
                    {habilitado ? item.descripcion : 'Requiere iniciar sesión'}
                  </span>
                </span>
                {!habilitado && <Lock className="ml-auto size-4 text-muted-foreground" aria-label="Bloqueado" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

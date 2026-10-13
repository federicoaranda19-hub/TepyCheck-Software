'use client'

import { MiniAction, Panel } from '@/components/admin/ui'
import { cambiarRol } from '@/app/actions/admin'
import { formatFecha } from '@/lib/format'

type Usuario = { id: string; name: string; email: string; role: string | null; createdAt: Date }

export function AdminUsuarios({ usuarios, currentId }: { usuarios: Usuario[]; currentId: string }) {
  return (
    <Panel titulo={`Usuarios registrados (${usuarios.length})`}>
      <ul className="flex flex-col divide-y">
        {usuarios.map((u) => {
          const esAdmin = u.role === 'admin'
          return (
            <li key={u.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">
                  {u.name}
                  {u.id === currentId && <span className="ml-2 text-xs text-muted-foreground">(vos)</span>}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {u.email} · desde {formatFecha(u.createdAt)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={
                    esAdmin
                      ? 'rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-brand-foreground'
                      : 'rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'
                  }
                >
                  {esAdmin ? 'Administrador' : 'Cliente'}
                </span>
                {u.id !== currentId && (
                  <MiniAction
                    action={cambiarRol}
                    fields={{ userId: u.id, rol: esAdmin ? 'cliente' : 'admin' }}
                    label={esAdmin ? 'Quitar admin' : 'Hacer admin'}
                    confirmar={esAdmin ? `¿Quitar permisos de admin a ${u.name}?` : `¿Dar permisos de admin a ${u.name}?`}
                  />
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

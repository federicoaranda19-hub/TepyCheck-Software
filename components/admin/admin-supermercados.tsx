'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ActionForm, Estado, MiniAction, Panel } from '@/components/admin/ui'
import { crearSupermercado, toggleSupermercado } from '@/app/actions/admin'

type Super = { id: number; nombre: string; direccion: string | null; activo: boolean }

export function AdminSupermercados({ supermercados }: { supermercados: Super[] }) {
  return (
    <div className="flex flex-col gap-4">
      <Panel titulo="Nuevo supermercado">
        <ActionForm action={crearSupermercado} exito="Supermercado creado" className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-nombre">Nombre</Label>
            <Input id="s-nombre" name="nombre" required maxLength={120} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-dir">Dirección</Label>
            <Input id="s-dir" name="direccion" maxLength={200} placeholder="Opcional" />
          </div>
          <Button type="submit">
            <Plus aria-hidden="true" />
            Agregar
          </Button>
        </ActionForm>
      </Panel>
      <Panel titulo={`Supermercados (${supermercados.length})`}>
        <ul className="flex flex-col divide-y">
          {supermercados.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="font-medium">{s.nombre}</p>
                {s.direccion && <p className="text-xs text-muted-foreground">{s.direccion}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Estado activo={s.activo} />
                <MiniAction
                  action={toggleSupermercado}
                  fields={{ id: s.id }}
                  label={s.activo ? 'Desactivar' : 'Activar'}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

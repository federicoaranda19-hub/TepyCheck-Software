'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ActionForm, Estado, MiniAction, Panel } from '@/components/admin/ui'
import { crearProducto, toggleProducto } from '@/app/actions/admin'

type Producto = { id: number; descripcion: string; rubro: string; marca: string; unidad: string; activo: boolean }

export function AdminProductos({ productos }: { productos: Producto[] }) {
  const [q, setQ] = useState('')
  const lista = productos.filter((p) =>
    `${p.descripcion} ${p.marca} ${p.rubro}`.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-4">
      <Panel titulo="Nuevo producto">
        <ActionForm action={crearProducto} exito="Producto creado" className="grid gap-3 md:grid-cols-5 md:items-end">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label htmlFor="p-desc">Descripción</Label>
            <Input id="p-desc" name="descripcion" required maxLength={120} placeholder="Yerba mate 1 kg" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-rubro">Rubro</Label>
            <Input id="p-rubro" name="rubro" required maxLength={60} placeholder="Almacén" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p-marca">Marca</Label>
            <Input id="p-marca" name="marca" required maxLength={60} placeholder="Taragüí" />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="p-unidad">Unidad</Label>
              <Input id="p-unidad" name="unidad" required maxLength={30} defaultValue="unidad" />
            </div>
            <Button type="submit" size="icon" className="self-end" aria-label="Crear producto">
              <Plus />
            </Button>
          </div>
        </ActionForm>
      </Panel>

      <Panel titulo={`Productos (${productos.length})`}>
        <Input
          type="search"
          placeholder="Filtrar productos..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Filtrar productos"
        />
        <ul className="flex flex-col divide-y">
          {lista.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="truncate font-medium">{p.descripcion}</p>
                <p className="text-xs text-muted-foreground">
                  {p.marca} · {p.rubro} · {p.unidad}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Estado activo={p.activo} />
                <MiniAction
                  action={toggleProducto}
                  fields={{ id: p.id }}
                  label={p.activo ? 'Desactivar' : 'Activar'}
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

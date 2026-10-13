'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ActionForm, Estado, MiniAction, Panel, selectClass } from '@/components/admin/ui'
import { crearPromocion, eliminarPromocion, togglePromocion } from '@/app/actions/admin'
import { formatDia, formatPrecio } from '@/lib/format'

type Props = {
  productos: { id: number; descripcion: string }[]
  supermercados: { id: number; nombre: string }[]
  promociones: {
    id: number
    productoId: number
    supermercadoId: number
    titulo: string
    precioPromo: string
    fechaInicio: string
    fechaFin: string
    activo: boolean
  }[]
}

export function AdminPromociones({ productos, supermercados, promociones }: Props) {
  const nombreProd = new Map(productos.map((p) => [p.id, p.descripcion]))
  const nombreSuper = new Map(supermercados.map((s) => [s.id, s.nombre]))
  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <div className="flex flex-col gap-4">
      <Panel titulo="Nueva promoción">
        <ActionForm action={crearPromocion} exito="Promoción creada" className="grid gap-3 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-prod">Producto</Label>
            <select id="pm-prod" name="productoId" required className={selectClass}>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-super">Supermercado</Label>
            <select id="pm-super" name="supermercadoId" required className={selectClass}>
              {supermercados.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-titulo">Título</Label>
            <Input id="pm-titulo" name="titulo" required maxLength={80} placeholder="2x1, 30% off..." />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-precio">Precio promocional</Label>
            <Input id="pm-precio" name="precioPromo" type="number" step="0.01" min="0.01" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pm-ini">Desde</Label>
            <Input id="pm-ini" name="fechaInicio" type="date" required defaultValue={hoy} />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="pm-fin">Hasta</Label>
              <Input id="pm-fin" name="fechaFin" type="date" required />
            </div>
            <Button type="submit" size="icon" className="self-end" aria-label="Crear promoción">
              <Plus />
            </Button>
          </div>
        </ActionForm>
      </Panel>

      <Panel titulo={`Promociones (${promociones.length})`}>
        <ul className="flex flex-col divide-y">
          {promociones.map((p) => (
            <li key={p.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">
                  {nombreProd.get(p.productoId) ?? 'Producto'} · {p.titulo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nombreSuper.get(p.supermercadoId) ?? 'Supermercado'} · {formatPrecio(p.precioPromo)} ·{' '}
                  {formatDia(p.fechaInicio)} al {formatDia(p.fechaFin)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Estado activo={p.activo && p.fechaFin >= hoy} />
                <MiniAction action={togglePromocion} fields={{ id: p.id }} label={p.activo ? 'Pausar' : 'Activar'} />
                <MiniAction
                  action={eliminarPromocion}
                  fields={{ id: p.id }}
                  label="Eliminar"
                  variant="destructive"
                  confirmar="¿Eliminar esta promoción?"
                />
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

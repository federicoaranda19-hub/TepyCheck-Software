'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ActionForm, Estado, MiniAction, Panel, selectClass } from '@/components/admin/ui'
import {
  crearPromocion,
  editarPromocion,
  eliminarPromocion,
  togglePromocion,
} from '@/app/actions/admin'
import { formatDia, formatPrecio } from '@/lib/format'

type Promo = {
  id: number
  productoId: number
  supermercadoId: number
  titulo: string
  precioPromo: string
  fechaInicio: string
  fechaFin: string
  activo: boolean
}

type Props = {
  productos: { id: number; descripcion: string }[]
  supermercados: { id: number; nombre: string }[]
  promociones: Promo[]
}

export function AdminPromociones({ productos, supermercados, promociones }: Props) {
  const nombreProd = new Map(productos.map((p) => [p.id, p.descripcion]))
  const nombreSuper = new Map(supermercados.map((s) => [s.id, s.nombre]))
  const hoy = new Date().toISOString().slice(0, 10)

  const [editando, setEditando] = useState<Promo | null>(null)
  const [pending, startTransition] = useTransition()

  const [productoId, setProductoId] = useState('')
  const [supermercadoId, setSupermercadoId] = useState('')
  const [titulo, setTitulo] = useState('')
  const [precioPromo, setPrecioPromo] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  function empezarEdicion(p: Promo) {
    setEditando(p)
    setProductoId(String(p.productoId))
    setSupermercadoId(String(p.supermercadoId))
    setTitulo(p.titulo)
    setPrecioPromo(String(p.precioPromo))
    setFechaInicio(p.fechaInicio.slice(0, 10))
    setFechaFin(p.fechaFin.slice(0, 10))
  }

  function cancelarEdicion() {
    setEditando(null)
  }

  function guardarEdicion() {
    if (!editando) return

    const formData = new FormData()
    formData.set('id', String(editando.id))
    formData.set('productoId', productoId)
    formData.set('supermercadoId', supermercadoId)
    formData.set('titulo', titulo.trim())
    formData.set('precioPromo', precioPromo)
    formData.set('fechaInicio', fechaInicio)
    formData.set('fechaFin', fechaFin)

    startTransition(async () => {
      try {
        await editarPromocion(formData)
        toast.success('Promoción actualizada')
        cancelarEdicion()
      } catch (err) {
        console.error(err)
        toast.error(err instanceof Error ? err.message : 'No se pudo guardar')
      }
    })
  }

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

      {editando && (
        <section className="flex flex-col gap-4 rounded-xl border-2 border-red-500 bg-card p-4 md:p-5">
          <h2 className="font-semibold text-red-600">
            Editando: {nombreProd.get(editando.productoId) ?? 'Promoción'}
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-prod">Producto</Label>
              <select
                id="e-prod"
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                className={selectClass}
              >
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-super">Supermercado</Label>
              <select
                id="e-super"
                value={supermercadoId}
                onChange={(e) => setSupermercadoId(e.target.value)}
                className={selectClass}
              >
                {supermercados.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-titulo">Título</Label>
              <Input
                id="e-titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                maxLength={80}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-precio">Precio promocional</Label>
              <Input
                id="e-precio"
                type="number"
                step="0.01"
                min="0.01"
                value={precioPromo}
                onChange={(e) => setPrecioPromo(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-ini">Desde</Label>
              <Input
                id="e-ini"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="e-fin">Hasta</Label>
                <Input
                  id="e-fin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <Button type="button" className="self-end" disabled={pending} onClick={guardarEdicion}>
                {pending ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="self-end"
                onClick={cancelarEdicion}
                disabled={pending}
              >
                <X />
              </Button>
            </div>
          </div>
        </section>
      )}

      <Panel titulo={`Promociones (${promociones.length})`}>
        <ul className="flex flex-col divide-y">
          {promociones.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">
                  {nombreProd.get(p.productoId) ?? 'Producto'} · {p.titulo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nombreSuper.get(p.supermercadoId) ?? 'Supermercado'} · {formatPrecio(p.precioPromo)} ·{' '}
                  {formatDia(p.fechaInicio)} al {formatDia(p.fechaFin)}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Estado activo={p.activo && p.fechaFin >= hoy} />
                <Button type="button" variant="outline" size="sm" onClick={() => empezarEdicion(p)}>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
                <MiniAction
                  action={togglePromocion}
                  fields={{ id: p.id }}
                  label={p.activo ? 'Pausar' : 'Activar'}
                />
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
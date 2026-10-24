'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ActionForm, Estado, MiniAction, Panel } from '@/components/admin/ui'
import { crearProducto, toggleProducto, editarProducto, eliminarProducto } from '@/app/actions/admin'

type Producto = {
  id: number
  descripcion: string
  rubro: string
  marca: string
  unidad: string
  activo: boolean
}

export function AdminProductos({ productos }: { productos: Producto[] }) {
  const [q, setQ] = useState('')
  const [filtroRubro, setFiltroRubro] = useState('')
  const [filtroMarca, setFiltroMarca] = useState('')
  const [editando, setEditando] = useState<Producto | null>(null)
  const [pending, startTransition] = useTransition()

  const [descripcion, setDescripcion] = useState('')
  const [rubro, setRubro] = useState('')
  const [marca, setMarca] = useState('')
  const [unidad, setUnidad] = useState('')

  // Listas únicas de rubros y marcas para los select
  const rubros = Array.from(new Set(productos.map((p) => p.rubro))).sort()
  const marcas = Array.from(new Set(productos.map((p) => p.marca))).sort()

  const lista = productos.filter((p) => {
    const texto = `${p.descripcion} ${p.marca} ${p.rubro}`.toLowerCase()
    const coincideTexto = texto.includes(q.toLowerCase())
    const coincideRubro = !filtroRubro || p.rubro === filtroRubro
    const coincideMarca = !filtroMarca || p.marca === filtroMarca
    return coincideTexto && coincideRubro && coincideMarca
  })

  function empezarEdicion(p: Producto) {
    setEditando(p)
    setDescripcion(p.descripcion)
    setRubro(p.rubro)
    setMarca(p.marca)
    setUnidad(p.unidad)
  }

  function cancelarEdicion() {
    setEditando(null)
    setDescripcion('')
    setRubro('')
    setMarca('')
    setUnidad('')
  }

  function guardarEdicion() {
    if (!editando) return

    const formData = new FormData()
    formData.set('id', String(editando.id))
    formData.set('descripcion', descripcion.trim())
    formData.set('rubro', rubro.trim())
    formData.set('marca', marca.trim())
    formData.set('unidad', unidad.trim())

    startTransition(async () => {
      try {
        await editarProducto(formData)
        toast.success('Producto actualizado')
        cancelarEdicion()
      } catch (err) {
        console.error(err)
        toast.error(err instanceof Error ? err.message : 'No se pudo guardar')
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Nuevo producto */}
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

      {/* Formulario de edición */}
      {editando && (
        <section className="flex flex-col gap-4 rounded-xl border-2 border-red-500 bg-card p-4 md:p-5">
          <h2 className="font-semibold text-red-600">Editando: {editando.descripcion}</h2>
          <div className="grid gap-3 md:grid-cols-5 md:items-end">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="e-desc">Descripción</Label>
              <Input
                id="e-desc"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                maxLength={120}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-rubro">Rubro</Label>
              <Input
                id="e-rubro"
                value={rubro}
                onChange={(e) => setRubro(e.target.value)}
                maxLength={60}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="e-marca">Marca</Label>
              <Input
                id="e-marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                maxLength={60}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="e-unidad">Unidad</Label>
                <Input
                  id="e-unidad"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  maxLength={30}
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

      {/* Listado con filtros */}
      <Panel titulo={`Productos (${lista.length} de ${productos.length})`}>
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            type="search"
            placeholder="Buscar por nombre..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar productos"
          />

          <select
            value={filtroRubro}
            onChange={(e) => setFiltroRubro(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
            aria-label="Filtrar por rubro"
          >
            <option value="">Todos los rubros</option>
            {rubros.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
            aria-label="Filtrar por marca"
          >
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <ul className="mt-3 flex flex-col divide-y">
          {lista.length === 0 ? (
            <li className="py-6 text-center text-sm text-muted-foreground">
              No se encontraron productos con esos filtros.
            </li>
          ) : (
            lista.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium">{p.descripcion}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.marca} · {p.rubro} · {p.unidad}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Estado activo={p.activo} />

                  <Button type="button" variant="outline" size="sm" onClick={() => empezarEdicion(p)}>
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>

                  <MiniAction
                    action={toggleProducto}
                    fields={{ id: p.id }}
                    label={p.activo ? 'Desactivar' : 'Activar'}
                  />

                  <MiniAction
                    action={eliminarProducto}
                    fields={{ id: p.id }}
                    label="Eliminar"
                    variant="destructive"
                    confirmar="¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer."
                  />
                </div>
              </li>
            ))
          )}
        </ul>
      </Panel>
    </div>
  )
}
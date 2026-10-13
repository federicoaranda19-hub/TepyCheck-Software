'use client'

import { useState } from 'react'
import { Check, Pencil, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ProductoCatalogo } from '@/lib/data'
import { formatPrecio } from '@/lib/format'

export type LineaCarrito = {
  producto: ProductoCatalogo
  cantidad: number
  precioRegular: number | null
  precioAbonar: number | null
  subtotal: number | null
  enOferta: boolean
}

type Props = {
  lineas: LineaCarrito[]
  onModificar: (id: number, cantidad: number) => void
  onEliminar: (id: number) => void
}

export function TablaCarrito({ lineas, onModificar, onEliminar }: Props) {
  const [editando, setEditando] = useState<number | null>(null)
  const [valor, setValor] = useState('')

  if (lineas.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">
        <ShoppingCart className="size-8" aria-hidden="true" />
        <p>Tu carrito está vacío. Buscá productos y tocá Agregar.</p>
      </div>
    )
  }

  function iniciar(l: LineaCarrito) {
    setEditando(l.producto.id)
    setValor(String(l.cantidad))
  }

  function confirmar(id: number) {
    const n = Number.parseInt(valor, 10)
    if (Number.isInteger(n) && n > 0) onModificar(id, n)
    setEditando(null)
  }

  const precio = (v: number | null) => (v === null ? '—' : formatPrecio(v))

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full text-sm">
        <thead className="hidden bg-brand text-left text-brand-foreground md:table-header-group">
          <tr>
            <th scope="col" className="px-3 py-2.5 font-medium">Descripción</th>
            <th scope="col" className="px-3 py-2.5 text-center font-medium">Cantidad</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Precio Regular</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Precio a Abonar</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">Subtotal</th>
            <th scope="col" className="px-3 py-2.5 text-right font-medium">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {lineas.map((l) => {
            const id = l.producto.id
            const enEdicion = editando === id
            return (
              <tr key={id} className="grid grid-cols-2 gap-x-3 gap-y-1 p-3 md:table-row md:p-0">
                <td className="col-span-2 md:px-3 md:py-3">
                  <span className="font-medium">{l.producto.descripcion}</span>
                  <span className="block text-xs text-muted-foreground">{l.producto.marca}</span>
                  {l.subtotal === null && (
                    <span className="block text-xs text-destructive">No disponible en este supermercado</span>
                  )}
                </td>
                <td className="md:px-3 md:py-3 md:text-center">
                  <span className="mr-1 text-xs text-muted-foreground md:hidden">Cant.:</span>
                  {enEdicion ? (
                    <form
                      className="inline-flex items-center gap-1"
                      onSubmit={(e) => {
                        e.preventDefault()
                        confirmar(id)
                      }}
                    >
                      <Input
                        type="number"
                        min={1}
                        max={999}
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        aria-label={`Cantidad de ${l.producto.descripcion}`}
                        className="h-8 w-16"
                        autoFocus
                      />
                      <Button type="submit" size="icon-sm" aria-label="Confirmar cantidad">
                        <Check />
                      </Button>
                    </form>
                  ) : (
                    <span className="font-medium tabular-nums">{l.cantidad}</span>
                  )}
                </td>
                <td className="text-right tabular-nums md:px-3 md:py-3">
                  <span className="mr-1 text-xs text-muted-foreground md:hidden">Regular:</span>
                  <span className={l.enOferta ? 'text-muted-foreground line-through' : ''}>
                    {precio(l.precioRegular)}
                  </span>
                </td>
                <td className="tabular-nums md:px-3 md:py-3 md:text-right">
                  <span className="mr-1 text-xs text-muted-foreground md:hidden">A abonar:</span>
                  <span className={l.enOferta ? 'font-semibold text-accent-foreground' : ''}>
                    {precio(l.precioAbonar)}
                  </span>
                </td>
                <td className="text-right font-semibold tabular-nums md:px-3 md:py-3">
                  <span className="mr-1 text-xs font-normal text-muted-foreground md:hidden">Subtotal:</span>
                  {precio(l.subtotal)}
                </td>
                <td className="col-span-2 flex justify-end gap-1 md:table-cell md:px-3 md:py-3 md:text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (enEdicion ? confirmar(id) : iniciar(l))}
                    aria-label={`Modificar cantidad de ${l.producto.descripcion}`}
                  >
                    <Pencil aria-hidden="true" />
                    <span className="md:sr-only">Modificar</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEliminar(id)}
                    className="text-destructive hover:text-destructive"
                    aria-label={`Eliminar ${l.producto.descripcion}`}
                  >
                    <Trash2 aria-hidden="true" />
                    <span className="md:sr-only">Eliminar</span>
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

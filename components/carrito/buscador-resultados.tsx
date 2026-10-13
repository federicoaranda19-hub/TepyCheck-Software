'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ProductoCatalogo } from '@/lib/data'
import { formatPrecio } from '@/lib/format'

const VISIBLES = 8

export function BuscadorResultados({
  productos,
  supermercadoId,
  cantidades,
  onAgregar,
}: {
  productos: ProductoCatalogo[]
  supermercadoId: number | null
  cantidades: Record<number, number>
  onAgregar: (id: number, cantidad: number) => void
}) {
  const [verTodos, setVerTodos] = useState(false)

  if (supermercadoId === null) {
    return <p className="text-sm text-muted-foreground">Seleccioná un supermercado para ver productos.</p>
  }
  if (productos.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No hay productos con esos filtros en este supermercado.
      </p>
    )
  }

  const lista = verTodos ? productos : productos.slice(0, VISIBLES)

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y rounded-lg border">
        {lista.map((p) => (
          <FilaProducto
            key={p.id}
            producto={p}
            supermercadoId={supermercadoId}
            enCarrito={cantidades[p.id] ?? 0}
            onAgregar={onAgregar}
          />
        ))}
      </ul>
      {productos.length > VISIBLES && (
        <Button variant="ghost" size="sm" onClick={() => setVerTodos((v) => !v)} className="self-center">
          {verTodos ? 'Ver menos' : `Ver los ${productos.length} productos`}
        </Button>
      )}
    </div>
  )
}

function FilaProducto({
  producto,
  supermercadoId,
  enCarrito,
  onAgregar,
}: {
  producto: ProductoCatalogo
  supermercadoId: number
  enCarrito: number
  onAgregar: (id: number, cantidad: number) => void
}) {
  const [cantidad, setCantidad] = useState(1)
  const precio = producto.precios[supermercadoId]

  return (
    <li className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium leading-snug">{producto.descripcion}</p>
        <p className="text-xs text-muted-foreground">
          {producto.marca} · {producto.rubro}
          {enCarrito > 0 && <span className="ml-2 font-medium text-accent-foreground">({enCarrito} en carrito)</span>}
        </p>
        <p className="mt-1 text-sm">
          {precio.promo !== null ? (
            <>
              <span className="mr-2 text-muted-foreground line-through">{formatPrecio(precio.regular)}</span>
              <span className="font-semibold text-accent-foreground">{formatPrecio(precio.promo)}</span>
              <span className="ml-2 rounded bg-teal px-1.5 py-0.5 text-xs font-medium text-teal-foreground">
                {precio.promoTitulo}
              </span>
            </>
          ) : (
            <span className="font-semibold">{formatPrecio(precio.regular)}</span>
          )}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Restar cantidad"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
          >
            <Minus />
          </Button>
          <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
            {cantidad}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Sumar cantidad"
            onClick={() => setCantidad((c) => Math.min(99, c + 1))}
          >
            <Plus />
          </Button>
        </div>
        <Button
          onClick={() => {
            onAgregar(producto.id, cantidad)
            setCantidad(1)
          }}
          aria-label={`Agregar ${producto.descripcion}`}
        >
          <Plus aria-hidden="true" />
          Agregar
        </Button>
      </div>
    </li>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LineaCarrito } from '@/components/carrito/tabla-carrito'
import { formatPrecio } from '@/lib/format'

export function Presupuesto({
  supermercado,
  lineas,
  totales,
  onClose,
}: {
  supermercado: string
  lineas: LineaCarrito[]
  totales: { cantidad: number; total: number; regular: number }
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  const ahorro = totales.regular - totales.total

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="presupuesto-titulo"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl bg-card p-0 text-foreground shadow-2xl backdrop:bg-brand/60"
    >
      <div className="flex items-center justify-between bg-brand px-5 py-4 text-brand-foreground">
        <div>
          <h2 id="presupuesto-titulo" className="text-lg font-semibold">
            Presupuesto
          </h2>
          <p className="text-sm text-white/75">{supermercado}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => ref.current?.close()}
          aria-label="Cerrar presupuesto"
          className="text-white hover:bg-white/10 hover:text-white"
        >
          <X />
        </Button>
      </div>
      <ul className="max-h-[50vh] divide-y overflow-y-auto px-5">
        {lineas.map((l) => (
          <li key={l.producto.id} className="flex items-start justify-between gap-3 py-3 text-sm">
            <div>
              <p className="font-medium">{l.producto.descripcion}</p>
              <p className="text-xs text-muted-foreground">
                {l.cantidad} x {formatPrecio(l.precioAbonar ?? 0)}
                {l.enOferta && ' (oferta)'}
              </p>
            </div>
            <span className="font-semibold tabular-nums">{formatPrecio(l.subtotal ?? 0)}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-1 border-t bg-muted px-5 py-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cantidad total</span>
          <span className="font-medium">{totales.cantidad}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total sin promociones</span>
          <span className="font-medium tabular-nums">{formatPrecio(totales.regular)}</span>
        </div>
        {ahorro > 0.009 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ahorro</span>
            <span className="font-medium text-accent-foreground tabular-nums">-{formatPrecio(ahorro)}</span>
          </div>
        )}
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-semibold">Monto total</span>
          <span className="text-2xl font-bold tabular-nums">{formatPrecio(totales.total)}</span>
        </div>
      </div>
    </dialog>
  )
}

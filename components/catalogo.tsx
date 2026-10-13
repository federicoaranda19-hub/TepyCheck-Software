'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FiltrosProductos } from '@/components/filtros-productos'
import type { ProductoCatalogo, Supermercado } from '@/lib/data'
import { FILTROS_INICIALES, filtrarProductos, opciones } from '@/lib/filtros'
import { formatPrecio } from '@/lib/format'

export function Catalogo({
  supermercados,
  productos,
}: {
  supermercados: Supermercado[]
  productos: ProductoCatalogo[]
}) {
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const { rubros, marcas } = useMemo(() => opciones(productos), [productos])
  const lista = useMemo(() => filtrarProductos(productos, filtros, null), [productos, filtros])

  return (
    <div className="flex flex-col gap-4">
      <FiltrosProductos filtros={filtros} onChange={setFiltros} rubros={rubros} marcas={marcas} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {lista.length} {lista.length === 1 ? 'producto' : 'productos'}
      </p>

      <ul className="grid gap-3 md:grid-cols-2">
        {lista.map((p) => (
          <li key={p.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold leading-snug">{p.descripcion}</h2>
                <p className="text-sm text-muted-foreground">
                  {p.marca} · {p.rubro}
                </p>
              </div>
            </div>
            <ul className="mt-3 flex flex-col divide-y text-sm">
              {supermercados.map((s) => {
                const precio = p.precios[s.id]
                return (
                  <li key={s.id} className="flex items-center justify-between gap-2 py-2">
                    <span className="text-muted-foreground">{s.nombre}</span>
                    {precio ? (
                      precio.promo !== null ? (
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrecio(precio.regular)}
                          </span>
                          <span className="font-semibold text-accent-foreground">
                            {formatPrecio(precio.promo)}
                          </span>
                          <Badge className="bg-teal text-teal-foreground">{precio.promoTitulo}</Badge>
                        </span>
                      ) : (
                        <span className="font-medium">{formatPrecio(precio.regular)}</span>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin precio</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
      {lista.length === 0 && (
        <p className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">
          No encontramos productos con esos filtros.
        </p>
      )}
    </div>
  )
}

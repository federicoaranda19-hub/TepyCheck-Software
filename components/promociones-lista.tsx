'use client'

import { useMemo, useState } from 'react'
import { Tag } from 'lucide-react'
import type { PromocionVigente } from '@/lib/data'
import { formatDia, formatPrecio } from '@/lib/format'

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function PromocionesLista({ promos }: { promos: PromocionVigente[] }) {
  const [busqueda, setBusqueda] = useState('')
  const [rubro, setRubro] = useState('')
  const [marca, setMarca] = useState('')

  const rubros = useMemo(
    () => [...new Set(promos.map((p) => p.rubro))].sort((a, b) => a.localeCompare(b, 'es')),
    [promos],
  )
  const marcas = useMemo(
    () => [...new Set(promos.map((p) => p.marca))].sort((a, b) => a.localeCompare(b, 'es')),
    [promos],
  )

  const lista = useMemo(() => {
    const q = normalizar(busqueda.trim())
    const palabras = q.split(/\s+/).filter(Boolean)

    return promos.filter((p) => {
      if (rubro && p.rubro !== rubro) return false
      if (marca && p.marca !== marca) return false
      if (palabras.length === 0) return true
      const texto = normalizar(`${p.producto} ${p.marca} ${p.rubro} ${p.titulo}`)
      return palabras.every((palabra) => texto.includes(palabra))
    })
  }, [promos, busqueda, rubro, marca])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          type="search"
          placeholder="Buscar por nombre, marca o rubro..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-teal-500"
          aria-label="Buscar promociones"
        />

        <select
          value={rubro}
          onChange={(e) => setRubro(e.target.value)}
          className="h-11 w-full rounded-md border border-[#24435e] bg-[#0b263f] px-3 text-sm text-white"
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
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="h-11 w-full rounded-md border border-[#24435e] bg-[#0b263f] px-3 text-sm text-white"
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

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {lista.length} {lista.length === 1 ? 'promoción' : 'promociones'}
      </p>

      {lista.length === 0 ? (
        <p className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">
          No hay promociones con esos filtros.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((p) => {
            const ahorro =
              p.precioRegular !== null && p.precioRegular > p.precioPromo
                ? Math.round((1 - p.precioPromo / p.precioRegular) * 100)
                : null

            return (
              <li key={p.id} className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  {p.imagen ? (
                    <img
                      src={p.imagen}
                      alt={p.producto}
                      className="h-20 w-20 shrink-0 rounded-xl border object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border bg-muted text-xs text-muted-foreground">
                      Sin foto
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-full bg-teal px-2.5 py-1 text-xs font-semibold text-teal-foreground">
                        <Tag className="size-3.5" aria-hidden="true" />
                        {p.titulo}
                      </span>
                      {ahorro !== null && (
                        <span className="text-sm font-semibold text-accent-foreground">-{ahorro}%</span>
                      )}
                    </div>
                    <h2 className="font-semibold leading-snug">{p.producto}</h2>
                    <p className="text-sm text-muted-foreground">
                      {p.marca} · {p.rubro}
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{formatPrecio(p.precioPromo)}</span>
                  {p.precioRegular !== null && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrecio(p.precioRegular)}
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between border-t pt-3 text-sm">
                  <span className="font-medium">{p.supermercado}</span>
                  <span className="text-muted-foreground">Hasta {formatDia(p.fechaFin)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
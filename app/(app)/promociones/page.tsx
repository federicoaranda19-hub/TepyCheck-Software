import { Tag } from 'lucide-react'
import { getPromocionesVigentes } from '@/lib/data'
import { formatDia, formatPrecio } from '@/lib/format'

export const metadata = { title: 'Promociones - TepyCheck' }

export default async function PromocionesPage() {
  const promos = await getPromocionesVigentes()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Promociones vigentes</h1>
        <p className="mt-1 text-muted-foreground">Ofertas activas hoy en los supermercados de Corrientes.</p>
      </div>

      {promos.length === 0 ? (
        <p className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">
          No hay promociones vigentes en este momento.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((p) => {
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

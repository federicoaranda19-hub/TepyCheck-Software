import Link from 'next/link'
import { notFound } from 'next/navigation'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { EliminarSimulacionButton } from '@/components/eliminar-simulacion'
import { db } from '@/lib/db'
import { simulacionItems, simulaciones } from '@/lib/db/schema'
import { formatFecha, formatPrecio } from '@/lib/format'
import { requireUser } from '@/lib/session'

export default async function DetalleSimulacionPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()

  const [sim] = await db
    .select()
    .from(simulaciones)
    .where(and(eq(simulaciones.id, id), eq(simulaciones.userId, user.id)))
  if (!sim) notFound()

  const items = await db.select().from(simulacionItems).where(eq(simulacionItems.simulacionId, sim.id))
  const ahorro = Number(sim.montoRegular) - Number(sim.montoTotal)

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link href="/historial" className={`${buttonVariants({ variant: 'ghost', size: 'sm' })} self-start`}>
        <ArrowLeft aria-hidden="true" />
        Volver al historial
      </Link>

      <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <header className="bg-brand px-5 py-4 text-brand-foreground">
          <h1 className="text-xl font-semibold">Resumen de compra</h1>
          <p className="text-sm text-white/75">
            {sim.supermercadoNombre} · {formatFecha(sim.createdAt)}
          </p>
        </header>
        <ul className="divide-y px-5">
          {items.map((it) => {
            const oferta = Number(it.precioAbonar) < Number(it.precioRegular)
            return (
              <li key={it.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">{it.descripcion}</p>
                  <p className="text-xs text-muted-foreground">
                    {it.cantidad} x {formatPrecio(it.precioAbonar)}
                    {oferta && (
                      <span className="ml-1 line-through">{formatPrecio(it.precioRegular)}</span>
                    )}
                  </p>
                </div>
                <span className="font-semibold tabular-nums">{formatPrecio(it.subtotal)}</span>
              </li>
            )
          })}
        </ul>
        <footer className="flex flex-col gap-1 border-t bg-muted px-5 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cantidad total</span>
            <span className="font-medium">{sim.cantidadProductos}</span>
          </div>
          {ahorro > 0.009 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ahorro por promociones</span>
              <span className="font-medium text-accent-foreground">-{formatPrecio(ahorro)}</span>
            </div>
          )}
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-semibold">Monto total</span>
            <span className="text-2xl font-bold tabular-nums">{formatPrecio(sim.montoTotal)}</span>
          </div>
        </footer>
      </article>

      <EliminarSimulacionButton id={sim.id} />
    </div>
  )
}

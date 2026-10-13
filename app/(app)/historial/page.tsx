import Link from 'next/link'
import { desc, eq } from 'drizzle-orm'
import { ChevronRight, History } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { db } from '@/lib/db'
import { simulaciones } from '@/lib/db/schema'
import { formatFecha, formatPrecio } from '@/lib/format'
import { requireUser } from '@/lib/session'

export const metadata = { title: 'Mi Historial - TepyCheck' }

export default async function HistorialPage() {
  const user = await requireUser()
  const lista = await db
    .select()
    .from(simulaciones)
    .where(eq(simulaciones.userId, user.id))
    .orderBy(desc(simulaciones.createdAt))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Mi Historial</h1>
        <p className="mt-1 text-muted-foreground">Tus simulaciones de compra guardadas.</p>
      </div>

      {lista.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card p-10 text-center">
          <History className="size-8 text-muted-foreground" aria-hidden="true" />
          <p className="text-muted-foreground">Todavía no guardaste ninguna simulación.</p>
          <Link href="/carrito" className={buttonVariants()}>
            Armar un carrito
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-brand text-left text-brand-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Fecha</th>
                <th scope="col" className="px-4 py-3 font-medium">Supermercado</th>
                <th scope="col" className="hidden px-4 py-3 text-center font-medium sm:table-cell">
                  Productos
                </th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Monto total</th>
                <th scope="col" className="w-10 px-2 py-3">
                  <span className="sr-only">Ver detalle</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {lista.map((s) => (
                <tr key={s.id} className="relative hover:bg-muted/60">
                  <td className="px-4 py-3 tabular-nums">{formatFecha(s.createdAt)}</td>
                  <td className="px-4 py-3">
                    {s.supermercadoNombre}
                    <span className="block text-xs text-muted-foreground sm:hidden">
                      {s.cantidadProductos} productos
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-center tabular-nums sm:table-cell">
                    {s.cantidadProductos}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {formatPrecio(s.montoTotal)}
                  </td>
                  <td className="px-2 py-3">
                    <Link
                      href={`/historial/${s.id}`}
                      className="after:absolute after:inset-0"
                      aria-label={`Ver detalle de la simulación del ${formatFecha(s.createdAt)}`}
                    >
                      <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

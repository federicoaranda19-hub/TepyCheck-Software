import { PromocionesLista } from '@/components/promociones-lista'
import { getPromocionesVigentes } from '@/lib/data'

export const metadata = { title: 'Promociones - TepyCheck' }

export default async function PromocionesPage() {
  const promos = await getPromocionesVigentes()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Promociones vigentes</h1>
        <p className="mt-1 text-muted-foreground">
          Ofertas activas hoy en los supermercados de Corrientes.
        </p>
      </div>

      {promos.length === 0 ? (
        <p className="rounded-xl border border-dashed bg-card p-8 text-center text-muted-foreground">
          No hay promociones vigentes en este momento.
        </p>
      ) : (
        <PromocionesLista promos={promos} />
      )}
    </div>
  )
}
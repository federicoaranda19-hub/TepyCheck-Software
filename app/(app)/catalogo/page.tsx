import { Catalogo } from '@/components/catalogo'
import { getCatalogo, getSupermercadosActivos } from '@/lib/data'

export const metadata = { title: 'Catálogo de Productos - TepyCheck' }

export default async function CatalogoPage() {
  const [supermercados, productos] = await Promise.all([getSupermercadosActivos(), getCatalogo()])
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Catálogo de Productos</h1>
        <p className="mt-1 text-muted-foreground">Compará precios regulares y promociones por supermercado.</p>
      </div>
      <Catalogo supermercados={supermercados} productos={productos} />
    </div>
  )
}

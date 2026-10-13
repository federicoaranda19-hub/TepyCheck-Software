import { Carrito } from '@/components/carrito/carrito'
import { getCatalogo, getSupermercadosActivos } from '@/lib/data'
import { requireUser } from '@/lib/session'

export const metadata = { title: 'Carrito - TepyCheck' }

export default async function CarritoPage() {
  await requireUser()
  const [supermercados, productos] = await Promise.all([getSupermercadosActivos(), getCatalogo()])
  return <Carrito supermercados={supermercados} productos={productos} />
}

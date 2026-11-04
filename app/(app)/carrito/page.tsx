
import { Carrito } from '@/components/carrito/carrito'
import { getCatalogo, getSupermercadosActivos } from '@/lib/data'
import { requireUser } from '@/lib/session'

export const metadata = { title: 'Carrito - TepyCheck' }

export default async function CarritoPage() {
  const user = await requireUser()

  const [supermercados, productos] = await Promise.all([
    getSupermercadosActivos(),
    getCatalogo(),
  ])

  const puedeGuardarHistorial = user.role === 'cliente'

  return (
    <Carrito
      supermercados={supermercados}
      productos={productos}
      puedeGuardarHistorial={puedeGuardarHistorial}
    />
  )
}

'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { eliminarSimulacion } from '@/app/actions/simulaciones'

export function EliminarSimulacionButton({ id }: { id: number }) {
  const router = useRouter()
  const [pending, start] = useTransition()

  return (
    <Button
      variant="outline"
      className="self-end text-destructive hover:text-destructive"
      disabled={pending}
      onClick={() => {
        if (!window.confirm('¿Eliminar esta simulación del historial?')) return
        start(async () => {
          await eliminarSimulacion(id)
          toast.success('Simulación eliminada')
          router.push('/historial')
        })
      }}
    >
      <Trash2 aria-hidden="true" />
      Eliminar simulación
    </Button>
  )
}

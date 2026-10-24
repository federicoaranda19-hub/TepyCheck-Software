'use client'

import { useRef, useTransition, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const selectClass =
  'h-10 w-full rounded-md border border-input bg-card px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50'

export function Panel({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border bg-card p-4 md:p-5">
      <h2 className="font-semibold">{titulo}</h2>
      {children}
    </section>
  )
}

export function ActionForm({
  action,
  children,
  className,
  exito,
  reset = true,
  onSuccess,
}: {
  action: (form: FormData) => Promise<void>
  children: ReactNode
  className?: string
  exito?: string
  reset?: boolean
  onSuccess?: () => void
}) {
  const ref = useRef<HTMLFormElement>(null)
  const [pending, start] = useTransition()

  return (
    <form
      ref={ref}
      className={cn(className, pending && 'pointer-events-none opacity-60')}
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        start(async () => {
          try {
            await action(data)
            if (exito) toast.success(exito)
            if (reset) ref.current?.reset()
            onSuccess?.()
} catch (err) {
  console.error(err)
  toast.error(err instanceof Error ? err.message : 'No se pudo guardar. Revisá los datos.')
}
        })
      }}
    >
      {children}
    </form>
  )
}

export function MiniAction({
  action,
  fields,
  label,
  variant = 'outline',
  confirmar,
}: {
  action: (form: FormData) => Promise<void>
  fields: Record<string, string | number>
  label: string
  variant?: 'outline' | 'destructive' | 'ghost'
  confirmar?: string
}) {
  const [pending, start] = useTransition()
  return (
    <Button
      size="sm"
      variant={variant}
      disabled={pending}
      onClick={() => {
        if (confirmar && !window.confirm(confirmar)) return
        const data = new FormData()
        for (const [k, v] of Object.entries(fields)) data.set(k, String(v))
        start(async () => {
try {
  await action(data)
  if (label === 'Eliminar') {
    toast('Producto eliminado', {
      icon: '🗑️',
    })
  } else {
    toast.success('Acción realizada')
  }
} catch {
  toast.error('No se pudo completar la acción.')
}
        })
      }}
    >
      {label}
    </Button>
  )
}

export function Estado({ activo }: { activo: boolean }) {
  return (
    <span
      className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium',
        activo ? 'bg-teal/15 text-accent-foreground' : 'bg-muted text-muted-foreground',
      )}
    >
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  )
}

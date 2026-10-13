import { formatPrecio } from '@/lib/format'

export function PanelTotales({
  cantidad,
  total,
  ahorro,
}: {
  cantidad: number
  total: number
  ahorro: number
}) {
  return (
    <section
      aria-label="Totales"
      className="hidden flex-col gap-3 rounded-xl bg-brand p-5 text-brand-foreground shadow-md lg:flex"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/75">Cantidad total</span>
        <span className="font-semibold tabular-nums">{cantidad}</span>
      </div>
      {ahorro > 0.009 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/75">Ahorro por promos</span>
          <span className="font-semibold text-teal tabular-nums brightness-150">-{formatPrecio(ahorro)}</span>
        </div>
      )}
      <div className="border-t border-white/15 pt-3">
        <span className="text-sm text-white/75">Monto total</span>
        <p className="text-3xl font-bold tabular-nums" aria-live="polite">
          {formatPrecio(total)}
        </p>
      </div>
    </section>
  )
}

'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { FileText, LogOut, Receipt, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FiltrosProductos } from '@/components/filtros-productos'
import { BuscadorResultados } from '@/components/carrito/buscador-resultados'
import { TablaCarrito, type LineaCarrito } from '@/components/carrito/tabla-carrito'
import { PanelTotales } from '@/components/carrito/panel-totales'
import { Presupuesto } from '@/components/carrito/presupuesto'
import { guardarSimulacion } from '@/app/actions/simulaciones'
import type { ProductoCatalogo, Supermercado } from '@/lib/data'
import { FILTROS_INICIALES, filtrarProductos, opciones, precioAbonar } from '@/lib/filtros'

export function Carrito({
  supermercados,
  productos,
}: {
  supermercados: Supermercado[]
  productos: ProductoCatalogo[]
}) {
  const router = useRouter()
  const [supermercadoId, setSupermercadoId] = useState<number | null>(supermercados[0]?.id ?? null)
  const [cantidades, setCantidades] = useState<Record<number, number>>({})
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [verPresupuesto, setVerPresupuesto] = useState(false)
  const [guardando, startGuardar] = useTransition()

  const { rubros, marcas } = useMemo(() => opciones(productos), [productos])
  const resultados = useMemo(
    () => filtrarProductos(productos, filtros, supermercadoId),
    [productos, filtros, supermercadoId],
  )
  const supermercado = supermercados.find((s) => s.id === supermercadoId) ?? null

  const lineas: LineaCarrito[] = useMemo(() => {
    if (supermercadoId === null) return []
    return Object.entries(cantidades).flatMap(([id, cantidad]) => {
      const producto = productos.find((p) => p.id === Number(id))
      if (!producto) return []
      const precio = producto.precios[supermercadoId] ?? null
      const abonar = precio ? precioAbonar(precio) : null
      return [
        {
          producto,
          cantidad,
          precioRegular: precio?.regular ?? null,
          precioAbonar: abonar,
          subtotal: abonar !== null ? abonar * cantidad : null,
          enOferta: precio?.promo != null,
        },
      ]
    })
  }, [cantidades, productos, supermercadoId])

  const disponibles = lineas.filter((l) => l.subtotal !== null)
  const totales = {
    cantidad: disponibles.reduce((acc, l) => acc + l.cantidad, 0),
    total: disponibles.reduce((acc, l) => acc + (l.subtotal ?? 0), 0),
    regular: disponibles.reduce((acc, l) => acc + (l.precioRegular ?? 0) * l.cantidad, 0),
  }

  function agregar(productoId: number, cantidad: number) {
    const cant = Math.round(cantidad * 1000) / 1000
    setCantidades((prev) => ({
      ...prev,
      [productoId]: Math.min(999, Math.round(((prev[productoId] ?? 0) + cant) * 1000) / 1000),
    }))
    const p = productos.find((x) => x.id === productoId)
    toast.success(`Agregado: ${p?.descripcion ?? 'producto'}`)
  }

  function modificar(productoId: number, cantidad: number) {
    const producto = productos.find((p) => p.id === productoId)
    const esKg = producto?.unidad.trim().toLowerCase() === 'kg'
    const minimo = esKg ? 0.25 : 1
    const cant = Math.round(cantidad * 1000) / 1000
    setCantidades((prev) => ({
      ...prev,
      [productoId]: Math.max(minimo, Math.min(999, cant)),
    }))
  }

  function eliminar(productoId: number) {
    setCantidades((prev) => {
      const next = { ...prev }
      delete next[productoId]
      return next
    })
  }

  function cancelar() {
    if (lineas.length === 0) return
    if (!window.confirm('¿Vaciar el carrito actual?')) return
    setCantidades({})
    toast('Carrito vaciado')
  }

  function salir() {
    if (lineas.length > 0 && !window.confirm('Vas a perder el carrito actual. ¿Salir igual?')) return
    router.push('/menu')
  }

  function generarResumen() {
    if (supermercadoId === null || disponibles.length === 0) {
      toast.error('Agregá al menos un producto al carrito.')
      return
    }
    startGuardar(async () => {
      const res = await guardarSimulacion(
        supermercadoId,
        disponibles.map((l) => ({ productoId: l.producto.id, cantidad: l.cantidad })),
      )
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success('Simulación guardada en tu historial')
      setCantidades({})
      router.push(`/historial/${res.id}`)
    })
  }

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold md:text-3xl">Carrito</h1>
          <p className="mt-2 text-base font-medium text-foreground md:text-lg">
            Elegí el supermercado y armá tu compra.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            En productos por kg el total es referencial; en caja puede variar según el peso.
          </p>
          {supermercado && (
            <p className="mt-3 text-base font-semibold text-brand md:text-lg">
              Calculando en: {supermercado.nombre}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 md:w-80">
          <span id="super-label" className="text-base font-semibold">
            Supermercado
          </span>
          <Select
            value={supermercadoId ? String(supermercadoId) : undefined}
            onValueChange={(v) => setSupermercadoId(Number(v))}
          >
            <SelectTrigger aria-labelledby="super-label" className="h-12 w-full bg-card text-base">
              <SelectValue placeholder="Seleccioná un supermercado">
                {supermercado?.nombre ?? 'Seleccioná un supermercado'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {supermercados.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex min-w-0 flex-col gap-6">
          <section aria-labelledby="buscar-titulo" className="flex flex-col gap-3 rounded-xl border bg-card p-4">
            <h2 id="buscar-titulo" className="font-semibold">
              Buscar productos
            </h2>
            <FiltrosProductos filtros={filtros} onChange={setFiltros} rubros={rubros} marcas={marcas} />
            <BuscadorResultados
              productos={resultados}
              supermercadoId={supermercadoId}
              cantidades={cantidades}
              onAgregar={agregar}
            />
          </section>

          <section aria-labelledby="carrito-titulo" className="flex flex-col gap-3">
            <h2 id="carrito-titulo" className="text-lg font-semibold">
              Mi carrito{supermercado ? ` en ${supermercado.nombre}` : ''}
            </h2>
            <TablaCarrito lineas={lineas} onModificar={modificar} onEliminar={eliminar} />
          </section>
        </div>

        <aside className="flex flex-col gap-3 lg:sticky lg:top-32 lg:self-start">
          <PanelTotales
            cantidad={totales.cantidad}
            total={totales.total}
            ahorro={totales.regular - totales.total}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-11 bg-card"
              onClick={() => setVerPresupuesto(true)}
              disabled={disponibles.length === 0}
            >
              <FileText aria-hidden="true" />
              Ver Presupuesto
            </Button>
            <Button
              className="h-11 bg-teal text-teal-foreground hover:bg-teal/90"
              onClick={generarResumen}
              disabled={guardando || disponibles.length === 0}
            >
              <Receipt aria-hidden="true" />
              {guardando ? 'Guardando...' : 'Generar Resumen'}
            </Button>
            <Button variant="outline" className="h-11 bg-card" onClick={cancelar} disabled={lineas.length === 0}>
              <X aria-hidden="true" />
              Cancelar
            </Button>
            <Button variant="outline" className="h-11 bg-card" onClick={salir}>
              <LogOut aria-hidden="true" />
              Salir
            </Button>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t bg-brand px-4 py-3 text-brand-foreground lg:hidden">
        <div className="text-sm leading-tight">
          <span className="block text-white/70">{totales.cantidad} productos</span>
          <span className="block text-lg font-bold">
            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totales.total)}
          </span>
        </div>
        <Button
          className="h-11 bg-teal text-teal-foreground hover:bg-teal/90"
          onClick={generarResumen}
          disabled={guardando || disponibles.length === 0}
        >
          <Receipt aria-hidden="true" />
          Generar Resumen
        </Button>
      </div>

      {verPresupuesto && supermercado && (
        <Presupuesto
          supermercado={supermercado.nombre}
          lineas={disponibles}
          totales={totales}
          onClose={() => setVerPresupuesto(false)}
        />
      )}
    </div>
  )
}
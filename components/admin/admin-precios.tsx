'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ActionForm, Panel, selectClass } from '@/components/admin/ui'
import { guardarPrecio } from '@/app/actions/admin'
import { formatPrecio } from '@/lib/format'

type Props = {
  productos: { id: number; descripcion: string; marca: string }[]
  supermercados: { id: number; nombre: string }[]
  precios: { productoId: number; supermercadoId: number; precioRegular: string }[]
}

export function AdminPrecios({ productos, supermercados, precios }: Props) {
  const [superId, setSuperId] = useState(supermercados[0]?.id ?? 0)
  const mapa = new Map(
    precios.filter((p) => p.supermercadoId === superId).map((p) => [p.productoId, p.precioRegular]),
  )

  return (
    <Panel titulo="Precios regulares">
      <div className="flex flex-col gap-1.5 md:w-72">
        <Label htmlFor="pr-super">Supermercado</Label>
        <select
          id="pr-super"
          className={selectClass}
          value={superId}
          onChange={(e) => setSuperId(Number(e.target.value))}
        >
          {supermercados.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>
      <ul className="flex flex-col divide-y">
        {productos.map((p) => {
          const actual = mapa.get(p.id)
          return (
            <li key={`${superId}-${p.id}`} className="py-2.5">
              <ActionForm
                action={guardarPrecio}
                exito="Precio actualizado"
                reset={false}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <input type="hidden" name="productoId" value={p.id} />
                <input type="hidden" name="supermercadoId" value={superId} />
                <div className="min-w-0">
                  <p className="font-medium">{p.descripcion}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.marca} · {actual ? `Actual: ${formatPrecio(actual)}` : 'Sin precio cargado'}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Input
                    name="precioRegular"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    defaultValue={actual ? Number(actual) : ''}
                    aria-label={`Precio de ${p.descripcion}`}
                    className="w-32"
                  />
                  <Button type="submit" size="icon" variant="outline" aria-label={`Guardar precio de ${p.descripcion}`}>
                    <Save />
                  </Button>
                </div>
              </ActionForm>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

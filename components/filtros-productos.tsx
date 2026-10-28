'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Filtros, Orden } from '@/lib/filtros'

export function FiltrosProductos({
  filtros,
  onChange,
  rubros,
  marcas,
}: {
  filtros: Filtros
  onChange: (f: Filtros) => void
  rubros: string[]
  marcas: string[]
}) {
  const set = <K extends keyof Filtros>(k: K, v: Filtros[K]) =>
    onChange({ ...filtros, [k]: v })

  return (
    <div className="flex flex-col gap-3">
      {/* Buscador blanco */}
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
        />

        <Label htmlFor="busqueda" className="sr-only">
          Buscar productos
        </Label>

<input
  id="busqueda"
  type="search"
  placeholder="Buscar producto, marca o rubro..."
  value={filtros.busqueda}
  onChange={(e) => set('busqueda', e.target.value)}
  className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-teal-500"
/>
      </div>

      {/* Filtros azul oscuro */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:items-center">
        <Select
          value={filtros.rubro}
          onValueChange={(v) => set('rubro', v ?? 'todos')}
        >
          <SelectTrigger
            aria-label="Filtrar por rubro"
            className="h-10 w-full border-[#24435e] bg-[#0b263f] text-white focus:ring-teal-500"
          >
            <SelectValue placeholder="Rubro" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="todos">Todos los rubros</SelectItem>
            {rubros.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filtros.marca}
          onValueChange={(v) => set('marca', v ?? 'todas')}
        >
          <SelectTrigger
            aria-label="Filtrar por marca"
            className="h-10 w-full border-[#24435e] bg-[#0b263f] text-white focus:ring-teal-500"
          >
            <SelectValue placeholder="Marca" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="todas">Todas las marcas</SelectItem>
            {marcas.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filtros.orden}
          onValueChange={(v) => set('orden', v as Orden)}
        >
          <SelectTrigger
            aria-label="Orden alfabético"
            className="h-10 w-full border-[#24435e] bg-[#0b263f] text-white focus:ring-teal-500"
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="az">Alfabético A-Z</SelectItem>
            <SelectItem value="za">Alfabético Z-A</SelectItem>
          </SelectContent>
        </Select>

        {/* Casilla de ofertas azul oscuro */}
        <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[#24435e] bg-[#0b263f] px-3 text-sm text-white">
          <Checkbox
            checked={filtros.soloOfertas}
            onCheckedChange={(c) => set('soloOfertas', c === true)}
          />
          Solo ofertas
        </label>
      </div>
    </div>
  )
}

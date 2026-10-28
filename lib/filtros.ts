import type { ProductoCatalogo } from '@/lib/data'

export type Orden = 'az' | 'za'

export type Filtros = {
  busqueda: string
  rubro: string
  marca: string
  orden: Orden
  soloOfertas: boolean
}

export const FILTROS_INICIALES: Filtros = {
  busqueda: '',
  rubro: 'todos',
  marca: 'todas',
  orden: 'az',
  soloOfertas: false,
}

function normalizar(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function filtrarProductos(
  productos: ProductoCatalogo[],
  filtros: Filtros,
  supermercadoId: number | null,
) {
  const q = normalizar(filtros.busqueda.trim())
  const lista = productos.filter((p) => {
    if (supermercadoId !== null && !p.precios[supermercadoId]) return false
    if (filtros.rubro !== 'todos' && p.rubro !== filtros.rubro) return false
    if (filtros.marca !== 'todas' && p.marca !== filtros.marca) return false
    if (filtros.soloOfertas) {
      const tieneOferta =
        supermercadoId !== null
          ? p.precios[supermercadoId]?.promo != null
          : Object.values(p.precios).some((x) => x.promo != null)
      if (!tieneOferta) return false
    }
    if (q) {
  const texto = normalizar(`${p.descripcion} ${p.marca}`)
  // Todas las palabras de la búsqueda deben aparecer
  const palabras = q.split(/\s+/).filter(Boolean)
  if (!palabras.every((palabra) => texto.includes(palabra))) return false
}
    return true
  })
  lista.sort((a, b) => a.descripcion.localeCompare(b.descripcion, 'es'))
  if (filtros.orden === 'za') lista.reverse()
  return lista
}

export function opciones(productos: ProductoCatalogo[]) {
  const rubros = [...new Set(productos.map((p) => p.rubro))].sort((a, b) => a.localeCompare(b, 'es'))
  const marcas = [...new Set(productos.map((p) => p.marca))].sort((a, b) => a.localeCompare(b, 'es'))
  return { rubros, marcas }
}

export function precioAbonar(precio: { regular: number; promo: number | null }) {
  return precio.promo !== null && precio.promo < precio.regular ? precio.promo : precio.regular
}

import type { Rol } from '@/lib/session'

export type NavItem = {
  href: string
  label: string
  descripcion: string
  icon: 'carrito' | 'historial' | 'catalogo' | 'promociones' | 'admin'
  acceso: 'todos' | 'usuario' | 'cliente' | 'admin'
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/carrito',
    label: 'Carrito',
    descripcion: 'Armá tu compra y calculá el total',
    icon: 'carrito',
    acceso: 'usuario',
  },
  {
    href: '/historial',
    label: 'Mi Historial',
    descripcion: 'Tus simulaciones guardadas',
    icon: 'historial',
    acceso: 'cliente', // solo clientes, no admin
  },
  {
    href: '/catalogo',
    label: 'Catálogo de Productos',
    descripcion: 'Precios por supermercado',
    icon: 'catalogo',
    acceso: 'todos',
  },
  {
    href: '/promociones',
    label: 'Promociones',
    descripcion: 'Ofertas vigentes',
    icon: 'promociones',
    acceso: 'todos',
  },
  {
    href: '/admin',
    label: 'Administración',
    descripcion: 'Productos, precios, promos y usuarios',
    icon: 'admin',
    acceso: 'admin',
  },
]

export function puedeAcceder(item: NavItem, rol: Rol | null) {
  if (item.acceso === 'todos') return true
  if (item.acceso === 'usuario') return rol !== null
  if (item.acceso === 'cliente') return rol === 'cliente'
  return rol === 'admin'
}
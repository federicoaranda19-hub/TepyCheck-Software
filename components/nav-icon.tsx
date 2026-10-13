import { History, LayoutGrid, Settings, ShoppingCart, Tag } from 'lucide-react'
import type { NavItem } from '@/lib/nav'

const ICONS = {
  carrito: ShoppingCart,
  historial: History,
  catalogo: LayoutGrid,
  promociones: Tag,
  admin: Settings,
} as const

export function NavIcon({ icon, className }: { icon: NavItem['icon']; className?: string }) {
  const Icon = ICONS[icon]
  return <Icon aria-hidden="true" className={className} />
}

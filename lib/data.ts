import { and, asc, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { precios, productos, promociones, supermercados } from '@/lib/db/schema'

export type Supermercado = {
  id: number
  nombre: string
  direccion: string | null
}

export type PrecioEnSuper = {
  regular: number
  promo: number | null
  promoTitulo: string | null
}

export type ProductoCatalogo = {
  id: number
  descripcion: string
  rubro: string
  marca: string
  unidad: string
  precios: Record<number, PrecioEnSuper>
}

export async function getSupermercadosActivos(): Promise<Supermercado[]> {
  return db
    .select({
      id: supermercados.id,
      nombre: supermercados.nombre,
      direccion: supermercados.direccion,
    })
    .from(supermercados)
    .where(eq(supermercados.activo, true))
    .orderBy(asc(supermercados.nombre))
}

export function promoVigente() {
  return and(
    eq(promociones.activo, true),
    lte(promociones.fechaInicio, sql`CURRENT_DATE`),
    gte(promociones.fechaFin, sql`CURRENT_DATE`),
  )
}

export async function getCatalogo(): Promise<ProductoCatalogo[]> {
  const [listaProductos, listaPrecios, listaPromos] = await Promise.all([
    db
      .select()
      .from(productos)
      .where(eq(productos.activo, true))
      .orderBy(asc(productos.descripcion)),
    db.select().from(precios),
    db.select().from(promociones).where(promoVigente()),
  ])

  const porId = new Map<number, ProductoCatalogo>()
  for (const p of listaProductos) {
    porId.set(p.id, {
      id: p.id,
      descripcion: p.descripcion,
      rubro: p.rubro,
      marca: p.marca,
      unidad: p.unidad,
      precios: {},
    })
  }

  for (const pr of listaPrecios) {
    const prod = porId.get(pr.productoId)
    if (!prod) continue
    prod.precios[pr.supermercadoId] = {
      regular: Number(pr.precioRegular),
      promo: null,
      promoTitulo: null,
    }
  }

  for (const promo of listaPromos) {
    const precio = porId.get(promo.productoId)?.precios[promo.supermercadoId]
    if (!precio) continue
    const valor = Number(promo.precioPromo)
    if (precio.promo === null || valor < precio.promo) {
      precio.promo = valor
      precio.promoTitulo = promo.titulo
    }
  }

  return [...porId.values()]
}

export type PromocionVigente = {
  id: number
  titulo: string
  precioPromo: number
  precioRegular: number | null
  fechaFin: string
  producto: string
  marca: string
  rubro: string
  supermercado: string
}

export async function getPromocionesVigentes(): Promise<PromocionVigente[]> {
  const rows = await db
    .select({
      id: promociones.id,
      titulo: promociones.titulo,
      precioPromo: promociones.precioPromo,
      fechaFin: promociones.fechaFin,
      producto: productos.descripcion,
      marca: productos.marca,
      rubro: productos.rubro,
      supermercado: supermercados.nombre,
      precioRegular: precios.precioRegular,
    })
    .from(promociones)
    .innerJoin(productos, eq(productos.id, promociones.productoId))
    .innerJoin(supermercados, eq(supermercados.id, promociones.supermercadoId))
    .leftJoin(
      precios,
      and(
        eq(precios.productoId, promociones.productoId),
        eq(precios.supermercadoId, promociones.supermercadoId),
      ),
    )
    .where(and(promoVigente(), eq(productos.activo, true), eq(supermercados.activo, true)))
    .orderBy(asc(promociones.fechaFin))

  return rows.map((r) => ({
    ...r,
    precioPromo: Number(r.precioPromo),
    precioRegular: r.precioRegular === null ? null : Number(r.precioRegular),
  }))
}

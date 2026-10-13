'use server'

import { and, eq, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import {
  precios,
  productos,
  promociones,
  simulacionItems,
  simulaciones,
  supermercados,
} from '@/lib/db/schema'
import { promoVigente } from '@/lib/data'
import { getCurrentUser } from '@/lib/session'

const MAX_ITEMS = 200
const MAX_CANTIDAD = 999

type ItemInput = { productoId: number; cantidad: number }

type Resultado = { ok: true; id: number } | { ok: false; error: string }

async function getUserId() {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}

export async function guardarSimulacion(
  supermercadoId: number,
  items: ItemInput[],
): Promise<Resultado> {
  const userId = await getUserId()

  if (!Number.isInteger(supermercadoId) || supermercadoId <= 0) {
    return { ok: false, error: 'Supermercado inválido.' }
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: 'El carrito está vacío.' }
  }
  if (items.length > MAX_ITEMS) {
    return { ok: false, error: 'Demasiados productos en el carrito.' }
  }

  const cantidades = new Map<number, number>()
  for (const item of items) {
    if (
      !Number.isInteger(item.productoId) ||
      !Number.isInteger(item.cantidad) ||
      item.cantidad <= 0
    ) {
      return { ok: false, error: 'Hay cantidades inválidas en el carrito.' }
    }
    const total = (cantidades.get(item.productoId) ?? 0) + item.cantidad
    if (total > MAX_CANTIDAD) {
      return { ok: false, error: `La cantidad máxima por producto es ${MAX_CANTIDAD}.` }
    }
    cantidades.set(item.productoId, total)
  }

  const [superRow] = await db
    .select()
    .from(supermercados)
    .where(and(eq(supermercados.id, supermercadoId), eq(supermercados.activo, true)))
  if (!superRow) return { ok: false, error: 'Supermercado no disponible.' }

  const ids = [...cantidades.keys()]
  const [prods, listaPrecios, promos] = await Promise.all([
    db
      .select()
      .from(productos)
      .where(and(inArray(productos.id, ids), eq(productos.activo, true))),
    db
      .select()
      .from(precios)
      .where(and(inArray(precios.productoId, ids), eq(precios.supermercadoId, supermercadoId))),
    db
      .select()
      .from(promociones)
      .where(
        and(
          inArray(promociones.productoId, ids),
          eq(promociones.supermercadoId, supermercadoId),
          promoVigente(),
        ),
      ),
  ])

  const lineas = []
  let montoRegular = 0
  let montoTotal = 0
  let cantidadProductos = 0

  for (const [productoId, cantidad] of cantidades) {
    const prod = prods.find((p) => p.id === productoId)
    const precio = listaPrecios.find((p) => p.productoId === productoId)
    if (!prod || !precio) {
      return { ok: false, error: 'Algún producto ya no está disponible en este supermercado.' }
    }
    const regular = Number(precio.precioRegular)
    const mejorPromo = promos
      .filter((p) => p.productoId === productoId)
      .reduce<number | null>((min, p) => {
        const v = Number(p.precioPromo)
        return min === null || v < min ? v : min
      }, null)
    const abonar = mejorPromo !== null && mejorPromo < regular ? mejorPromo : regular
    const subtotal = Math.round(abonar * cantidad * 100) / 100

    montoRegular += regular * cantidad
    montoTotal += subtotal
    cantidadProductos += cantidad
    lineas.push({
      productoId,
      descripcion: prod.descripcion,
      cantidad,
      precioRegular: regular.toFixed(2),
      precioAbonar: abonar.toFixed(2),
      subtotal: subtotal.toFixed(2),
    })
  }

  const id = await db.transaction(async (tx) => {
    const [sim] = await tx
      .insert(simulaciones)
      .values({
        userId,
        supermercadoId,
        supermercadoNombre: superRow.nombre,
        cantidadProductos,
        montoRegular: montoRegular.toFixed(2),
        montoTotal: montoTotal.toFixed(2),
      })
      .returning({ id: simulaciones.id })
    await tx
      .insert(simulacionItems)
      .values(lineas.map((l) => ({ ...l, simulacionId: sim.id })))
    return sim.id
  })

  revalidatePath('/historial')
  return { ok: true, id }
}

export async function eliminarSimulacion(id: number) {
  const userId = await getUserId()
  const [sim] = await db
    .select({ id: simulaciones.id })
    .from(simulaciones)
    .where(and(eq(simulaciones.id, id), eq(simulaciones.userId, userId)))
  if (!sim) return
  await db.delete(simulacionItems).where(eq(simulacionItems.simulacionId, sim.id))
  await db
    .delete(simulaciones)
    .where(and(eq(simulaciones.id, sim.id), eq(simulaciones.userId, userId)))
  revalidatePath('/historial')
}

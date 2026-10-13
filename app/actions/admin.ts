'use server'

import { and, eq, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { precios, productos, promociones, supermercados, user } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/session'

async function assertAdmin() {
  const current = await getCurrentUser()
  if (!current || current.role !== 'admin') throw new Error('Unauthorized')
  return current
}

function texto(form: FormData, key: string, max = 120) {
  const value = String(form.get(key) ?? '').trim()
  if (!value || value.length > max) throw new Error(`Campo inválido: ${key}`)
  return value
}

function entero(form: FormData, key: string) {
  const value = Number(form.get(key))
  if (!Number.isInteger(value) || value <= 0) throw new Error(`Campo inválido: ${key}`)
  return value
}

function precio(form: FormData, key: string) {
  const value = Number(String(form.get(key) ?? '').replace(',', '.'))
  if (!Number.isFinite(value) || value <= 0 || value > 100_000_000) {
    throw new Error(`Precio inválido: ${key}`)
  }
  return value.toFixed(2)
}

function fecha(form: FormData, key: string) {
  const value = String(form.get(key) ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Fecha inválida: ${key}`)
  return value
}

function refrescar() {
  revalidatePath('/admin')
  revalidatePath('/catalogo')
  revalidatePath('/promociones')
  revalidatePath('/carrito')
}

export async function crearSupermercado(form: FormData) {
  await assertAdmin()
  const direccion = String(form.get('direccion') ?? '').trim().slice(0, 200)
  await db.insert(supermercados).values({
    nombre: texto(form, 'nombre'),
    direccion: direccion || null,
  })
  refrescar()
}

export async function toggleSupermercado(form: FormData) {
  await assertAdmin()
  const id = entero(form, 'id')
  const [row] = await db.select().from(supermercados).where(eq(supermercados.id, id))
  if (!row) return
  await db.update(supermercados).set({ activo: !row.activo }).where(eq(supermercados.id, id))
  refrescar()
}

export async function crearProducto(form: FormData) {
  await assertAdmin()
  await db.insert(productos).values({
    descripcion: texto(form, 'descripcion'),
    rubro: texto(form, 'rubro', 60),
    marca: texto(form, 'marca', 60),
    unidad: texto(form, 'unidad', 30),
  })
  refrescar()
}

export async function toggleProducto(form: FormData) {
  await assertAdmin()
  const id = entero(form, 'id')
  const [row] = await db.select().from(productos).where(eq(productos.id, id))
  if (!row) return
  await db.update(productos).set({ activo: !row.activo }).where(eq(productos.id, id))
  refrescar()
}

export async function guardarPrecio(form: FormData) {
  await assertAdmin()
  const productoId = entero(form, 'productoId')
  const supermercadoId = entero(form, 'supermercadoId')
  const precioRegular = precio(form, 'precioRegular')
  await db
    .insert(precios)
    .values({ productoId, supermercadoId, precioRegular })
    .onConflictDoUpdate({
      target: [precios.productoId, precios.supermercadoId],
      set: { precioRegular, updatedAt: new Date() },
    })
  refrescar()
}

export async function crearPromocion(form: FormData) {
  await assertAdmin()
  const fechaInicio = fecha(form, 'fechaInicio')
  const fechaFin = fecha(form, 'fechaFin')
  if (fechaFin < fechaInicio) throw new Error('La fecha de fin debe ser posterior al inicio')
  await db.insert(promociones).values({
    productoId: entero(form, 'productoId'),
    supermercadoId: entero(form, 'supermercadoId'),
    titulo: texto(form, 'titulo', 80),
    precioPromo: precio(form, 'precioPromo'),
    fechaInicio,
    fechaFin,
  })
  refrescar()
}

export async function togglePromocion(form: FormData) {
  await assertAdmin()
  const id = entero(form, 'id')
  const [row] = await db.select().from(promociones).where(eq(promociones.id, id))
  if (!row) return
  await db.update(promociones).set({ activo: !row.activo }).where(eq(promociones.id, id))
  refrescar()
}

export async function eliminarPromocion(form: FormData) {
  await assertAdmin()
  await db.delete(promociones).where(eq(promociones.id, entero(form, 'id')))
  refrescar()
}

export async function cambiarRol(form: FormData) {
  const current = await assertAdmin()
  const userId = String(form.get('userId') ?? '')
  const rol = String(form.get('rol') ?? '')
  if (!userId || (rol !== 'admin' && rol !== 'cliente')) throw new Error('Datos inválidos')
  if (userId === current.id) throw new Error('No podés cambiar tu propio rol')
  await db
    .update(user)
    .set({ role: rol, updatedAt: new Date() })
    .where(and(eq(user.id, userId), ne(user.id, current.id)))
  revalidatePath('/admin')
}

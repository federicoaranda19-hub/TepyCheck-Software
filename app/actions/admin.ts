
'use server'

import { and, eq, ne, sql } from 'drizzle-orm'
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

  const descripcion = texto(form, 'descripcion')
  const rubro = texto(form, 'rubro', 60)
  const marca = texto(form, 'marca', 60)
  const unidad = texto(form, 'unidad', 30)
  const imagen = String(form.get('imagen') ?? '').trim()

  // Evitar que la marca aparezca en la descripción
  if (descripcion.toLowerCase().includes(marca.toLowerCase())) {
    throw new Error(
      `La descripción no debe contener la marca "${marca}". Eliminá la marca de la descripción e intentá nuevamente.`
    )
  }

  // Comprobar si ya existe un producto con la misma descripción y marca
  const [productoExistente] = await db
    .select({ id: productos.id })
    .from(productos)
    .where(
      and(
        eq(sql`lower(${productos.descripcion})`, descripcion.toLowerCase()),
        eq(sql`lower(${productos.marca})`, marca.toLowerCase())
      )
    )
    .limit(1)

  if (productoExistente) {
    throw new Error(
      `El producto "${descripcion}" de la marca "${marca}" ya se encuentra registrado.`
    )
  }

  await db.insert(productos).values({
    descripcion,
    rubro,
    marca,
    unidad,
    imagen: imagen || null,
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

export async function editarProducto(form: FormData) {
  await assertAdmin()
  const id = entero(form, 'id')
  const imagen = String(form.get('imagen') ?? '').trim()

  await db
    .update(productos)
    .set({
      descripcion: texto(form, 'descripcion'),
      rubro: texto(form, 'rubro', 60),
      marca: texto(form, 'marca', 60),
      unidad: texto(form, 'unidad', 30),
      imagen: imagen || null,
    })
    .where(eq(productos.id, id))

  refrescar()
}

export async function eliminarProducto(form: FormData) {
  await assertAdmin()
  const id = entero(form, 'id')

  await db.delete(precios).where(eq(precios.productoId, id))
  await db.delete(promociones).where(eq(promociones.productoId, id))
  await db.delete(productos).where(eq(productos.id, id))

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

  const productoId = entero(form, 'productoId')
  const supermercadoId = entero(form, 'supermercadoId')
  const titulo = texto(form, 'titulo', 80)
  const precioPromo = precio(form, 'precioPromo')
  const precioPromoNumero = Number(precioPromo)
  const fechaInicio = fecha(form, 'fechaInicio')
  const fechaFin = fecha(form, 'fechaFin')

  if (fechaFin < fechaInicio) {
    throw new Error('La fecha de fin debe ser posterior al inicio')
  }

  // Buscar el precio habitual del producto en ese supermercado
  const [precioHabitual] = await db
    .select({ precioRegular: precios.precioRegular })
    .from(precios)
    .where(
      and(
        eq(precios.productoId, productoId),
        eq(precios.supermercadoId, supermercadoId)
      )
    )
    .limit(1)

  if (!precioHabitual) {
    throw new Error(
      'Este producto no tiene un precio habitual registrado en el supermercado seleccionado. Primero debés cargar su precio.'
    )
  }

  const precioRegular = Number(precioHabitual.precioRegular)

  if (!Number.isFinite(precioRegular) || precioRegular <= 0) {
    throw new Error('No se pudo verificar el precio habitual del producto.')
  }

  // No permitir que el precio promocional supere el habitual
  if (precioPromoNumero > precioRegular) {
    throw new Error(
      `El precio promocional ($${precioPromoNumero.toFixed(2)}) no puede ser superior al precio habitual ($${precioRegular.toFixed(2)}).`
    )
  }

  // Calcular el descuento real
  const descuentoReal = ((precioRegular - precioPromoNumero) / precioRegular) * 100

  // No permitir descuentos superiores al 70%
  if (descuentoReal > 70) {
    throw new Error(
      `El descuento no puede superar el 70%. El precio promocional debe ser como mínimo $${(precioRegular * 0.30).toFixed(2)}.`
    )
  }

  // Si el título indica un porcentaje, comprobar que coincida con el descuento real
  const porcentajeEnTitulo = titulo.match(/(\d+(?:[.,]\d+)?)\s*%/)

  if (porcentajeEnTitulo) {
    const porcentajeAnunciado = Number(porcentajeEnTitulo[1].replace(',', '.'))

    if (
      porcentajeAnunciado <= 0 ||
      porcentajeAnunciado > 70 ||
      Math.abs(porcentajeAnunciado - descuentoReal) > 1
    ) {
      throw new Error(
        `El título anuncia un descuento del ${porcentajeAnunciado}%, pero el descuento real es del ${descuentoReal.toFixed(1)}%. Revisá el título o el precio promocional.`
      )
    }
  }

  // Guardar la promoción si todas las validaciones pasan
  await db.insert(promociones).values({
    productoId,
    supermercadoId,
    titulo,
    precioPromo,
    fechaInicio,
    fechaFin,
  })

  refrescar()
}

export async function editarPromocion(form: FormData) {
  await assertAdmin()

  const id = entero(form, 'id')
  const fechaInicio = fecha(form, 'fechaInicio')
  const fechaFin = fecha(form, 'fechaFin')

  if (fechaFin < fechaInicio) {
    throw new Error('La fecha de fin debe ser posterior al inicio')
  }

  await db
    .update(promociones)
    .set({
      productoId: entero(form, 'productoId'),
      supermercadoId: entero(form, 'supermercadoId'),
      titulo: texto(form, 'titulo', 80),
      precioPromo: precio(form, 'precioPromo'),
      fechaInicio,
      fechaFin,
    })
    .where(eq(promociones.id, id))

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

  if (!userId || (rol !== 'admin' && rol !== 'cliente')) {
    throw new Error('Datos inválidos')
  }

  if (userId === current.id) {
    throw new Error('No podés cambiar tu propio rol')
  }

  await db
    .update(user)
    .set({ role: rol, updatedAt: new Date() })
    .where(and(eq(user.id, userId), ne(user.id, current.id)))

  revalidatePath('/admin')
}

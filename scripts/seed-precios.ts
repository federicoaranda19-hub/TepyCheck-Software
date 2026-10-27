import { config } from 'dotenv'
import { and, eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { precios, productos, supermercados } from '../lib/db/schema'

config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const db = drizzle(pool)

/** Rangos realistas por rubro (pesos argentinos enteros) */
const RANGOS: Record<string, [number, number]> = {
  Almacén: [800, 6500],
  Bebidas: [900, 4500],
  Lácteos: [700, 5500],
  Limpieza: [600, 4000],
  Verdulería: [500, 2500],
  Carnicería: [2500, 9000],
  Panadería: [400, 3000],
  Congelados: [1200, 6000],
  Higiene: [700, 4500],
}

function precioPorRubro(rubro: string): string {
  const [min, max] = RANGOS[rubro] ?? [800, 5000]
  const valor = Math.round(min + Math.random() * (max - min))
  return valor.toFixed(2) // ej: "1660.00"
}

/** Variación leve entre supermercados (±8%) */
function variar(base: number, factor: number): string {
  const valor = Math.max(100, Math.round(base * factor))
  return valor.toFixed(2)
}

async function main() {
  const [listaProductos, listaSupers, listaPrecios] = await Promise.all([
    db.select().from(productos).where(eq(productos.activo, true)),
    db.select().from(supermercados).where(eq(supermercados.activo, true)),
    db.select().from(precios),
  ])

  const existentes = new Set(
    listaPrecios.map((p) => `${p.productoId}-${p.supermercadoId}`),
  )

  // Factor distinto por supermercado (para que no sean todos iguales)
  const factores: Record<number, number> = {}
  listaSupers.forEach((s, i) => {
    const base = 0.94 + i * 0.03 // ~0.94 a ~1.06
    factores[s.id] = base
  })

  const nuevos: {
    productoId: number
    supermercadoId: number
    precioRegular: string
  }[] = []

  for (const prod of listaProductos) {
    const base = Number(precioPorRubro(prod.rubro))

    for (const super_ of listaSupers) {
      const clave = `${prod.id}-${super_.id}`
      if (existentes.has(clave)) continue // respetar precio existente

      nuevos.push({
        productoId: prod.id,
        supermercadoId: super_.id,
        precioRegular: variar(base, factores[super_.id] ?? 1),
      })
    }
  }

  console.log(`Productos activos: ${listaProductos.length}`)
  console.log(`Supermercados activos: ${listaSupers.length}`)
  console.log(`Precios ya existentes: ${listaPrecios.length}`)
  console.log(`Precios nuevos a insertar: ${nuevos.length}`)

  if (nuevos.length === 0) {
    console.log('No hay precios faltantes. Nada que hacer.')
    await pool.end()
    return
  }

  // Insertar en lotes
  const lote = 100
  for (let i = 0; i < nuevos.length; i += lote) {
    const chunk = nuevos.slice(i, i + lote)
    await db.insert(precios).values(chunk)
    console.log(`Insertados ${Math.min(i + lote, nuevos.length)} / ${nuevos.length}`)
  }

  console.log('Listo. Precios faltantes completados (los viejos se respetaron).')
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
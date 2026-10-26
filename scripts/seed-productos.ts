import 'dotenv/config'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { productos } from '../lib/db/schema'

config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const db = drizzle(pool)

const lista = [
  // Almacén
  { descripcion: 'Aceite de Girasol 1.5L', rubro: 'Almacén', marca: 'Natura', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  { descripcion: 'Aceite de Girasol 900ml', rubro: 'Almacén', marca: 'Cocinero', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  { descripcion: 'Arroz Largo Fino 1kg', rubro: 'Almacén', marca: 'Gallo', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
  { descripcion: 'Arroz Doble Carolina 1kg', rubro: 'Almacén', marca: 'Molinos', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
  { descripcion: 'Azúcar 1kg', rubro: 'Almacén', marca: 'Ledesma', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400' },
  { descripcion: 'Fideos Tallarín 500g', rubro: 'Almacén', marca: 'Matarazzo', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1551462147-63825c6b4b2a?w=400' },
  { descripcion: 'Fideos Mostachol 500g', rubro: 'Almacén', marca: 'Lucchetti', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1551462147-63825c6b4b2a?w=400' },
  { descripcion: 'Harina 000 1kg', rubro: 'Almacén', marca: 'Pureza', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1574323342123-5b2c315c3f0c?w=400' },
  { descripcion: 'Harina Leudante 1kg', rubro: 'Almacén', marca: 'Pureza', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1574323342123-5b2c315c3f0c?w=400' },
  { descripcion: 'Yerba Mate 1kg', rubro: 'Almacén', marca: 'Taragüí', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400' },
  { descripcion: 'Yerba Mate 500g', rubro: 'Almacén', marca: 'Rosamonte', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400' },
  { descripcion: 'Yerba Mate 1kg', rubro: 'Almacén', marca: 'Playadito', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400' },
  { descripcion: 'Sal Fina 500g', rubro: 'Almacén', marca: 'Celusal', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400' },
  { descripcion: 'Mayonesa 500g', rubro: 'Almacén', marca: 'Hellmanns', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400' },
  { descripcion: 'Tomate Triturado 520g', rubro: 'Almacén', marca: 'La Campagnola', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1546094097-2e8e6c0e0b0a?w=400' },
  { descripcion: 'Atún al Natural 170g', rubro: 'Almacén', marca: 'La Campagnola', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1606851094290-6c0e0c0c0c0c?w=400' },
  { descripcion: 'Lentejas 400g', rubro: 'Almacén', marca: 'Arcor', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { descripcion: 'Porotos 400g', rubro: 'Almacén', marca: 'Arcor', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
  { descripcion: 'Galletitas Dulces 300g', rubro: 'Almacén', marca: 'Bagley', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },
  { descripcion: 'Galletitas Crackers 300g', rubro: 'Almacén', marca: 'Criollitas', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },

  // Bebidas
  { descripcion: 'Agua Mineral 2L', rubro: 'Bebidas', marca: 'Villavicencio', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1548839140-5a94e0b6f24f?w=400' },
  { descripcion: 'Agua con Gas 2L', rubro: 'Bebidas', marca: 'Villavicencio', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1548839140-5a94e0b6f24f?w=400' },
  { descripcion: 'Gaseosa Cola 2.25L', rubro: 'Bebidas', marca: 'Coca Cola', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400' },
  { descripcion: 'Gaseosa Naranja 2.25L', rubro: 'Bebidas', marca: 'Fanta', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400' },
  { descripcion: 'Gaseosa Lima Limón 2.25L', rubro: 'Bebidas', marca: 'Sprite', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400' },
  { descripcion: 'Cerveza Rubia 1L', rubro: 'Bebidas', marca: 'Quilmes', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1608270586620-2485248abebb?w=400' },
  { descripcion: 'Cerveza Rubia 473ml', rubro: 'Bebidas', marca: 'Brahma', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1608270586620-2485248abebb?w=400' },
  { descripcion: 'Jugo en Polvo 8.5g', rubro: 'Bebidas', marca: 'Tang', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
  { descripcion: 'Jugo Listo 1L', rubro: 'Bebidas', marca: 'Cepita', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
  { descripcion: 'Vino Tinto 750ml', rubro: 'Bebidas', marca: 'Termidor', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400' },

  // Lácteos
  { descripcion: 'Leche Entera 1L', rubro: 'Lácteos', marca: 'La Serenísima', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
  { descripcion: 'Leche Descremada 1L', rubro: 'Lácteos', marca: 'La Serenísima', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
  { descripcion: 'Yogur Natural 190g', rubro: 'Lácteos', marca: 'La Serenísima', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
  { descripcion: 'Yogur Frutilla 190g', rubro: 'Lácteos', marca: 'Ser', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
  { descripcion: 'Manteca 200g', rubro: 'Lácteos', marca: 'La Serenísima', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400' },
  { descripcion: 'Queso Cremoso 1kg', rubro: 'Lácteos', marca: 'La Serenísima', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1452195100486-9cc805987263?w=400' },
  { descripcion: 'Queso Tybo 1kg', rubro: 'Lácteos', marca: 'Sancor', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1452195100486-9cc805987263?w=400' },
  { descripcion: 'Queso Rallado 150g', rubro: 'Lácteos', marca: 'Sancor', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1452195100486-9cc805987263?w=400' },
  { descripcion: 'Crema de Leche 200ml', rubro: 'Lácteos', marca: 'La Serenísima', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400' },
  { descripcion: 'Dulce de Leche 400g', rubro: 'Lácteos', marca: 'La Serenísima', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },

  // Limpieza
  { descripcion: 'Detergente 750ml', rubro: 'Limpieza', marca: 'Magistral', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400' },
  { descripcion: 'Detergente 500ml', rubro: 'Limpieza', marca: 'Cif', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400' },
  { descripcion: 'Lavandina 1L', rubro: 'Limpieza', marca: 'Ayudín', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400' },
  { descripcion: 'Jabón en Polvo 800g', rubro: 'Limpieza', marca: 'Skip', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400' },
  { descripcion: 'Suavizante 900ml', rubro: 'Limpieza', marca: 'Comfort', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400' },
  { descripcion: 'Esponja Cocina x3', rubro: 'Limpieza', marca: 'Virulana', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400' },
  { descripcion: 'Papel Higiénico x4', rubro: 'Limpieza', marca: 'Higienol', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1584554376766-ac0f2c65e949?w=400' },
  { descripcion: 'Servilletas x120', rubro: 'Limpieza', marca: 'Elite', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1584554376766-ac0f2c65e949?w=400' },
  { descripcion: 'Limpiador Multiuso 900ml', rubro: 'Limpieza', marca: 'Cif', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400' },
  { descripcion: 'Bolsas Residuo x30', rubro: 'Limpieza', marca: 'Domo', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400' },

  // Verdulería
  { descripcion: 'Cebolla 1kg', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400' },
  { descripcion: 'Papa 1kg', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400' },
  { descripcion: 'Tomate 1kg', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1546094097-2e8e6c0e0b0a?w=400' },
  { descripcion: 'Lechuga Criolla', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1622206151226-18bb2cbf09ba?w=400' },
  { descripcion: 'Zanahoria 1kg', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400' },
  { descripcion: 'Banana Ecuador 1kg', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400' },
  { descripcion: 'Manzana Roja 1kg', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400' },
  { descripcion: 'Naranja 1kg', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400' },
  { descripcion: 'Limón 1kg', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1590502593749-8b3c4b0b0b0b?w=400' },
  { descripcion: 'Zapallo Anco 1kg', rubro: 'Verdulería', marca: 'Sin marca', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400' },

  // Carnicería
  { descripcion: 'Carne Picada Común 1kg', rubro: 'Carnicería', marca: 'Granja', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400' },
  { descripcion: 'Carne Picada Especial 1kg', rubro: 'Carnicería', marca: 'Granja', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400' },
  { descripcion: 'Asado 1kg', rubro: 'Carnicería', marca: 'Granja', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400' },
  { descripcion: 'Nalga 1kg', rubro: 'Carnicería', marca: 'Granja', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400' },
  { descripcion: 'Pollo Entero 1kg', rubro: 'Carnicería', marca: 'Granja', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400' },
  { descripcion: 'Milanesa de Ternera 1kg', rubro: 'Carnicería', marca: 'Granja', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400' },
  { descripcion: 'Chorizo Parrillero x4', rubro: 'Carnicería', marca: 'Granja', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400' },
  { descripcion: 'Morcilla x2', rubro: 'Carnicería', marca: 'Granja', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400' },

  // Panadería
  { descripcion: 'Pan Lactal 500g', rubro: 'Panadería', marca: 'Bimbo', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { descripcion: 'Pan Lactal Integral 500g', rubro: 'Panadería', marca: 'Bimbo', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { descripcion: 'Facturas x6', rubro: 'Panadería', marca: 'Panadería local', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },
  { descripcion: 'Pan Frances x kg', rubro: 'Panadería', marca: 'Panadería local', unidad: 'kg', imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { descripcion: 'Tostadas 200g', rubro: 'Panadería', marca: 'Clight', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },

  // Congelados
  { descripcion: 'Chipa Congelada 1kg', rubro: 'Congelados', marca: 'Mamá Tepy', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1506084868230-bb9d95c93339?w=400' },
  { descripcion: 'Hamburguesas x4', rubro: 'Congelados', marca: 'Paty', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { descripcion: 'Papas Fritas Congeladas 1kg', rubro: 'Congelados', marca: 'McCain', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' },
  { descripcion: 'Helado 1L', rubro: 'Congelados', marca: 'Freddo', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1497034825519-4e5c5c8e0c0c?w=400' },
  { descripcion: 'Pizza Congelada', rubro: 'Congelados', marca: 'Swift', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },

  // Higiene personal
  { descripcion: 'Jabón Tocador x3', rubro: 'Higiene', marca: 'Rexona', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
  { descripcion: 'Shampoo 400ml', rubro: 'Higiene', marca: 'Sedal', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400' },
  { descripcion: 'Acondicionador 400ml', rubro: 'Higiene', marca: 'Sedal', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400' },
  { descripcion: 'Pasta Dental 90g', rubro: 'Higiene', marca: 'Colgate', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1626387940961-f0c0c0c0c0c0?w=400' },
  { descripcion: 'Desodorante Aerosol', rubro: 'Higiene', marca: 'Rexona', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400' },
  { descripcion: 'Toallitas Femeninas x8', rubro: 'Higiene', marca: 'Always', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },
  { descripcion: 'Pañales x10', rubro: 'Higiene', marca: 'Pampers', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400' },

  // Más almacén / snacks
  { descripcion: 'Café Molido 500g', rubro: 'Almacén', marca: 'La Virginia', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400' },
  { descripcion: 'Té en Saquitos x25', rubro: 'Almacén', marca: 'La Virginia', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  { descripcion: 'Cacao en Polvo 180g', rubro: 'Almacén', marca: 'Nesquik', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400' },
  { descripcion: 'Cereal 300g', rubro: 'Almacén', marca: 'Quaker', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1521483451569-e33803c03380?w=400' },
  { descripcion: 'Mermelada 454g', rubro: 'Almacén', marca: 'Arcor', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  { descripcion: 'Miel 500g', rubro: 'Almacén', marca: 'Ale', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400' },
  { descripcion: 'Papas Fritas 150g', rubro: 'Almacén', marca: 'Lays', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1566478989037-eec948d8e702?w=400' },
  { descripcion: 'Maní Salado 100g', rubro: 'Almacén', marca: 'Maní King', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400' },
  { descripcion: 'Chocolate Tableta 100g', rubro: 'Almacén', marca: 'Águila', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400' },
  { descripcion: 'Alfajor x6', rubro: 'Almacén', marca: 'Guaymallen', unidad: 'unidad', imagen: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },
]

async function main() {
  console.log(`Insertando ${lista.length} productos...`)

  await db.insert(productos).values(
    lista.map((p) => ({
      descripcion: p.descripcion,
      rubro: p.rubro,
      marca: p.marca,
      unidad: p.unidad,
      imagen: p.imagen,
      activo: true,
    })),
  )

  console.log('Listo. Productos insertados correctamente.')
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
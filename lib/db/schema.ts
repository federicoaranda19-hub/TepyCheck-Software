import {
  boolean,
  date,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('cliente'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const supermercados = pgTable('supermercados', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  direccion: text('direccion'),
  activo: boolean('activo').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const productos = pgTable('productos', {
  id: serial('id').primaryKey(),
  descripcion: text('descripcion').notNull(),
  rubro: text('rubro').notNull(),
  marca: text('marca').notNull(),
  unidad: text('unidad').notNull().default('unidad'),
  imagen: text('imagen'), // URL de la imagen (opcional)
  activo: boolean('activo').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const precios = pgTable('precios', {
  id: serial('id').primaryKey(),
  productoId: integer('productoId').notNull(),
  supermercadoId: integer('supermercadoId').notNull(),
  precioRegular: numeric('precioRegular').notNull(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const promociones = pgTable('promociones', {
  id: serial('id').primaryKey(),
  productoId: integer('productoId').notNull(),
  supermercadoId: integer('supermercadoId').notNull(),
  titulo: text('titulo').notNull(),
  precioPromo: numeric('precioPromo').notNull(),
  fechaInicio: date('fechaInicio').notNull().defaultNow(),
  fechaFin: date('fechaFin').notNull(),
  activo: boolean('activo').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const simulaciones = pgTable('simulaciones', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  supermercadoId: integer('supermercadoId').notNull(),
  supermercadoNombre: text('supermercadoNombre').notNull(),
  cantidadProductos: integer('cantidadProductos').notNull(),
  montoRegular: numeric('montoRegular').notNull(),
  montoTotal: numeric('montoTotal').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const simulacionItems = pgTable('simulacion_items', {
  id: serial('id').primaryKey(),
  simulacionId: integer('simulacionId').notNull(),
  productoId: integer('productoId').notNull(),
  descripcion: text('descripcion').notNull(),
  cantidad: integer('cantidad').notNull(),
  precioRegular: numeric('precioRegular').notNull(),
  precioAbonar: numeric('precioAbonar').notNull(),
  subtotal: numeric('subtotal').notNull(),
})

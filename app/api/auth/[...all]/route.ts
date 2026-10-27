// app/api/auth/[...better-auth]/route.ts
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

// 1. Forzar el runtime de Node.js (Better Auth requiere Node.js por sus librerías criptográficas)
export const runtime = 'nodejs'

// 2. Asegurar que las peticiones de autenticación siempre sean dinámicas y no se queden cacheadas
export const dynamic = 'force-dynamic'

export const { GET, POST } = toNextJsHandler(auth)

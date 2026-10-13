import { asc, desc } from 'drizzle-orm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminProductos } from '@/components/admin/admin-productos'
import { AdminPrecios } from '@/components/admin/admin-precios'
import { AdminPromociones } from '@/components/admin/admin-promociones'
import { AdminSupermercados } from '@/components/admin/admin-supermercados'
import { AdminUsuarios } from '@/components/admin/admin-usuarios'
import { db } from '@/lib/db'
import { precios, productos, promociones, supermercados, user } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/session'

export const metadata = { title: 'Administración - TepyCheck' }

export default async function AdminPage() {
  const current = await requireAdmin()
  const [supers, prods, precs, promos, usuarios] = await Promise.all([
    db.select().from(supermercados).orderBy(asc(supermercados.nombre)),
    db.select().from(productos).orderBy(asc(productos.descripcion)),
    db.select().from(precios),
    db.select().from(promociones).orderBy(desc(promociones.fechaFin)),
    db
      .select({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt })
      .from(user)
      .orderBy(asc(user.createdAt)),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Administración</h1>
        <p className="mt-1 text-muted-foreground">Gestioná productos, precios, promociones, supermercados y usuarios.</p>
      </div>
      <Tabs defaultValue="productos" className="gap-4">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="precios">Precios</TabsTrigger>
          <TabsTrigger value="promociones">Promociones</TabsTrigger>
          <TabsTrigger value="supermercados">Supermercados</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
        </TabsList>
        <TabsContent value="productos">
          <AdminProductos productos={prods} />
        </TabsContent>
        <TabsContent value="precios">
          <AdminPrecios productos={prods} supermercados={supers} precios={precs} />
        </TabsContent>
        <TabsContent value="promociones">
          <AdminPromociones productos={prods} supermercados={supers} promociones={promos} />
        </TabsContent>
        <TabsContent value="supermercados">
          <AdminSupermercados supermercados={supers} />
        </TabsContent>
        <TabsContent value="usuarios">
          <AdminUsuarios usuarios={usuarios} currentId={current.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

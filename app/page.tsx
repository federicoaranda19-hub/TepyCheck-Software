import Image from 'next/image'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { getCurrentUser } from '@/lib/session'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>
}) {
  const user = await getCurrentUser()
  if (user) redirect('/menu')
  const { aviso } = await searchParams

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-brand px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative size-40 overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-teal/40 md:size-48">
            <Image
              src="/images/logo.png"
              alt="Logo de TepyCheck: pantera con un check, Tu calculadora correntina"
              fill
              priority
              sizes="192px"
              className="object-cover object-top scale-[1.12] translate-y-[3%]"
            />
          </div>
          <p className="text-pretty text-sm text-white/80">
            Calculadora de precios para supermercados
          </p>
        </div>

        {aviso === 'login' && (
          <p
            role="status"
            className="w-full rounded-lg bg-teal/15 px-4 py-3 text-center text-sm text-white ring-1 ring-teal/40"
          >
            Iniciá sesión o creá una cuenta para usar el Carrito y tu Historial.
          </p>
        )}

        <AuthForm />
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserRound } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type Modo = 'login' | 'registro'

export function AuthForm() {
  const router = useRouter()
  const [modo, setModo] = useState<Modo>('login')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    const res =
      modo === 'login'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({
            email,
            password,
            name: String(form.get('name') ?? '').trim(),
          })

    setCargando(false)
    if (res.error) {
      setError(
        modo === 'login'
          ? 'Email o contraseña incorrectos.'
          : 'No pudimos crear la cuenta. Revisá los datos (la contraseña debe tener al menos 8 caracteres).',
      )
      return
    }
    router.push('/menu')
    router.refresh()
  }

  return (
    <div className="w-full rounded-2xl bg-card p-6 shadow-xl">
      <div role="tablist" aria-label="Acceso" className="mb-6 grid grid-cols-2 rounded-lg bg-muted p-1">
        {(['login', 'registro'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={modo === m}
            onClick={() => {
              setModo(m)
              setError(null)
            }}
            className={cn(
              'rounded-md py-2 text-sm font-medium transition-colors',
              modo === m ? 'bg-card text-brand shadow-sm' : 'text-muted-foreground hover:text-brand',
            )}
          >
            {m === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {modo === 'registro' && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" name="name" required autoComplete="name" className="h-11" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            className="h-11"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={cargando} className="h-11 text-base">
          {cargando ? 'Procesando...' : modo === 'login' ? 'Ingresar' : 'Crear cuenta'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />o<span className="h-px flex-1 bg-border" />
      </div>

      <Link
        href="/menu"
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-11 w-full border-teal text-base text-accent-foreground hover:bg-accent',
        )}
      >
        <UserRound aria-hidden="true" />
        Entrar como Invitado
      </Link>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Como invitado podés consultar productos y promociones.
      </p>
    </div>
  )
}

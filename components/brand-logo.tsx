import Image from 'next/image'
import { cn } from '@/lib/utils'

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span className="relative size-9 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-white/20">
        <Image
          src="/images/logo.png"
          alt=""
          fill
          sizes="36px"
          className="object-cover object-top scale-[1.35] translate-y-[8%]"
        />
      </span>
      <span className="text-lg font-bold tracking-tight">
        Tepy<span className="text-teal">Check</span>
      </span>
    </span>
  )
}

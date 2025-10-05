import type { ReactNode } from 'react'

import { cn } from '@/src/src/utils'

export function Stat({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col justify-between w-full md:w-auto gap-y-[0.3em]', className)}>
      <span className="text-[14px] text-[#F0F2FB80]">{title}</span>
      <span className="inline-flex">{children}</span>
    </div>
  )
}

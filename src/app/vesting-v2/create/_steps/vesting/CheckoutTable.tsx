import { ReactNode } from 'react'

import { cn } from '@/src/src/utils'

export function CheckoutTable({
  headers,
  children,
}: {
  headers: { jsx: ReactNode; className?: string }[]
  children: ReactNode
}) {
  return (
    <>
      <div className="max-h-[400px] overflow-auto">
        <table className="table w-full border-collapse rounded-lg bg-steel-80">
          <thead className="sticky top-0 h-[3.5rem] z-10 rounded-lg bg-[#1F2128] text-xs text-gray-400">
            <tr className="rounded-t-lg">
              {headers.map(({ jsx, className }, idx, arr) => (
                <th
                  key={idx}
                  className={cn(
                    'px-[1rem] text-start',
                    idx === 0 && 'rounded-tl-lg pl-[1rem]',
                    idx === arr.length - 1 && 'rounded-tr-lg',
                    className
                  )}>
                  {jsx}
                </th>
              ))}
            </tr>
          </thead>
          {children}
        </table>
      </div>
    </>
  )
}

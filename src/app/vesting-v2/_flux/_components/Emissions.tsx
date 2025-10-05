'use client'

import { twMerge } from 'tailwind-merge'

import { cn } from '@/src/src/utils'

import { EmissionsChart, EmissionType } from '../../_components/EmissionsChart'

export function Emissions({
  emissions,
  tokenName,
  emissionType,
  omitResponsiveContainer,
  hideTitle = false,
  className,
}: {
  emissions: {
    name: Date
    pv?: number
  }[]
  tokenName: string
  emissionType: EmissionType
  omitResponsiveContainer?: boolean
  hideTitle?: boolean
  className?: string
}) {
  return (
    <div
      className={twMerge(
        cn('w-full h-full rounded-xl bg-transparent px-[34px] py-[32px] flex flex-col', className)
      )}>
      {!hideTitle && <p className="text-[24px] text-[#F0F2FB] font-bold">Emissions Schedule</p>}
      <div className="mt-[1em] flex-1 min-h-0 pr-[1.4em]">
        <EmissionsChart
          data={emissions}
          tokenName={tokenName}
          emissionType={emissionType}
          omitResponsiveContainer={omitResponsiveContainer}
        />
      </div>
    </div>
  )
}

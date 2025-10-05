'use client'

import { Tooltip } from '@mantine/core'

import { ReactNode } from 'react'

import { cn } from '@/src/src/utils'

import { Circle } from '../../../_svg/Circle'
import { QuestionMarkInCircle } from '../../../_svg/QuestionMarkInCircle'
import { Tick } from '../../../_svg/Tick'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

type MintOptionCardProps = {
  isActive: boolean
  icon: React.ReactNode
  title: string
  description: ReactNode
  onClick: () => void
  tooltip?: string
}

export function MintOptionCard({
  isActive,
  icon,
  title,
  description,
  onClick,
  tooltip,
}: MintOptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-[284px] w-full flex-col items-start gap-[1rem] rounded-xl px-[16px] py-[20px] hover:bg-[#2A2C33] transition-all',
        isActive ? 'bg-[#2A2C33]' : 'bg-[#202228]'
      )}>
      <div className="flex items-center justify-between w-full">
        <div>{icon}</div>
        {isActive ? <Tick fill={'#F0F2FB'} /> : <Circle fill={'#F0F2FB'} />}
      </div>
      <div className="flex h-full flex-col items-start justify-between gap-[1rem]">
        <div className="flex items-center gap-[0.5em]">
          <p className="text-[32px] text-[#F0F2FB]">{title}</p>
          {tooltip && (
            <Tooltip label={tooltip} position="top">
              <div className="cursor-help text-[#757A8B] hover:text-[#F0F2FB] transition-colors text-[14px]">
                  <QuestionMarkCircleIcon width={28} height={28} />
                </div>
            </Tooltip>
          )}
        </div>
        {description}
      </div>
    </button>
  )
}

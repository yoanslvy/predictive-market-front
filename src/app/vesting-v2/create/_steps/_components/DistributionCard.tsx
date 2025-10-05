import { cn } from '@/src/src/utils'

import { Circle } from '../../../_svg/Circle'
import { Tick } from '../../../_svg/Tick'

export type DistributionCardProps = {
  title: string
  bottomText: string
  isActive?: boolean
}

export function DistributionCard({ bottomText, title, isActive }: DistributionCardProps) {
  return (
    <div
      className={cn(
        'relative flex h-[80px] sm:h-[92px] w-full items-start justify-between rounded-xl hover:bg-[#26282E] transition-all',
        isActive ? 'bg-[#2A2C33]' : 'bg-[#202228]'
      )}>
      <div className="flex h-full flex-col justify-between px-[12px] sm:px-[16px] py-[10px] sm:py-[12px]">
        <div className="flex flex-col items-start justify-between h-full">
          <p className="text-start text-[16px] lg:text-[18px] font-[500] leading-[1.2] text-white">
            {title}
          </p>
          <p className="max-w-[120px] sm:max-w-[160px] text-start text-[12px] font-[500] text-[#757A8B]">
            {bottomText}
          </p>
        </div>
      </div>
      <div className="absolute right-0 top-0 px-[12px] sm:px-[16px] py-[10px] sm:py-[12px]">
        {isActive ? <Tick fill="#FFFFFF" /> : <Circle fill="#757A8B" />}
      </div>
    </div>
  )
}

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { ReactNode } from 'react'

import { cn } from '@/src/src/utils'

import { AirdropIcon } from '../../../_svg/AirdropIcon'
import { Circle } from '../../../_svg/Circle'
import { Tick } from '../../../_svg/Tick'
import { VestingIcon } from '../../../_svg/VestingIcon'
import { useParams } from '../_hooks/useParams'

function EventCard({
  description,
  bottomText,
  title,
  icon,
  isActive,
}: {
  description: string
  title: string
  bottomText: string
  icon: ReactNode
  isActive?: boolean
}) {
  return (
    <div
      className={cn(
        'flex h-[581px] w-[342px] items-start justify-between rounded-xl  hover:bg-[#26282E] transition-all',
        !isActive ? 'bg-[#202228]' : 'bg-[#2A2C33] hover:bg-[#2A2C33]'
      )}>
      <div className={cn('flex h-full flex-col justify-between')}>
        <div className="flex flex-col gap-[18px] p-[20px]">
          {icon}
          <p className="text-[42px] text-white">{title}</p>
          <p className="gap-[4px] text-[18px] text-[#757A8B]">{description}</p>
        </div>
        <div className="flex flex-col gap-[18px] p-[20px]">
          <p>{bottomText}</p>
        </div>
      </div>
      <div className="scale-[2.4] p-[20px]">
        {isActive ? <Tick fill="#F0F2FB" /> : <Circle fill="#F0F2FB" />}
      </div>
    </div>
  )
}

export function SelectEventType() {
  const { createQueryString, searchParams } = useParams()
  const pathname = usePathname()

  const eventType = searchParams.get('eventType')
  const isVesting = eventType === 'vesting' || !eventType
  return (
    <div className="flex items-center gap-[1em]  lg:flex-row flex-col">
      <Link
        href={`${pathname}?${createQueryString('eventType', 'vesting')}`}
        className="flex items-center gap-x-[1rem]">
        <EventCard
          title="Vesting"
          description="Set up a vesting schedule to release tokens gradually over time."
          bottomText="Perfect for rewarding team members, investors, or contributors while maintaining transparency and trust."
          icon={<VestingIcon />}
          isActive={isVesting}
        />
      </Link>
      <Link
        href={`${pathname}?${createQueryString('eventType', 'airdrop')}`}
        className="flex items-center gap-x-[1rem]">
        <EventCard
          title="Airdrop"
          description="Distribute tokens to multiple recipients at once."
          bottomText="Ideal for marketing campaigns, community rewards, or onboarding new users with a simple, fast setup."
          icon={<AirdropIcon />}
          isActive={!isVesting}
        />
      </Link>
    </div>
  )
}

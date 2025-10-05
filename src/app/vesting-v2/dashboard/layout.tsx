import { Metadata } from 'next'

import type { ReactNode } from 'react'

import { cn } from '@/src/src/utils'

import MediaBanner from '@/src/components/modules/MediaBanner'

import { CreateEventBtn } from '../_components/CreateEventBtn'

type Props = {
  children: ReactNode
}

function MultiColorTitle({
  texts,
  className,
  isUppercase,
}: {
  texts: { text: string; color: string }[]
  className?: string
  isUppercase?: boolean
}) {
  return (
    <div className={className}>
      {texts.map(({ text, color }, idx) => (
        <>
          <span
            key={idx}
            className={cn(`text-[28px]`, isUppercase && 'uppercase')}
            style={{ color }}>
            {text}
          </span>{' '}
        </>
      ))}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
}

export default async function VestingV2Layout({ children }: Props) {
  return (
    <>
      <main className="page-content-no-pt">
        <MediaBanner
          contentClassName="!max-w-[800px] "
          className="!bg-gradient-to-r from-[#141414] to-[#5e4936]"
          video="/assets/videos/p2.webm"
          img="/assets/videos/p2.png">
          <div className="flex w-full flex-col gap-y-[2rem]">
            <MultiColorTitle
              className="druk-wide-trial-bold text-[28px] leading-[33.6px]"
              isUppercase
              texts={[
                {
                  text: 'Effortless Token Distribution WITH',
                  color: '#FBC527',
                },
                { text: 'Trusted Vesting', color: '#FFE69B' },
                { text: 'and', color: '#FBC527' },
                { text: 'Airdrop Solutions', color: '#FFE69B' },
              ]}
            />
            <div className='h-[90px]' />
            {/* <GeneralStats /> */}
          </div>
        </MediaBanner>
        <div className="flex justify-between md:flex-row flex-col items-start md:items-center gap-[1rem]">
          <strong className="text-3xl text-white">Dashboard</strong>
          <CreateEventBtn />
        </div>
        {children}
      </main>
    </>
  )
}

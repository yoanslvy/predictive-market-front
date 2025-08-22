'server-only'

import '@styles/main.scss'
import '@styles/main.scss'

import React, { Suspense } from 'react'

import Button from '@modules/Button'
import Frame from '@modules/Frame'

import IconPlus from '@images/icons/plus.svg'

export const metadata = {
  title: 'Explore - UNCX Network',
  description: 'UNCX Token Vesting and Liquidity Locking',
  alternates: {
    canonical: `/grants/explore/latest`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNCX Network',
    description: `Decentralised LP Lockers and Vesting.`,
    creator: '@uncx_token',
  },
}

export default async function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Frame
        title="Explore"
        tools={
          <Button
            href="/grants/manage/grants"
            caption="New Grant"
            type="primary"
            isAccent
            icon={<IconPlus />}
          />
        }>
        {children}
      </Frame>
    </>
  )
}

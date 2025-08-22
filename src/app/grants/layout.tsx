import '@styles/main.scss'
import { Metadata } from 'next'
import 'react-tooltip/dist/react-tooltip.css'

import { ReactNode } from 'react'

import Page from '@modules/Page'
import Toaster from '@modules/Toaster/Toaster'

import Tooltip from '@/src/components/modules/Tooltip'

export const metadata: Metadata = {
  title: 'UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
}

export default function RootLayout({
  children,
  search,
}: {
  children: ReactNode
  search: ReactNode
}) {
  return (
    <>
      <Page
        appTitle="Predictive market"
        isEmbeddedApp={
          process.env.NEXT_PUBLIC_IS_SAFE !== undefined &&
          process.env.NEXT_PUBLIC_IS_SAFE === 'true'
        }
        headerLinks={[
          {
            caption: 'Explore',
            prefetch: true,
            href: '/grants/explore/latest',
            activators: ['/grants/explore'],
          },
          {
            caption: 'Manage',
            prefetch: true,
            href: '/grants/manage/grants',
            activators: ['/grants/manage', '/grants/edit'],
          },
        ]}>
        {children}
      </Page>
      {search}
      <div id="modal-root" />
      <Toaster />
      <Tooltip />
    </>
  )
}

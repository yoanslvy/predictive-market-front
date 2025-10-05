import { MantineProvider } from '@mantine/core'
import '@styles/main.scss'
import { Metadata } from 'next'
import Link from 'next/link'
import 'react-tooltip/dist/react-tooltip.css'

import { ReactNode, Suspense } from 'react'

import Page from '@modules/Page'
import Toaster from '@modules/Toaster/Toaster'

import Tooltip from '@/src/components/modules/Tooltip'

import WalletConnectionManager from './_components/wallet-connection-manager'
import './_styles/index.scss'
import { theme } from './theme'

export const metadata: Metadata = {
  title: 'UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
}

export default function VestingV2Layout({
  children,
  search,
}: {
  children: ReactNode
  search: ReactNode
}) {
  return (
    <>
      <MantineProvider theme={theme}>
        <div>
          <Page
            appTitle="Vesting"
            isEmbeddedApp={
              process.env.NEXT_PUBLIC_IS_SAFE !== undefined &&
              process.env.NEXT_PUBLIC_IS_SAFE === 'true'
            }
            banner={{
              children: (
                <div className="flex items-center justify-center w-full py-2 m-auto font-semibold text-black bg-gradient-to-r from-green-500 to-emerald-500">
                  <div className="">
                    {/* This is a Beta Version of UNCX Lockers */}
                    Solana Lockers are Live!
                  </div>
                  <Link
                    target="_blank"
                    href={'https://solana.uncx.network'}
                    className="ml-1 underline">
                    (Open Solana App ↗)
                  </Link>
                </div>
              ),
            }}
            headerLinks={[
              {
                caption: 'Explore',
                prefetch: true,
                href: '/vesting-v2/explore/tokens',
                activators: ['/vesting-v2/explore/tokens'],
                appendSearchParams: ['wallet', 'chain'],
              },
              {
                caption: 'Dashboard',
                prefetch: true,
                href: '/vesting-v2/dashboard/fluxes',
                activators: ['/vesting-v2/dashboard/airdrops', '/vesting-v2/dashboard/fluxes'],
                appendSearchParams: ['wallet', 'chain'],
              },
              {
                caption: 'Analytics',
                prefetch: false,
                href: '/vesting-v2/analytics',
                // activators: ['/lockers/manage', '/lockers/edit'],
                appendSearchParams: ['wallet', 'chain'],
              },
              {
                caption: 'Groups',
                prefetch: true,
                href: '/vesting-v2/groups',
                // activators: ['/lockers/manage', '/lockers/edit'],
                appendSearchParams: ['wallet', 'chain'],
              },
            ]}>
            {children}
          </Page>
          {search}
          <div id="modal-root-vesting-v2" />
          <Toaster />
          <Tooltip />
          <Suspense>
            <WalletConnectionManager />
          </Suspense>
        </div>
      </MantineProvider>
    </>
  )
}

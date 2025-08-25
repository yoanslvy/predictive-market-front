import '@styles/main.scss'
import { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import 'react-tooltip/dist/react-tooltip.css'

import { ReactNode } from 'react'
import React, { Suspense } from 'react'

import Page from '@modules/Page'
import Toaster from '@modules/Toaster/Toaster'

import Providers from '@/src/app/(providers)/providers'
import Tooltip from '@/src/components/modules/Tooltip'

import Cookies from './cookies'
import './globals.css'

// import { fetchTvl } from '../server/fetchers/fetchTvl'
// import Script from 'next/script'

export async function generateMetadata(): Promise<Metadata> {
  let ogUrl = 'https://app.uncx.network/opengraph-image'

  return {
    title: {
      default: 'UNCX Network',
      template: `%s - Most trusted DeFi Vesting Provider`,
    },

   

    metadataBase: new URL('https://app.uncx.network/'),

    robots: {
      follow: true,
      index: true,
    },

    twitter: {
      card: 'summary_large_image',
      creator: '@UNCX_token ',
      site: 'https://app.uncx.network/',
    },
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Suspense>{process.env.NEXT_PUBLIC_IS_SAFE !== 'true' && <Cookies />}</Suspense>
          {children}
        </Providers>
      </body>
    </html>
  )
}

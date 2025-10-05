import { cookies } from 'next/headers'
import 'server-only'

import type { ReactNode } from 'react'

import { isUserAuthenticated } from '@/src/server/queries/vesting-v2/authenticateUser'

import { Refresh } from './Refresh'
import { SignIn } from './SignIn'

export const metadata = {
  title: 'Explore - UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export type Props = {
  children: ReactNode
  wallet: string
}

export async function AuthWrapper({ children, wallet }: Props) {
  const _cookies = cookies()
  const isUserSignedIn = isUserAuthenticated({
    wallet,
    cookie: _cookies.toString(),
  })

  if (isUserSignedIn) {
    return <>{children}</>
  }

  const uncxRefreshToken = _cookies?.get('__refreshUncxToken')

  if (uncxRefreshToken) {
    return <Refresh />
  }

  return <SignIn />
}

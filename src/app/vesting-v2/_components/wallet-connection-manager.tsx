'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'

import { useEffect } from 'react'

import { useAccount } from 'wagmi'

export default function WalletConnectionManager() {
  const { address, chainId } = useAccount()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString())

    if (address) {
      currentParams.set('wallet', address)
    } else {
      currentParams.delete('wallet')
    }

    if (typeof chainId === 'number') {
      currentParams.set('chain', chainId.toString())
    } else {
      currentParams.delete('chain')
    }

    const newSearchParams = Array.from(currentParams.entries())
      .filter(([key]) => key === 'wallet' || (key !== 'wallet' && currentParams.get(key) !== null))
      .filter(([key]) => key === 'chain' || (key !== 'chain' && currentParams.get(key) !== null))
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const queryString = newSearchParams ? `?${newSearchParams}` : ''

    router.replace(`${pathname}${queryString}`)
  }, [address, searchParams, pathname, chainId])

  return null
}

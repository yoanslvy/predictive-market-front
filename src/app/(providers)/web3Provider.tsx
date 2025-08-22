'use client'

import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import React, { ReactNode } from 'react'

import { chains, config, isSafe, metadata, projectId, wagmiAdapter } from './wagmiConfig'
import { State, WagmiProvider } from 'wagmi'

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

// Create modal
!isSafe &&
  createAppKit({
    adapters: [wagmiAdapter],
    networks: chains as any,
    projectId,
    chainImages: {
      40: 'https://s2.coinmarketcap.com/static/img/coins/128x128/4660.png',
      8822: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1720.png',
      130: 'https://s3.us-east-2.amazonaws.com/assets.rollbridge.app/293ed28ec505aa2237b63.svg',
      1329: 'https://s2.coinmarketcap.com/static/img/coins/128x128/23149.png',
    },
    debug: true, // Optional - defaults to false
    metadata: metadata,
    features: {
      analytics: true,
      onramp: true,
      connectMethodsOrder: ['wallet', 'email'],
    },
  })

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: State
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

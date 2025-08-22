'use client'

import { createAppKit } from '@reown/appkit/react'
import { SafeAppWeb3Modal } from '@safe-global/safe-apps-web3modal'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import React, { ReactNode, useEffect, useState } from 'react'

import { chains, config, isSafe, metadata, projectId, wagmiAdapter } from './wagmiConfig'
import { State, WagmiProvider } from 'wagmi'

// Setup queryClient
const queryClient = new QueryClient()

if (!projectId) throw new Error('Project ID is not defined')

// let safeModal = new SafeAppWeb3Modal({
//   wagmiConfig: config,
//   projectId,
//   metadata: metadata,
//   enableAnalytics: true, // Optional - defaults to your Cloud configuration
//   enableOnramp: true // Optional - false as default
// })
// createWeb3Modal({
//   wagmiConfig: config,
//   projectId,
//   metadata: metadata,
//   enableAnalytics: true, // Optional - defaults to your Cloud configuration
//   enableOnramp: true // Optional - false as default
// })

// const provider = await safeModal.requestProvider();

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: State
}) {
  // Create modal
  const [provider, setProvider] = useState(null)

  useEffect(() => {
    ;(async () => {
      if (isSafe) {
        const modal = new SafeAppWeb3Modal({
          // wagmiConfig: config,
          // projectId,
          // metadata: metadata,
          // enableAnalytics: true, // Optional - defaults to your Cloud configuration
          // enableOnramp: true // Optional - false as default
        })

        const provider = await modal.requestProvider()
        setProvider(provider)
      } else {
        createAppKit({
          adapters: [wagmiAdapter],
          networks: chains as any,
          projectId: projectId as string,
          debug: true, // Optional - defaults to false
          metadata: metadata,
        })
      }
    })()
  }, [])

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

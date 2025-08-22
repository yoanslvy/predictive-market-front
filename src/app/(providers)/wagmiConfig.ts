import { defineChain } from 'viem'

import { fallback } from '@wagmi/core'
import { createConfig, CreateConnectorFn, http, createStorage, cookieStorage } from 'wagmi'
import {
  arbitrum,
  bsc,
  mainnet,
  optimism,
  polygon,
  base,
  avalanche,
  sepolia,
  telos,
  sei,
  unichain,
  baseSepolia,
} from '@reown/appkit/networks'

import { metaMask, injected, walletConnect, safe } from 'wagmi/connectors'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'


import { iota } from './serverWeb3Client'


// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WEB_3_MODAL_PROJECT_ID
if (!projectId) throw new Error('Project ID is not defined')

export const isSafe = process.env.NEXT_PUBLIC_IS_SAFE === 'true'

let connectors: CreateConnectorFn[] = [safe(), metaMask(), injected()]

export const metadata = {
  name: 'UNCX Network',
  description: 'Professional Decentralised Vesting Solution',
  url: 'https://app.uncx.network/',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

if (projectId) {
  // A WalletConnect ID is provided so we add the Connector for testing purposes
  connectors = !isSafe
    ? [...connectors, walletConnect({ projectId: projectId, metadata: metadata })]
    : [safe()]
}

export const chains = [
  mainnet,
  base,
  unichain,
  arbitrum,
  polygon,
  optimism,
  avalanche,
  bsc,
  iota,
  telos,
  sepolia,
  sei,
  baseSepolia,
]

export const transports = {
  [mainnet.id]: fallback(
    [http('https://eth.drpc.org'), http('https://ethereum-rpc.publicnode.com')],
    { rank: true }
  ),
  [arbitrum.id]: http(),
  [sepolia.id]: fallback([
    http('https://eth-sepolia.g.alchemy.com/v2/1I1l-3BakFdYZi3nguZrWu6etwg3KhVY'),
    http('https://ethereum-sepolia-rpc.publicnode.com'),
  ], { rank: true }),
  [polygon.id]: http(),
  [optimism.id]: http(),
  [avalanche.id]: http(),
  [base.id]: fallback([http('https://base-rpc.publicnode.com')], { rank: true }),
  [bsc.id]: fallback([
    http('https://bsc.drpc.org'),
    http('https://bsc.meowrpc.com'),
    http('https://bsc-rpc.publicnode.com'),
  ], { rank: true }),
  [telos.id]: http(),
  [iota.id]: fallback([
    http('https://json-rpc.evm.iotaledger.net'),
    http('https://iota-mainnet-evm.blastapi.io/4b66e464-9002-47ad-9c0a-7d9dcffea7bf'),
  ]),
  [sei.id]: fallback([http('https://sei.drpc.org'), http('https://evm-rpc.sei-apis.com')], {
    rank: true,
  }),
  [unichain.id]: fallback([http('https://unichain-rpc.publicnode.com'), http('https://unichain.drpc.org')], {
    rank: true,
  }),
  [baseSepolia.id]: http(),
}
const baseConfig = {
  chains: chains as any,
  transports,
}

export const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  transports,
  projectId,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})



export const config = isSafe
  ? createConfig({
    ...baseConfig,
    connectors: [...connectors],
  })
  :
  wagmiAdapter.wagmiConfig


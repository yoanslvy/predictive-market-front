import {
  mainnet,
  bsc,
  optimism,
  gnosis,
  arbitrum,
  avalanche,
  polygon,
  base,
  bscTestnet,
  sepolia,
  telos,
  sei,
  unichain,
  goerli,
} from 'viem/chains'

import { createPublicClient, http, PublicClient } from 'viem'
import { type Chain } from 'viem'

export const iota = {
  id: 8822,
  name: 'IOTA',
  nativeCurrency: { name: 'IOTA', symbol: 'IOTA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://iota-mainnet-evm.blastapi.io/4b66e464-9002-47ad-9c0a-7d9dcffea7bf/'],
    },
  },
  blockExplorers: {
    default: { name: 'Tangle', url: 'https://explorer.evm.iota.org' },
  },
} as const satisfies Chain

function baseEvm() {
  return createPublicClient({
    batch: {
      multicall: true,
    },
    chain: base,
    transport: http(process.env.QUICKNODE_BASE),
  })
}

export type BasePublicClient = ReturnType<typeof baseEvm>

const BaseClients: Record<string, BasePublicClient> = {
  '8453': createPublicClient({
    batch: {
      multicall: true, // ToDo why does setting this to true cache for like 5 mins
    },
    chain: base,
    transport: http(process.env.QUICKNODE_BASE),
  }),
}

const Clients: Record<string, PublicClient> = {
  '1': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: mainnet,
    transport: http(process.env.QUICKNODE_MAINNET),
  }),
  '5': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: goerli,
    transport: http(process.env.QUICKNODE_GOERLI),
  }),
  '10': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: optimism,
    transport: http(process.env.QUICKNODE_OPTIMISM),
  }) as PublicClient,
  '40': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: telos,
    transport: http(process.env.QUICKNODE_TELOS),
  }),
  '56': createPublicClient({
    batch: {
      multicall: true, // ToDo why does setting this to true cache for like 5 mins
    },
    chain: bsc,
    transport: http(process.env.QUICKNODE_BNB),
  }),
  '97': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: bscTestnet,
    transport: http(process.env.QUICKNODE_BNB_TESTNET),
  }),
  '100': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: gnosis,
    transport: http(process.env.QUICKNODE_GNOSIS),
  }),
  '137': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: polygon,
    transport: http(process.env.QUICKNODE_POLYGON),
  }),
  '8822': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: iota,
    transport: http(process.env.QUICKNODE_IOTA),
  }),
  '42161': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: arbitrum,
    transport: http(process.env.QUICKNODE_ARBITRUM),
  }),
  '43114': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: avalanche,
    transport: http(process.env.QUICKNODE_AVALANCHE),
  }),
  '11155111': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: sepolia,
    transport: http(process.env.QUICKNODE_SEPOLIA),
  }),
  '1329': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: sei,
    transport: http(process.env.QUICKNODE_SEI),
  }),
  '130': createPublicClient({
    batch: {
      multicall: true,
    },
    chain: unichain,
    transport: http(process.env.QUICKNODE_UNICHAIN!),
  }) as PublicClient,
}

const Self = {
  getClient(chainId: string): PublicClient {
    return Clients[chainId]
  },
  getBaseClient(chainId: string): BasePublicClient {
    return BaseClients[chainId]
  },
}

export default Self

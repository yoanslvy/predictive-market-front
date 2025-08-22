import { ReactNode } from 'react'

import IconUNKN from '@images/chains/0.svg'
import IconETH from '@images/chains/1.svg'
import IconGoerli from '@images/chains/5.svg'
import IconOP from '@images/chains/10.svg'
import IconTELOS from '@images/chains/40.svg'
import IconBNB from '@images/chains/56.svg'
import IconUNICHAIN from '@images/chains/130.svg'
import IconPOLY from '@images/chains/137.svg'
import IconSei from '@images/chains/1329.svg'
import IconBASE from '@images/chains/8453.svg'
import IconIOTA from '@images/chains/8822.svg'
import IconARBI from '@images/chains/42161.svg'
import IconAVAX from '@images/chains/43114.svg'

export const chainIdsSupported: number[] = [
  1, 5, 10, 40, 56, 130, 137, 42161, 43114, 8453, 11155111, 421614, 8822, 1329,
] as const
export type ChainIdSupported = (typeof chainIdsSupported)[number]

export type Exchange = {
  name: string
  basicName: string
  creationUrl: string
  icon?: ReactNode
  address: string
}

export type ChainId = ChainIdSupported | 0

type ChainProps = {
  id: ChainId
  shortName: string
  displayName: string
  trustWalletName?: string
  dexToolsName?: string
  coingeckoName?: string
  dexscreenerName?: string
  logo: ReactNode
  amms?: Exchange[]
}

export const ChainsData: Record<ChainId, ChainProps> = {
  0: {
    id: 0,
    shortName: 'UNKN',
    displayName: 'Unknown',
    logo: <IconUNKN />,
  },

  1: {
    id: 1,
    shortName: 'ETH',
    displayName: 'Ethereum',
    logo: <IconETH />,
    trustWalletName: 'ethereum',
    dexToolsName: 'ether',
    coingeckoName: 'eth',
    dexscreenerName: 'ethereum',
    amms: [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        address: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
      },
      {
        name: 'SushiSwap V2',
        basicName: 'SushiSwap',
        creationUrl: 'https://www.sushi.com/pool/add/v2/1',
        address: '0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac',
      },
    ],
  },
  8453: {
    id: 8453,
    shortName: 'Base',
    displayName: 'Base',
    logo: <IconBASE />,
    trustWalletName: 'base',
    dexToolsName: 'base',
    coingeckoName: 'base',
    dexscreenerName: 'base',
    amms: [
      {
        name: 'Sushiswap V2',
        basicName: 'Sushiswap',
        creationUrl: 'https://www.sushi.com/pool/add?chainId=8453',
        address: '0x71524B4f93c58fcbF659783284E38825f0622859',
      },
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        address: '0x8909dc15e40173ff4699343b6eb8132c65e18ec6',
      },
    ],
  },

  56: {
    id: 56,
    shortName: 'BSC',
    displayName: 'BNB Smart Chain',
    logo: <IconBNB />,
    trustWalletName: 'smartchain',
    dexToolsName: 'bsc',
    coingeckoName: 'bsc',
    dexscreenerName: 'bsc',
    amms: [
      {
        name: 'PancakeSwap V2',
        basicName: 'PancakeSwap',
        creationUrl: 'https://pancakeswap.finance/liquidity',
        address: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
      },
    ],
  },
  137: {
    id: 137,
    shortName: 'Polygon',
    displayName: 'Polygon',
    logo: <IconPOLY />,
    trustWalletName: 'polygon',
    dexToolsName: 'polygon',
    coingeckoName: 'polygon',
    dexscreenerName: 'polygon',
    amms: [
      {
        name: 'QuickSwap V2',
        basicName: 'QuickSwap',
        creationUrl: 'https://quickswap.exchange/#/pools/v2',
        address: '0x5757371414417b8c6caad45baef941abc7d3ab32',
      },
    ],
  },

  130: {
    id: 130,
    shortName: 'UNI',
    displayName: 'Unichain',
    logo: <IconUNICHAIN />,
    trustWalletName: 'unichain',
    dexToolsName: 'unichain',
    coingeckoName: 'unichain',
    dexscreenerName: 'unichain',
    amms: [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        address: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
      },
    ],
  },
  10: {
    id: 10,
    shortName: 'ETH',
    displayName: 'Optimism',
    logo: <IconOP />,
    trustWalletName: 'optimism',
    dexToolsName: 'ether',
    dexscreenerName: 'optimism',
    amms: [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        address: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
      },
    ],
  },
  421614: {
    id: 421614,
    shortName: 'Arbitrum Sepolia',
    displayName: 'Arbitrum Sepolia',
    logo: <IconARBI />,
    trustWalletName: 'arbitrum sepolia',
    dexToolsName: 'arbitrum sepolia',
    dexscreenerName: 'arbitrum-sepolia',
    amms: [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        address: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
      },
    ],
  },

  5: {
    id: 5,
    shortName: 'Goerli',
    displayName: 'Goerli Testnet',
    logo: <IconGoerli />,
    trustWalletName: 'goerli',
    dexToolsName: 'goerli',
    dexscreenerName: 'goerli',
    amms: [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH?chain=goerli',
        address: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
      },
    ],
  },
  11155111: {
    id: 11155111,
    shortName: 'Sepolia',
    displayName: 'Sepolia Testnet',
    logo: <IconETH />,
    trustWalletName: 'sepolia',
    dexToolsName: 'sepolia',
    dexscreenerName: 'sepolia',
    amms: [
      // {
      //   name: 'Uniswap V2',
      //   basicName: 'Uniswap',
      //   creationUrl: 'https://app.uniswap.org/add/v2/ETH?chain=sepolia',
      //   address: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f'
      // },
    ],
  },

  42161: {
    id: 42161,
    shortName: 'Arbitrum',
    displayName: 'Arbitrum',
    logo: <IconARBI />,
    trustWalletName: 'arbitrum',
    dexToolsName: 'arbitrum',
    dexscreenerName: 'arbitrum',
    amms: [
      {
        name: 'SushiSwap V2',
        basicName: 'SushiSwap',
        creationUrl: 'https://www.sushi.com/pool/add/v2/42161',
        address: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
      },
      {
        name: 'Camelot V2',
        basicName: 'Camelot',
        creationUrl: 'https://app.camelot.exchange/liquidity',
        address: '0x6eccab422d763ac031210895c81787e87b43a652',
      },
    ],
  },

  43114: {
    id: 43114,
    shortName: 'Avalanche',
    displayName: 'Avalanche',
    logo: <IconAVAX />,
    trustWalletName: 'avalanche',
    dexToolsName: 'avalanche',
    dexscreenerName: 'avalanche',
    amms: [
      {
        name: 'TraderJoe V1',
        basicName: 'TraderJoe',
        creationUrl: 'https://traderjoexyz.com/avalanche/pool/v1/create',
        address: '0x9ad6c38be94206ca50bb0d90783181662f0cfa10',
      },
    ],
  },

  8822: {
    id: 8822,
    shortName: 'IOTA',
    displayName: 'IOTA',
    logo: <IconIOTA />,
    trustWalletName: 'iota',
    dexToolsName: 'iota',
    amms: [
      {
        name: 'MagicSea V2',
        basicName: 'MagicSea',
        creationUrl: 'https://app.magicsea.finance/liquidityv3',
        address: '0x349aaac3a500014981cba11b64c76c66a6c1e8d0',
      },
    ],
  },

  40: {
    id: 40,
    shortName: 'TELOS',
    displayName: 'Telos',
    logo: <IconTELOS />,
    trustWalletName: 'telos',
    dexToolsName: 'telos',
    amms: [
      {
        name: 'VaporDEX V2',
        basicName: 'VaporDEX',
        creationUrl: 'https://www.vapordex.io/liquidity',
        address: '0xdef9ee39fd82ee57a1b789bc877e2cbd88fd5cae',
      },
    ],
  },
  1329: {
    id: 1329,
    shortName: 'SEI',
    displayName: 'SEI Network',
    logo: <IconSei style={{ borderRadius: '999px' }} />,
    trustWalletName: 'sei',
    dexToolsName: 'sei',
    dexscreenerName: 'seiv2',
    amms: [
      {
        name: 'DragonSwap V1',
        basicName: 'DragonSwap V1',
        creationUrl: 'https://dragonswap.app/swap',
        address: '0xa4cF2F53D1195aDDdE9e4D3aCa54f556895712f2',
      },
    ],
  },
}

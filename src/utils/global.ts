import { now as Now, CalendarDate, Time, CalendarDateTime } from '@internationalized/date'
import { DateTime, Duration } from 'luxon'
import { Address, erc20Abi, formatUnits, parseUnits, PublicClient } from 'viem'
import { TokenLock } from '@/src/server/fetchers/vesting/getUserLocksVestingViem'
import UniswapIcon from '../images/amm/uniswap.svg'
import QuickSwapIcon from '../images/amm/quickswap.png'
import PancakeSwapIcon from '../images/amm/pancakeswap.png'
import SushiSwapIcon from '../images/amm/sushiswap.png'
import TraderJoeIcon from '../images/amm/traderjoe.png'
import CamelotIcon from '../images/amm/camelot.svg'
import MagicSeaIcon from '../images/amm/magicsea.svg'
import VaporDEXIcon from '../images/amm/vapor.svg'
import AerodromeIcon from '../images/amm/aerodrome.svg'
import DragonSwapIcon from '../images/amm/dragonswap.svg'


export let currentTimestamp = Date.now() / 1000

export const baseMetaUrl = 'https://beta.uncx.network'
export const uncx_dev_address = '0xAA3d85aD9D128DFECb55424085754F6dFa643eb1'

export const stealthChainNameMap: {
  [key: string]: {
    name: string
    symbol: string
    wrappedSymbol: string
    logo: string
  }
} = {
  '1': {
    name: 'Ethereum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '11155111': {
    name: 'Sepolia',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '137': {
    name: 'Polygon',
    symbol: 'MATIC',
    wrappedSymbol: 'WMATIC',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png',
  },
  '42161': {
    name: 'Arbitrum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '8453': {
    name: 'Base',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '56': {
    name: 'BNB Chain',
    symbol: 'BNB',
    wrappedSymbol: 'WBNB',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bnb/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
  },
  '43114': {
    name: 'Avalanche',
    symbol: 'AVAX',
    wrappedSymbol: 'WAVAX',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanche/assets/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo.png',
  },
  '40': {
    name: 'Telos',
    symbol: 'TLOS',
    wrappedSymbol: 'WTLOS',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/telos/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '8822': {
    name: 'IOTA',
    symbol: 'IOTA',
    wrappedSymbol: 'wIOTA',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/iota/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '1329': {
    name: 'SEI Network',
    symbol: 'SEI',
    wrappedSymbol: 'WSEI',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/refs/heads/master/blockchains/sei/info/logo.png',
  },
}

export const minterChainNameMap: {
  [key: string]: {
    name: string
    symbol: string
    wrappedSymbol: string
    logo: string
  }
} = {
  '1': {
    name: 'Ethereum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '11155111': {
    name: 'Sepolia',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '137': {
    name: 'Polygon',
    symbol: 'POL',
    wrappedSymbol: 'WMATIC',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/logo.png',
  },
  '42161': {
    name: 'Arbitrum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '8453': {
    name: 'Base',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '56': {
    name: 'BNB Chain',
    symbol: 'BNB',
    wrappedSymbol: 'WBNB',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bnb/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png',
  },
  '43114': {
    name: 'Avalanche',
    symbol: 'AVAX',
    wrappedSymbol: 'WAVAX',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanche/assets/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo.png',
  },
  '40': {
    name: 'Telos',
    symbol: 'TLOS',
    wrappedSymbol: 'WTLOS',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/telos/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '8822': {
    name: 'IOTA',
    symbol: 'IOTA',
    wrappedSymbol: 'wIOTA',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/iota/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '130': {
    name: 'Unichain',
    symbol: 'ETH',
    wrappedSymbol: 'wETH',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  '1329': {
    name: 'SEI Network',
    symbol: 'SEI',
    wrappedSymbol: 'WSEI',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/refs/heads/master/blockchains/sei/info/logo.png',
  },
};

export const farmsChainNameMap: {
  [key: string]: {
    name: string,
    symbol: string,
    wrappedSymbol: string,
    logo: string
  }
} = {
  '1': {
    name: 'Ethereum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
  },
  '56': {
    name: 'BNB Chain',
    symbol: 'BNB',
    wrappedSymbol: 'WBNB',
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bnb/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png"
  },
  '11155111': {
    name: 'Sepolia',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
  },
  '43114': {
    name: 'Avalanche',
    symbol: 'AVAX',
    wrappedSymbol: 'WAVAX',
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanche/assets/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo.png"
  },
};

export const vestingChainNameMap: {
  [key: string]: {
    name: string
    symbol: string
    wrappedSymbol: string
  }
} = {
  '1': {
    name: 'Ethereum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '8453': {
    name: 'Base',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '42161': {
    name: 'Arbitrum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '56': {
    name: 'BNB Chain',
    symbol: 'BNB',
    wrappedSymbol: 'WBNB',
  },
  '137': {
    name: 'Polygon',
    symbol: 'MATIC',
    wrappedSymbol: 'WMATIC',
  },
  '8822': {
    name: 'IOTA',
    symbol: 'IOTA',
    wrappedSymbol: 'wIOTA',
  },
  '1329': {
    name: 'SEI Network',
    symbol: 'SEI',
    wrappedSymbol: 'WSEI',
  },
}



export const chainNameMap: {
  [key: string]: {
    name: string
    symbol: string
    wrappedSymbol: string
  }
} = {
  '1': {
    name: 'Ethereum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '8453': {
    name: 'Base',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '42161': {
    name: 'Arbitrum',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '56': {
    name: 'BNB Chain',
    symbol: 'BNB',
    wrappedSymbol: 'WBNB',
  },
  '137': {
    name: 'Polygon',
    symbol: 'MATIC',
    wrappedSymbol: 'WMATIC',
  },
  '130': {
    name: 'Unichain',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '10': {
    name: 'Optimism',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '11155111': {
    name: 'Sepolia',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '40': {
    name: 'Telos',
    symbol: 'TLOS',
    wrappedSymbol: 'WTLOS',
  },
  '5': {
    name: 'Goerli',
    symbol: 'ETH',
    wrappedSymbol: 'WETH',
  },
  '43114': {
    name: 'Avalanche',
    symbol: 'AVAX',
    wrappedSymbol: 'WAVAX',
  },
  '8822': {
    name: 'IOTA',
    symbol: 'IOTA',
    wrappedSymbol: 'wIOTA',
  },
  '1329': {
    name: 'SEI Network',
    symbol: 'SEI',
    wrappedSymbol: 'WSEI',
  },
}

export const chainUniV2EndpointMap: {
  [key: string]: string
} = {
  '1':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_ETH_UNIV2_NETWORK']!
      : process.env['GRAPH_ETH_UNIV2_NETWORK']!,
}

export const chainLockersV2EndpointMap: {
  [key: string]: string
} = {
  '1':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_ETH_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_ETH_LOCKERSV2_LOCAL']!,
  '137':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_POLY_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_POLY_LOCKERSV2_LOCAL']!,
  '56':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_BSC_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_BSC_LOCKERSV2_LOCAL']!,
  '42161':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_ARB_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_ARB_LOCKERSV2_LOCAL']!,
  '43114':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_AVAX_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_AVAX_LOCKERSV2_LOCAL']!,
  '5':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_GOERLI_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_GOERLI_LOCKERSV2_LOCAL']!,
  '10':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_OPTIMISM_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_OPTIMISM_LOCKERSV2_LOCAL']!,
  '40':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_TELOS_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_TELOS_LOCKERSV2_LOCAL']!,
  '8453':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_BASE_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_BASE_LOCKERSV2_LOCAL']!,
  '8822':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_IOTA_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_IOTA_LOCKERSV2_LOCAL']!,
  '1329':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_SEI_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_SEI_LOCKERSV2_LOCAL']!,
  '130':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_UNICHAIN_LOCKERSV2_NETWORK']!
      : process.env['GRAPH_UNICHAIN_LOCKERSV2_LOCAL']!,
}

export const chainVestingV1EndpointMap: {
  [key: string]: string
} = {
  '1':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_ETH_VESTING_NETWORK']!
      : process.env['GRAPH_ETH_VESTING_LOCAL']!,
  '8453':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_BASE_VESTING_NETWORK']!
      : process.env['GRAPH_BASE_VESTING_LOCAL']!,
  '42161':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_ARB_VESTING_LOCAL']!
      : process.env['GRAPH_ARB_VESTING_LOCAL']!,
  '8822':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_IOTA_VESTING_LOCAL']!
      : process.env['GRAPH_IOTA_VESTING_LOCAL']!,
  '40':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_TELOS_VESTING_LOCAL']!
      : process.env['GRAPH_TELOS_VESTING_LOCAL']!,
  '56':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_BSC_VESTING_LOCAL']!
      : process.env['GRAPH_BSC_VESTING_LOCAL']!,
  '137':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_POLY_VESTING_LOCAL']!
      : process.env['GRAPH_POLY_VESTING_LOCAL']!,
  '1329':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_SEI_VESTING_LOCAL']!
      : process.env['GRAPH_SEI_VESTING_LOCAL']!,
}

export const chainLockersV3EndpointMap: {
  [key: string]: string
} = {
  '1':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_ETH_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_ETH_LOCKERSV3_LOCAL']!,
  '10':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_OPTIMISM_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_OPTIMISM_LOCKERSV3_LOCAL']!,
  '137':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_POLY_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_POLY_LOCKERSV3_LOCAL']!,
  '56':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_BSC_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_BSC_LOCKERSV3_LOCAL']!,
  '42161':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_ARB_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_ARB_LOCKERSV3_LOCAL']!,
  '5':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_GOERLI_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_GOERLI_LOCKERSV3_LOCAL']!,
  '8453':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_BASE_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_BASE_LOCKERSV3_LOCAL']!,
  '43114':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_AVAX_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_AVAX_LOCKERSV3_LOCAL']!,
  '11155111':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_SEPOLIA_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_SEPOLIA_LOCKERSV3_LOCAL']!,
  '1329':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_SEI_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_SEI_LOCKERSV3_LOCAL']!,
  '130':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_UNICHAIN_LOCKERSV3_NETWORK']!
      : process.env['GRAPH_UNICHAIN_LOCKERSV3_LOCAL']!,
}

export const chainLockersV4EndpointMap: {
  [key: string]: string
} = {
  '8453':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_BASE_LOCKERSV4_NETWORK']!
      : process.env['GRAPH_BASE_LOCKERSV4_LOCAL']!,
  '11155111':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_SEPOLIA_LOCKERSV4_NETWORK']!
      : process.env['GRAPH_SEPOLIA_LOCKERSV4_LOCAL']!,
  '1':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_ETH_LOCKERSV4_NETWORK']!
      : process.env['GRAPH_ETH_LOCKERSV4_LOCAL']!,
  '130':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_UNICHAIN_LOCKERSV4_NETWORK']!
      : process.env['GRAPH_UNICHAIN_LOCKERSV4_LOCAL']!,
  '42161':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_ARB_LOCKERSV4_NETWORK']!
      : process.env['GRAPH_ARB_LOCKERSV4_LOCAL']!,
  '56':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_BSC_LOCKERSV4_NETWORK']!
      : process.env['GRAPH_BSC_LOCKERSV4_LOCAL']!,
  '137':
    process.env['NODE_ENV'] == 'production'
      ? process.env['GRAPH_POLY_LOCKERSV4_NETWORK']!
      : process.env['GRAPH_POLY_LOCKERSV4_LOCAL']!,
}

export const chainStealthLaunchEndpointMap: {
  [key: string]: string
} = {
  '1':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_ETH_STEALTHLAUNCH_NETWORK']!
      : process.env['GRAPH_ETH_STEALTHLAUNCH_LOCAL']!,
  '11155111':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_SEPOLIA_STEALTHLAUNCH_NETWORK']!
      : process.env['GRAPH_SEPOLIA_STEALTHLAUNCH_LOCAL']!,
  '137':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_POLY_STEALTHLAUNCH_NETWORK']!
      : process.env['GRAPH_POLY_STEALTHLAUNCH_LOCAL']!,
  '42161':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_ARB_STEALTHLAUNCH_NETWORK']!
      : process.env['GRAPH_ARB_STEALTHLAUNCH_LOCAL']!,
  '56':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_BSC_STEALTHLAUNCH_NETWORK']!
      : process.env['GRAPH_BSC_STEALTHLAUNCH_LOCAL']!,
  '43114':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_AVAX_STEALTHLAUNCH_NETWORK']!
      : process.env['GRAPH_AVAX_STEALTHLAUNCH_LOCAL']!,
  '40':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_TELOS_STEALTHLAUNCH_NETWORK']!
      : process.env['GRAPH_TELOS_STEALTHLAUNCH_LOCAL']!,
  '8453':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_BASE_STEALTHLAUNCH_NETWORK']!
      : process.env['GRAPH_BASE_STEALTHLAUNCH_LOCAL']!,
  '8822':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_IOTA_STEALTHLAUNCH_NETWORK']!
      : process.env['GRAPH_IOTA_STEALTHLAUNCH_LOCAL']!,
}

export const chainTokenMinterEndpointMap: {
  [key: string]: string
} = {
  '1':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_ETH_MINTER_NETWORK']!
      : process.env['GRAPH_ETH_MINTER_LOCAL']!,
  '11155111':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_SEPOLIA_MINTER_NETWORK']!
      : process.env['GRAPH_SEPOLIA_MINTER_LOCAL']!,
  '137':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_POLY_MINTER_NETWORK']!
      : process.env['GRAPH_POLY_MINTER_LOCAL']!,
  '42161':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_ARB_MINTER_NETWORK']!
      : process.env['GRAPH_ARB_MINTER_LOCAL']!,
  '56':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_BSC_MINTER_NETWORK']!
      : process.env['GRAPH_BSC_MINTER_LOCAL']!,
  '43114':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_AVAX_MINTER_NETWORK']!
      : process.env['GRAPH_AVAX_MINTER_LOCAL']!,
  '40':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_TELOS_MINTER_NETWORK']!
      : process.env['GRAPH_TELOS_MINTER_LOCAL']!,
  '8453':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_BASE_MINTER_NETWORK']!
      : process.env['GRAPH_BASE_MINTER_LOCAL']!,
  '8822':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_IOTA_MINTER_NETWORK']!
      : process.env['GRAPH_IOTA_MINTER_LOCAL']!,
  '1329':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_SEI_MINTER_NETWORK']!
      : process.env['GRAPH_SEI_MINTER_LOCAL']!,
  '130':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_UNI_MINTER_NETWORK']!
      : process.env['GRAPH_UNI_MINTER_LOCAL']!,
};

export const chainFarmsEndpointMap: {
  [key: string]: string;
} = {
  '1':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_ETH_FARMS_NETWORK']!
      : process.env['GRAPH_ETH_FARMS_LOCAL']!,
  '11155111':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_SEPOLIA_FARMS_NETWORK']!
      : process.env['GRAPH_SEPOLIA_FARMS_LOCAL']!,
  '56':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_BSC_FARMS_NETWORK']!
      : process.env['GRAPH_BSC_FARMS_LOCAL']!,
  '43114':
    process.env['PRODUCTION'] == 'true'
      ? process.env['GRAPH_AVAX_FARMS_NETWORK']!
      : process.env['GRAPH_AVAX_FARMS_LOCAL']!,
};

export const endpointChainMap: {
  [key: string]: string
} = {
  GRAPH_ETH_UNIV2_NETWORK: '1',
  GRAPH_ETH_LOCKERSV2_LOCAL: '1',
  GRAPH_ETH_LOCKERSV2_NETWORK: '1',
  GRAPH_POLY_LOCKERSV2_LOCAL: '137',
  GRAPH_POLY_LOCKERSV2_NETWORK: '137',
  GRAPH_BSC_LOCKERSV2_LOCAL: '56',
  GRAPH_BSC_LOCKERSV2_NETWORK: '56',
  GRAPH_ARB_LOCKERSV2_LOCAL: '42161',
  GRAPH_ARB_LOCKERSV2_NETWORK: '42161',
  GRAPH_AVAX_LOCKERSV2_LOCAL: '43114',
  GRAPH_AVAX_LOCKERSV2_NETWORK: '43114',
  GRAPH_GOERLI_LOCKERSV2_LOCAL: '5',
  GRAPH_GOERLI_LOCKERSV2_NETWORK: '5',
  GRAPH_TELOS_LOCKERSV2_LOCAL: '40',
  GRAPH_TELOS_LOCKERSV2_NETWORK: '40',
  GRAPH_BASE_LOCKERSV2_LOCAL: '8453',
  GRAPH_BASE_LOCKERSV2_NETWORK: '8453',
  GRAPH_IOTA_LOCKERSV2_LOCAL: '8822',
  GRAPH_IOTA_LOCKERSV2_NETWORK: '8822',
  GRAPH_SEI_LOCKERSV2_LOCAL: '1329',
  GRAPH_SEI_LOCKERSV2_NETWORK: '1329',
  GRAPH_UNICHAIN_LOCKERSV2_LOCAL: '130',
  GRAPH_UNICHAIN_LOCKERSV2_NETWORK: '130',
  // GRAPH_SEPOLIA_LOCKERSV2_LOCAL: '11155111',
  // GRAPH_SEPOLIA_LOCKERSV2_NETWORK: '11155111',
  GRAPH_ETH_LOCKERSV3_LOCAL: '1',
  GRAPH_ETH_LOCKERSV3_NETWORK: '1',
  GRAPH_OPTIMISM_LOCKERSV2_LOCAL: '10',
  GRAPH_OPTIMISM_LOCKERSV2_NETWORK: '10',
  GRAPH_OPTIMISM_LOCKERSV3_LOCAL: '10',
  GRAPH_OPTIMISM_LOCKERSV3_NETWORK: '10',
  GRAPH_POLY_LOCKERSV3_LOCAL: '137',
  GRAPH_POLY_LOCKERSV3_NETWORK: '137',
  GRAPH_BSC_LOCKERSV3_LOCAL: '56',
  GRAPH_BSC_LOCKERSV3_NETWORK: '56',
  GRAPH_ARB_LOCKERSV3_LOCAL: '42161',
  GRAPH_ARB_LOCKERSV3_NETWORK: '42161',
  GRAPH_BASE_LOCKERSV3_LOCAL: '8453',
  GRAPH_BASE_LOCKERSV3_NETWORK: '8453',
  GRAPH_AVAX_LOCKERSV3_LOCAL: '43114',
  GRAPH_AVAX_LOCKERSV3_NETWORK: '43114',
  GRAPH_GOERLI_LOCKERSV3_LOCAL: '5',
  GRAPH_GOERLI_LOCKERSV3_NETWORK: '5',
  GRAPH_SEPOLIA_LOCKERSV3_LOCAL: '11155111',
  GRAPH_SEPOLIA_LOCKERSV3_NETWORK: '11155111',
  GRAPH_SEI_LOCKERSV3_LOCAL: '1329',
  GRAPH_SEI_LOCKERSV3_NETWORK: '1329',
  GRAPH_UNICHAIN_LOCKERSV3_LOCAL: '130',
  GRAPH_UNICHAIN_LOCKERSV3_NETWORK: '130',
  GRAPH_BASE_LOCKERSV4_LOCAL: '8453',
  GRAPH_BASE_LOCKERSV4_NETWORK: '8453',
  GRAPH_SEPOLIA_LOCKERSV4_LOCAL: '11155111',
  GRAPH_SEPOLIA_LOCKERSV4_NETWORK: '11155111',
  GRAPH_ETH_LOCKERSV4_LOCAL: '1',
  GRAPH_ETH_LOCKERSV4_NETWORK: '1',
  GRAPH_UNICHAIN_LOCKERSV4_LOCAL: '130',
  GRAPH_UNICHAIN_LOCKERSV4_NETWORK: '130',
  GRAPH_ARB_LOCKERSV4_LOCAL: '42161',
  GRAPH_ARB_LOCKERSV4_NETWORK: '42161',
  GRAPH_BSC_LOCKERSV4_LOCAL: '56',
  GRAPH_BSC_LOCKERSV4_NETWORK: '56',
  GRAPH_POLY_LOCKERSV4_LOCAL: '137',
  GRAPH_POLY_LOCKERSV4_NETWORK: '137',
  GRAPH_ETH_VESTING_LOCAL: '1',
  GRAPH_ETH_VESTING_NETWORK: '1',
  GRAPH_TELOS_VESTING_LOCAL: '40',
  GRAPH_TELOS_VESTING_NETWORK: '40',
  GRAPH_BSC_VESTING_LOCAL: '56',
  GRAPH_BSC_VESTING_NETWORK: '56',
  GRAPH_POLY_VESTING_LOCAL: '137',
  GRAPH_POLY_VESTING_NETWORK: '137',
  GRAPH_BASE_VESTING_LOCAL: '8453',
  GRAPH_BASE_VESTING_NETWORK: '8453',
  GRAPH_ARB_VESTING_LOCAL: '42161',
  GRAPH_ARB_VESTING_NETWORK: '42161',
  GRAPH_IOTA_VESTING_LOCAL: '8822',
  GRAPH_IOTA_VESTING_NETWORK: '8822',
  GRAPH_SEI_VESTING_LOCAL: '1329',
  GRAPH_SEI_VESTING_NETWORK: '1329',
  // GRAPH_SEPOLIA_VESTING_LOCAL: '11155111',
  // GRAPH_SEPOLIA_VESTING_NETWORK: '11155111',

  //STEALTHLAUNCH
  GRAPH_SEPOLIA_STEALTHLAUNCH_LOCAL: '11155111',
  GRAPH_SEPOLIA_STEALTHLAUNCH_NETWORK: '11155111',
  GRAPH_POLY_STEALTHLAUNCH_LOCAL: '137',
  GRAPH_POLY_STEALTHLAUNCH_NETWORK: '137',
  GRAPH_ARB_STEALTHLAUNCH_LOCAL: '42161',
  GRAPH_ARB_STEALTHLAUNCH_NETWORK: '42161',
  GRAPH_ETH_STEALTHLAUNCH_LOCAL: '1',
  GRAPH_ETH_STEALTHLAUNCH_NETWORK: '1',
  GRAPH_BSC_STEALTHLAUNCH_LOCAL: '56',
  GRAPH_BSC_STEALTHLAUNCH_NETWORK: '56',
  GRAPH_AVAX_STEALTHLAUNCH_LOCAL: '43114',
  GRAPH_AVAX_STEALTHLAUNCH_NETWORK: '43114',
  GRAPH_TELOS_STEALTHLAUNCH_LOCAL: '40',
  GRAPH_TELOS_STEALTHLAUNCH_NETWORK: '40',
  GRAPH_BASE_STEALTHLAUNCH_LOCAL: '8453',
  GRAPH_BASE_STEALTHLAUNCH_NETWORK: '8453',
  GRAPH_IOTA_STEALTHLAUNCH_LOCAL: '8822',
  GRAPH_IOTA_STEALTHLAUNCH_NETWORK: '8822',

  //MINTER
  GRAPH_SEPOLIA_MINTER_LOCAL: '11155111',
  GRAPH_SEPOLIA_MINTER_NETWORK: '11155111',
  GRAPH_POLY_MINTER_LOCAL: '137',
  GRAPH_POLY_MINTER_NETWORK: '137',
  GRAPH_ARB_MINTER_LOCAL: '42161',
  GRAPH_ARB_MINTER_NETWORK: '42161',
  GRAPH_ETH_MINTER_LOCAL: '1',
  GRAPH_ETH_MINTER_NETWORK: '1',
  GRAPH_BSC_MINTER_LOCAL: '56',
  GRAPH_BSC_MINTER_NETWORK: '56',
  GRAPH_AVAX_MINTER_LOCAL: '43114',
  GRAPH_AVAX_MINTER_NETWORK: '43114',
  GRAPH_TELOS_MINTER_LOCAL: '40',
  GRAPH_TELOS_MINTER_NETWORK: '40',
  GRAPH_BASE_MINTER_LOCAL: '8453',
  GRAPH_BASE_MINTER_NETWORK: '8453',
  GRAPH_IOTA_MINTER_LOCAL: '8822',
  GRAPH_IOTA_MINTER_NETWORK: '8822',
  GRAPH_UNI_MINTER_LOCAL: '130',
  GRAPH_UNI_MINTER_NETWORK: '130',
  GRAPH_SEI_MINTER_LOCAL: '1329',
  GRAPH_SEI_MINTER_NETWORK: '1329',

  //FARMS
  GRAPH_SEPOLIA_FARMS_LOCAL: '11155111',
  GRAPH_SEPOLIA_FARMS_NETWORK: '11155111',
  GRAPH_ETH_FARMS_LOCAL: '1',
  GRAPH_ETH_FARMS_NETWORK: '1',
  GRAPH_BSC_FARMS_LOCAL: '56',
  GRAPH_BSC_FARMS_NETWORK: '56',
  GRAPH_AVAX_FARMS_LOCAL: '43114',
  GRAPH_AVAX_FARMS_NETWORK: '43114',

}

// Vesting here

type Exchange = {
  name: string
  basicName: string
  creationUrl: string
  icon: React.ReactNode
}

type ChainMap = {
  [key: string]: Exchange[]
} & {
  '137': Exchange[]
  '56': Exchange[]
  '1': Exchange[]
  '10': Exchange[]
  '40': Exchange[]
  '42161': Exchange[]
  '43114': Exchange[]
  '8453': Exchange[]
  '8822': Exchange[]
  '130': Exchange[]
  '11155111': Exchange[]
  '1329': Exchange[]
}

export const chainMetadata: {
  [key: string]: {
    explorer: {
      name: string
      url: string
    }
  }
} = {
  '1': {
    explorer: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
    },
  },
  '10': {
    explorer: {
      name: 'Etherscan',
      url: 'https://optimistic.etherscan.io',
    },
  },
  '11155111': {
    explorer: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
  },
  '421614': {
    explorer: {
      name: 'Arbitrum Sepolia',
      url: 'https://sepolia.arbiscan.io',
    },
  },
  '56': {
    explorer: {
      name: 'BSCScan',
      url: 'https://bscscan.com',
    },
  },
  '40': {
    explorer: {
      name: 'Teloscan',
      url: 'https://www.teloscan.io',
    },
  },
  // Polygon Network
  '137': {
    explorer: {
      name: 'Polygonscan',
      url: 'https://polygonscan.com',
    },
  },
  // Avalanche C-Chain
  '43114': {
    explorer: {
      name: 'SnowTrace',
      url: 'https://snowtrace.io',
    },
  },
  '8453': {
    explorer: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
  // Arbitrum One
  '42161': {
    explorer: {
      name: 'Arbiscan',
      url: 'https://arbiscan.io',
    },
  },
  '8822': {
    explorer: {
      name: 'Tangle',
      url: 'https://explorer.evm.iota.org',
    },
  },
  '130': {
    explorer: {
      name: 'Uniscan',
      url: 'https://uniscan.xyz/',
    },
  },
  '1329': {
    explorer: {
      name: 'Seiscan',
      url: 'https://seistream.app/',
    },
  },
}

export function calendarDateTimeToTimestamp(calendarDateTime: CalendarDateTime): number {
  // Assuming calendarDateTime includes properties like year, month, day, etc.
  // and a toString() method that returns an ISO 8601 string representation including the time zone.
  const date = new Date(calendarDateTime.toString())
  return Math.floor(date.getTime() / 1000) // Convert milliseconds to seconds
}

export function timestampToCalendarDateTime(timestamp: number): CalendarDateTime {
  const date = new Date(timestamp * 1000) // Convert seconds to milliseconds
  // Create a CalendarDateTime object. This example assumes the Gregorian calendar.
  // You may need to adjust this based on how your CalendarDateTime constructor expects arguments.
  return new CalendarDateTime(
    date.getFullYear(), // Local year
    date.getMonth() + 1, // Local month (JavaScript months are 0-indexed)
    date.getDate(), // Local day
    date.getHours(), // Local hour
    date.getMinutes(), // Local minute
    date.getSeconds() // Local second
  )
}

export const supportedExchangesMap: {
  lockersV2: ChainMap,
  lockersV3: ChainMap
} = {
  lockersV2: {
    '137': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon
      },
      {
        name: 'QuickSwap V2',
        basicName: 'QuickSwap',
        creationUrl: 'https://quickswap.exchange/#/pools/v2',
        icon: QuickSwapIcon
      },
    ],
    '56': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
      {
        name: 'PancakeSwap V2',
        basicName: 'PancakeSwap',
        creationUrl: 'https://pancakeswap.finance/liquidity',
        icon: PancakeSwapIcon
      },
      // { name: 'Uniswap V3', creationUrl: 'https://app.uniswap.org/#/swap' },
      // { name: 'PancakeSwap V3', creationUrl: 'https://pancakeswap.finance/swap' },
    ],
    '1': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
      {
        name: 'SushiSwap V2',
        basicName: 'SushiSwap',
        creationUrl: 'https://www.sushi.com/pool/add/v2/1',
        icon: SushiSwapIcon
      },
    ],
    '11155111': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
    ],
    '10': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
    ],
    '42161': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon
      },
      {
        name: 'SushiSwap V2',
        basicName: 'SushiSwap',
        creationUrl: 'https://www.sushi.com/pool/add/v2/42161',
        icon: SushiSwapIcon
      },
      {
        name: 'Camelot V2',
        basicName: 'Camelot',
        creationUrl: 'https://app.camelot.exchange/liquidity',
        icon: CamelotIcon
      },
    ],
    '43114': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
      {
        name: 'TraderJoe V1',
        basicName: 'TraderJoe',
        creationUrl: 'https://traderjoexyz.com/avalanche/pool/v1/create',
        icon: TraderJoeIcon
      },
    ],
    '8453': [
      {
        name: 'Uniswap ',
        basicName: 'Uniswap ',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon
      },
      {
        name: 'SushiSwap',
        basicName: 'SushiSwap',
        creationUrl: 'https://www.sushi.com/pool/add/v2/8453',
        icon: SushiSwapIcon
      },
      {
        name: 'Aerodrome V2',
        basicName: 'Aerodrome',
        creationUrl: 'https://app.aerodrome.xyz/add/v2/ETH',
        icon: AerodromeIcon
      },
    ],
    '8822': [
      {
        name: 'MagicSea V2',
        basicName: 'MagicSea',
        creationUrl: 'https://app.magicsea.finance/liquidityv3',
        icon: MagicSeaIcon
      },
    ],
    '40': [
      {
        name: 'VaporDEX V2',
        basicName: 'VaporDEX',
        creationUrl: 'https://www.vapordex.io/liquidity',
        icon: VaporDEXIcon
      },
    ],
    '1329': [
      {
        name: 'Uniswap V2',
        basicName: 'DragonSwap V1',
        creationUrl: 'https://dragonswap.app/swap',
        icon: DragonSwapIcon
      },
    ],
    '130': [
      {
        name: 'Uniswap V4',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon
      },
    ],
  },
  lockersV3: {
    '137': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon
      },
      {
        name: 'QuickSwap V2',
        basicName: 'QuickSwap',
        creationUrl: 'https://quickswap.exchange/#/pools/v2',
        icon: QuickSwapIcon
      },
    ],
    '56': [
      {
        name: 'Uniswap V3',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
      {
        name: 'PancakeSwap V3',
        basicName: 'PancakeSwap',
        creationUrl: 'https://pancakeswap.finance/liquidity',
        icon: PancakeSwapIcon
      },
    ],
    '1': [
      {
        name: 'Uniswap V3',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
      {
        name: 'SushiSwap V2',
        basicName: 'SushiSwap',
        creationUrl: 'https://www.sushi.com/pool/add/v2/1',
        icon: SushiSwapIcon
      },
    ],
    '11155111': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
    ],
    '10': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
    ],
    '42161': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon
      },
      {
        name: 'SushiSwap V2',
        basicName: 'SushiSwap',
        creationUrl: 'https://www.sushi.com/pool/add/v2/42161',
        icon: SushiSwapIcon
      },
      {
        name: 'Camelot V2',
        basicName: 'Camelot',
        creationUrl: 'https://app.camelot.exchange/liquidity',
        icon: CamelotIcon
      },
    ],
    '43114': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon

      },
      {
        name: 'TraderJoe V1',
        basicName: 'TraderJoe',
        creationUrl: 'https://traderjoexyz.com/avalanche/pool/v1/create',
        icon: TraderJoeIcon
      },
    ],
    '8453': [
      {
        name: 'Uniswap V2',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon
      },
      {
        name: 'SushiSwap V2',
        basicName: 'SushiSwap',
        creationUrl: 'https://www.sushi.com/pool/add/v2/8453',
        icon: SushiSwapIcon
      },
      {
        name: 'Aerodrome V3',
        basicName: 'Aerodrome',
        creationUrl: 'https://app.aerodrome.xyz/add/v3/ETH',
        icon: AerodromeIcon
      },
    ],
    '8822': [
      {
        name: 'MagicSea V2',
        basicName: 'MagicSea',
        creationUrl: 'https://app.magicsea.finance/liquidityv3',
        icon: MagicSeaIcon
      },
    ],
    '40': [
      {
        name: 'VaporDEX V2',
        basicName: 'VaporDEX',
        creationUrl: 'https://www.vapordex.io/liquidity',
        icon: VaporDEXIcon
      },
    ],
    '1329': [
      {
        name: 'Uniswap V2',
        basicName: 'DragonSwap V1',
        creationUrl: 'https://dragonswap.app/swap',
        icon: DragonSwapIcon
      },
    ],
    '130': [
      {
        name: 'Uniswap V4',
        basicName: 'Uniswap',
        creationUrl: 'https://app.uniswap.org/add/v2/ETH',
        icon: UniswapIcon
      },
    ],
  },
}

type LockerMap = {
  [key: string]: `0x${string}`
}

export const chainFactoryLockerMap: {
  'lockers-v2': LockerMap
  'lockers-v2_1': LockerMap
  'lockers-v3': LockerMap
  'lockers-v3_2': LockerMap
  'lockers-v3_3': LockerMap
} = {
  'lockers-v2': {
    // Uniswap v2
    '1-0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f': '0x663a5c229c09b049e36dcc11a9b0d4a8eb9db214',
    // Sushiswap
    '1-0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac': '0xed9180976c2a4742c7a57354fd39d8bec6cbd8ab',
    // Pancakeswap v1
    '56-0xbcfccbde45ce874adcb698cc183debcf17952812': '0xc8b839b9226965caf1d9fc1551588aaf553a7be6',
    // Pancakeswap v2
    '56-0xca143ce32fe78f1f7019d7d551a6402fc5350c73': '0xc765bddb93b0d1c1a88282ba0fa6b2d00e3e0c83',
    // Julswap
    '56-0x553990f2cba90272390f62c5bdb1681ffc899675': '0x1f23742d882ace96bace4658e0947cccc07b6a75',
    // Quickswap
    '137-0x5757371414417b8c6caad45baef941abc7d3ab32': '0xadb2437e6f65682b85f814fbc12fec0508a7b1d0',
    // Dragonswap v1 SEI - TODO arnau review what to do with this. Update: the locker program is v2_1 actually
    // '1329-0x71f6b49ae1558357bbb5a6074f1143c46cbca03d': '0xad2071a3021a118a92e95328a6d12bee0e1c5d8d',
    /* // Uniswap v2
    '130-0x1f98400000000000000000000000000000000002': '0x6a76da1eB2cBe8b0D52cFe122C4B7f0cA5a940eF' */
  },
  'lockers-v2_1': {
    '1-0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f': '0x59d7d55ddc58494fbbbca29904f108ece82ac7fb',
    // uniswap v2 optimism
    '10-0x0c3c1c532f1e39edf36be9fe0be1410313e074bf': '0x5923c3911d9424f7725cad33ed176a6b885484d6',

    // uniswap v2 sepolia
    '1115511-0xf62c03e08ada871a0beb309762e260a7a6a880e6':
      '0x3075530a0524c2caeb80ac44a2cbad15c82eb946',

    // Biswap
    '56-0x858e3312ed3a876947ea49d572a7c42de08af7ee': '0x74dee1a3e2b83e1d1f144af2b741bbaffd7305e1',
    // Safeswap
    '56-0x86a859773cf6df9c8117f20b0b950ada84e7644d': '0x1391b48c996ba2f4f38aee07e369a8f28d38220e',

    // Uniswap v2 (BNB Chain) (2.1)
    '56-0x8909dc15e40173ff4699343b6eb8132c65e18ec6': '0x7229247bd5cf29fa9b0764aa1568732be024084b',
    // Uniswap V2 (Avalanche) (v2.1)
    '43114-0x9e5a52f57b3038f1b8eee45f28b3c1967e22799c':
      '0x07dd74c2df2bc4eb04cf8edb2f695aa79ba590eb',
    // TraderJoe
    '43114-0x9ad6c38be94206ca50bb0d90783181662f0cfa10':
      '0xa9f6aefa5d56db1205f36c34e6482a6d4979b3bb',
    // Uniswap V2 (Polygon) (v2.1)
    '137-0x9e5a52f57b3038f1b8eee45f28b3c1967e22799c': '0x939d71ade0bf94d3f8cf578413bf2a2f248bf58b',

    // Uniswap V2 Arb
    '42161-0xf1d7cc64fb4452f05c498126312ebe29f30fbcf9':
      '0x63f4b2c082b1e0bba38874567e053800379bf8d7',
    // Sushiswap
    '42161-0xc35dadb65012ec5796536bd9864ed8773abc74c4':
      '0x275720567e5955f5f2d53a7a1ab8a0fc643de50e',
    // Camelot
    '42161-0x6eccab422d763ac031210895c81787e87b43a652':
      '0xa71182392faaa9a123a9e8120e79515117f05be4',
    // Sushiswap V2 Base
    '8453-0x71524b4f93c58fcbf659783284e38825f0622859': '0xbeddf48499788607b4c2e704e9099561ab38aae8',
    // Uniswap V2 Base
    '8453-0x8909dc15e40173ff4699343b6eb8132c65e18ec6': '0xc4e637d37113192f4f1f060daebd7758de7f4131',
    // Uniswap v2 Goerli
    '5-0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f': '0x95cbf2267ddd3448a1a1ed5df9da2761af02202e',
    // MagicSea v2 IOTA
    '8822-0x349aaac3a500014981cba11b64c76c66a6c1e8d0': '0x7f5c649856f900d15c83741f45ae46f5c6858234',
    //  VaporDEX V2 TELOS
    '40-0xdef9ee39fd82ee57a1b789bc877e2cbd88fd5cae': '0x08655a59381ea4febf210d609d52c0f2ac47b8d1',
    // Dragonswap v1 SEI - TODO arnau review what to do with this
    '1329-0x71f6b49ae1558357bbb5a6074f1143c46cbca03d': '0xad2071a3021a118a92e95328a6d12bee0e1c5d8d',
    // Uniswap v2
    '130-0x1f98400000000000000000000000000000000002': '0x6a76da1eB2cBe8b0D52cFe122C4B7f0cA5a940eF'
  },
  'lockers-v3': {
    '1-0xc36442b4a4522e871399cd717abdd847ab11fe88': '0x231278edd38b00b07fbd52120cef685b9baebcc1',
  },
  'lockers-v3_2': {
    '1-0xc36442b4a4522e871399cd717abdd847ab11fe88': '0x7f5c649856f900d15c83741f45ae46f5c6858234',
  },
  'lockers-v3_3': {
    '1-0xc36442b4a4522e871399cd717abdd847ab11fe88': '0xfd235968e65b0990584585763f837a5b5330e6de',
  },
}

export const lockerFactoryMap: {
  [key: string]: {
    factory: `0x${string}`
    shorthand: string
    fullName: string
  }
} = {
  // Some old contracts have newer locker version deployments.

  // Uniswap v2
  '1-0x663a5c229c09b049e36dcc11a9b0d4a8eb9db214': {
    factory: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    shorthand: 'Uni-v2',
    fullName: 'Uniswap V2',
  },

  // Uniswap v2 (2.1)
  '1-0x59d7d55ddc58494fbbbca29904f108ece82ac7fb': {
    factory: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    shorthand: 'Uni-v2',
    fullName: 'Uniswap V2',
  },
  '1115511-0x3075530a0524c2caeb80ac44a2cbad15c82eb946': {
    factory: '0xf62c03e08ada871a0beb309762e260a7a6a880e6',
    shorthand: 'Uni-v2',
    fullName: 'Uniswap V2',
  },
  // Uniswap v2 (2.1) (Arb)
  '42161-0x63f4b2c082b1e0bba38874567e053800379bf8d7': {
    factory: '0xf1d7cc64fb4452f05c498126312ebe29f30fbcf9',
    shorthand: 'Uni-v2',
    fullName: 'Uniswap V2',
  },

  // Sushiswap
  '1-0xed9180976c2a4742c7a57354fd39d8bec6cbd8ab': {
    factory: '0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac',
    shorthand: 'Sushi-v2',
    fullName: 'SushiSwap V2',
  },
  '10-0x5923c3911d9424f7725cad33ed176a6b885484d6': {
    factory: '0x0c3c1c532f1e39edf36be9fe0be1410313e074bf',
    shorthand: 'Uni-v2',
    fullName: 'Uniswap V2',
  },

  // Pancakeswap v1
  '56-0xc8b839b9226965caf1d9fc1551588aaf553a7be6': {
    factory: '0xbcfccbde45ce874adcb698cc183debcf17952812',
    shorthand: 'PCS-v1',
    fullName: 'PancakeSwap V1',
  },
  // Uniswap v2 (BNB Chain) (2.1)
  '56-0x7229247bd5cf29fa9b0764aa1568732be024084b': {
    factory: '0x8909dc15e40173ff4699343b6eb8132c65e18ec6',
    shorthand: 'Uni-v2',
    fullName: 'Uniswap V2',
  },

  // Uniswap v2 (2.1)
  // Pancakeswap v2
  '56-0xc765bddb93b0d1c1a88282ba0fa6b2d00e3e0c83': {
    factory: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
    shorthand: 'PCS-v2',
    fullName: 'PancakeSwap V2',
  },
  // Biswap
  '56-0x74dee1a3e2b83e1d1f144af2b741bbaffd7305e1': {
    factory: '0x858e3312ed3a876947ea49d572a7c42de08af7ee',
    shorthand: 'BiSwap',
    fullName: 'BiSwap V2',
  },
  // Julswap
  '56-0x1f23742d882ace96bace4658e0947cccc07b6a75': {
    factory: '0x553990f2cba90272390f62c5bdb1681ffc899675',
    shorthand: 'Jul',
    fullName: 'Julswap V2',
  },
  // Quickswap
  '137-0xadb2437e6f65682b85f814fbc12fec0508a7b1d0': {
    factory: '0x5757371414417b8c6caad45baef941abc7d3ab32',
    shorthand: 'QuickSwap',
    fullName: 'QuickSwap V2',
  },
  // Uniswap V2 (Polygon) (v2.1)
  '137-0x939d71ade0bf94d3f8cf578413bf2a2f248bf58b': {
    factory: '0x9e5a52f57b3038f1b8eee45f28b3c1967e22799c',
    shorthand: 'Uni-v2',
    fullName: 'Uniswap V2',
  },
  // Uniswap V2 (Avalanche) (v2.1)
  '43114-0x07dd74c2df2bc4eb04cf8edb2f695aa79ba590eb': {
    factory: '0x9e5a52f57b3038f1b8eee45f28b3c1967e22799c',
    shorthand: 'Uni-v2',
    fullName: 'Uniswap V2',
  },
  // TraderJoe
  '43114-0xa9f6aefa5d56db1205f36c34e6482a6d4979b3bb': {
    factory: '0x9ad6c38be94206ca50bb0d90783181662f0cfa10',
    shorthand: 'Trader Joe',
    fullName: 'Trader Joe V2',
  },
  // Sushiswap
  '42161-0x275720567e5955f5f2d53a7a1ab8a0fc643de50e': {
    factory: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
    shorthand: 'Sushi-v2',
    fullName: 'SushiSwap V2',
  },
  // Camelot
  '42161-0xa71182392faaa9a123a9e8120e79515117f05be4': {
    factory: '0x6eccab422d763ac031210895c81787e87b43a652',
    shorthand: 'Camelot',
    fullName: 'Camelot V2',
  },
  // Uniswap v2 Goerli
  '5-0x95cbf2267ddd3448a1a1ed5df9da2761af02202e': {
    factory: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    shorthand: 'Uni-v2 Goerli',
    fullName: 'Uniswap V2',
  },
  // Sushi v2 Base
  '8453-0xbeddf48499788607b4c2e704e9099561ab38aae8': {
    factory: '0x71524b4f93c58fcbf659783284e38825f0622859',
    shorthand: 'Sushi-v2 Base',
    fullName: 'SushiSwap V2',
  },
  // Uniswap v2 Base
  '8453-0xc4e637d37113192f4f1f060daebd7758de7f4131': {
    factory: '0x8909dc15e40173ff4699343b6eb8132c65e18ec6',
    shorthand: 'Uni-v2 Base',
    fullName: 'Uniswap V2',
  },
  // Aerodrome v2 Base
  '8453-0x30e522dedffe3e3d11cd53e27d18cd4f016ed870': {
    factory: '0x8909dc15e40173ff4699343b6eb8132c65e18ec6',
    shorthand: 'Aerodrome-v2 Base',
    fullName: 'Aerodrome V2',
  },
  // MagicSea v2 IOTA
  '8822-0x7f5c649856f900d15c83741f45ae46f5c6858234': {
    factory: '0x349aaac3a500014981cba11b64c76c66a6c1e8d0',
    shorthand: 'MagicSea-LP',
    fullName: 'MagicSea V2',
  },
  //  VaporDEX V2 TELOS
  '40-0x08655a59381ea4febf210d609d52c0f2ac47b8d1': {
    factory: '0xdef9ee39fd82ee57a1b789bc877e2cbd88fd5cae',
    shorthand: 'VaporDEX',
    fullName: 'VaporDEX V2',
  },
  '1329-0xad2071a3021a118a92e95328a6d12bee0e1c5d8d': {
    factory: '0x71f6b49ae1558357bbb5a6074f1143c46cbca03d',
    shorthand: 'DragonSwap',
    fullName: 'DragonSwap V1',
  },
  // Uniswap V2 (UNICHAIN) 
  '130-0x6a76da1eb2cbe8b0d52cfe122c4b7f0ca5a940ef': {
    factory: '0x1f98400000000000000000000000000000000002',
    shorthand: 'Uni-v2',
    fullName: 'Uniswap V2',
  },

}

export const chainVestingMapper: {
  [key: number]: string
} = {
  1: '0xDba68f07d1b7Ca219f78ae8582C213d975c25cAf', // Ethereum Mainnet
  5: '0xDffCa4B8c6DEfB2FC0fbc0a1B07D4ba34a2c1453', // Ethereum Goerli Testnet
  11155111: '0x3dFC191d2ff5008e11d878345daD88A0C005fCf0', // Ethereum Sepolia Testnet
  40: '0x4264BBE70C57d2Aa9B64762dFDE214219F088a86', // Telos Mainnet
  56: '0xeaEd594B5926A7D5FBBC61985390BaAf936a6b8d', // Binance Smart Chain Mainnet
  97: '0x95030cd8Ac389943B5E9e639c5Ca9e477B5142C7', // Binance Smart Chain Testnet
  100: '0x647586E6B815D2C4a2A30dA12931c69bAda541AB', // Gnosis (formerly xDai)
  10: '0x599886b24B0A625e4912033213d6b6188a1abCA2', // Optimism
  137: '0x2621816bE08E4279Cf881bc640bE4089BfAf491a', // Polygon Mainnet
  43114: '0xCa61C60D9Da18fA4e836a1e378Ded3205FcEdfA5', // Avalanche C-Chain
  42161: '0x8cb0300Af2A801DC9992225D45399ac56888cBcd', // Arbitrum One
  8453: '0xA82685520C463A752d5319E6616E4e5fd0215e33', // Base
  8822: '0x625e1b2e78dc5b978237f9c29de2910062d80a05', // IOTA,
  1329: '0xE104E1f2F3e4506Ff3adfF9eEfCf416C9f61748C', // SEI
}

interface PositionManagerDetails {
  ammExchange: string
  lockerAddress: string
}

export const positionManagers: Record<string, PositionManagerDetails> = {
  '1-0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
    ammExchange: 'Uniswap V3',
    lockerAddress: '0xFD235968e65B0990584585763f837A5b5330e6DE',
  },
  '10-0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
    ammExchange: 'Uniswap V3',
    lockerAddress: '0x1cE6d27F7e5494573684436d99574e8288eBBD2D',
  },
  '5-0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
    ammExchange: 'Uniswap V3',
    lockerAddress: '0xe5881319Aa21ca206A3307c76aE2F935E691361a',
  },
  '56-0x46A15B0b27311cedF172AB29E4f4766fbE7F4364': {
    ammExchange: 'PancakeSwap',
    lockerAddress: '0xfe88DAB083964C56429baa01F37eC2265AbF1557',
  },
  '56-0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613': {
    ammExchange: 'Uniswap V3',
    lockerAddress: '0xfe88DAB083964C56429baa01F37eC2265AbF1557',
  },
  '137-0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
    ammExchange: 'Uniswap V3',
    lockerAddress: '0x40f6301edb774e8B22ADC874f6cb17242BaEB8c4',
  },
  '42161-0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
    ammExchange: 'Uniswap V3',
    lockerAddress: '0x6b5360B419e0851b4b81644e0F63c1A9778f2506',
  },
  '8453-0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1': {
    ammExchange: 'Uniswap V3',
    lockerAddress: '0x231278eDd38B00B07fBd52120CEf685B9BaEBCC1',
  },
  '43114-0x655C406EBFa14EE2006250925e54ec43AD184f8B': {
    ammExchange: 'Uniswap V3',
    lockerAddress: '0x625e1b2e78DC5b978237f9c29DE2910062D80a05',
  },
  '11155111-0x1238536071E1c677A632429e3655c799b22cDA52': {
    ammExchange: 'Uniswap V3',
    lockerAddress: '0x6a976ECb2377E7CbB5B48913b0faA1D7446D4dC7',
  },
  '1329-0xa7FDcBe645d6b2B98639EbacbC347e2B575f6F70': {
    ammExchange: 'DragonSwap V2',
    lockerAddress: '0x7B21D8Db3Cec21FD0e88b08aBa0cd63EA15E708b',
  },
}

export let lockerContractsV3_3: Record<string, string> = {
  // ETH
  '1': '0xFD235968e65B0990584585763f837A5b5330e6DE',

  // 0xC36442b4a4522E871399CD717aBDD847Ab11FE88 uni

  // GOERLI
  '5': '0xe5881319Aa21ca206A3307c76aE2F935E691361a',

  // 0xC36442b4a4522E871399CD717aBDD847Ab11FE88 uni
  '10': '0x1cE6d27F7e5494573684436d99574e8288eBBD2D',

  // BSC
  '56': '0xfe88DAB083964C56429baa01F37eC2265AbF1557',

  // 0x46A15B0b27311cedF172AB29E4f4766fbE7F4364 pcs
  // 0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613 uni

  // POLYGON
  '137': '0x40f6301edb774e8B22ADC874f6cb17242BaEB8c4',

  // 0xC36442b4a4522E871399CD717aBDD847Ab11FE88 uni

  // ARB
  '42161': '0x6b5360B419e0851b4b81644e0F63c1A9778f2506',

  // 0xC36442b4a4522E871399CD717aBDD847Ab11FE88 uni

  // BASE
  '8453': '0x231278eDd38B00B07fBd52120CEf685B9BaEBCC1',

  // 0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1 uni

  // AVALANCHE
  '43114': '0x625e1b2e78DC5b978237f9c29DE2910062D80a05',

  // SEPOLIA
  '11155111': '0x6a976ECb2377E7CbB5B48913b0faA1D7446D4dC7',

  // UNICHAIN
  '130': '0xcb399F22b923f6ec9fe7be15A99DD2Df0a9822C8',
  // 0x655C406EBFa14EE2006250925e54ec43AD184f8B uni

  // SEI
  '1329': '0x7B21D8Db3Cec21FD0e88b08aBa0cd63EA15E708b',
}

export let convertorContracts: Record<string, string> = {
  // Ethereum
  '1': '0x07c1bDD98fb4498C418C8323F1d9EF514ab7A89C',
  // Arbitrum
  '42161': '0x2A29da11d024Ae40D99590a16ADbF6A83758Ee32',
  // Optimism
  '10': '0x625e1b2e78DC5b978237f9c29DE2910062D80a05',
  // Polygon
  '137': '0x7fcCF17620CE18c039eB3485628e5C50d2AE1CEC',
  // Base
  '8453': '0x80EbC53dAfb97415B54c7390b1F26d79c7aeDA23',
  // Binance Smart Chain
  '56': '0xf8EC48e0022F4b59F120579dbA3B472580C51066',
  // Avalanche
  '43114': '0x94Da79cFCAba608A1c86aca73F80918BEad4BC10',
  // Celo
  '42220': '0xC22218406983bF88BB634bb4Bf15fA4E0A1a8c84',
  // Sepolia
  '11155111': '0x1Cb26422CFc18827215ea6202d801d0F65Afd998',
  // SEI
  '1329': '0xf3d59296F827ECF31A510e32880394d6d52e139D',
  // UNICHAIN
  '130': '0xE97CF4F6A48ee9CE63c65340774773103F68F1E4'
}

export const lockerContractsV4: { [key: string]: string } = {
  '8453': '0x610b43e981960b45f818a71cd14c91d35cda8502', // Base chain
  '11155111': '0x6606b00eb636E1149cAcC7f8d3D23D1638b36481',
  '130': '0x52d6dbd7939e45094c1a3df563d9d8fc66943b91',
  '1': '0x30529ac67d5ac5f33a4e7fe533149a567451f023',
  '42161': '0x62d61d5695013a5aa29a628b83d91e240984b613',
  '56': '0x62d61d5695013a5aa29a628b83d91e240984b613',
  '137': '0x1ec811ad6039e33b86458cdb267667af083261ed',
}

// Before migration and bug-fix by pierre
export const lockerContractsV4_legacy: { [key: string]: string } = {
  '8453': '0x1ec811ad6039e33b86458cdb267667af083261ed', // Base chain
  '11155111': '0x6606b00eb636E1149cAcC7f8d3D23D1638b36481',
  '130': '0x6606b00eb636e1149cacc7f8d3d23d1638b36481',
  '1': '0x6a76da1eB2cBe8b0D52cFe122C4B7f0cA5a940eF',
}

// Aerodrome
export const lockerAerodrome: { [key: string]: string } = {
  'V2': '0x30e522deDfFE3e3d11Cd53E27d18Cd4F016eD870',
  'V3': '0xB403e68Eb5BffD7DF7AA127f5A819F77C2F96095'
}
export const factoryAddressAerodrome: { [key: string]: string } = {
  'V2': '0x420DD381b31aEf6683db6B902084cB0FFECe40Da',
  'V3': '0x5e7BB104d84c7CB9B682AaC2F3d509f5F406809A'
}
export const nftPositionManagerAerodromeV3 = "0x827922686190790b37229fd06084350e74485b72"

export function getNativeToken(chainId: string) {
  const chainIdToToken: any = {
    1: {
      symbol: 'ETH',
      decimals: 18,
    },
    5: {
      // goerli
      symbol: 'ETH',
      decimals: 18,
    },
    10: {
      // goerli
      symbol: 'ETH',
      decimals: 18,
    },
    130: {
      // uni
      symbol: 'ETH',
      decimals: 18,
    },
    11155111: {
      // goerli
      symbol: 'ETH',
      decimals: 18,
    },
    56: {
      symbol: 'BNB',
      decimals: 18,
    },
    40: {
      symbol: 'TLOS',
      decimals: 18,
    },
    97: {
      // bnb testnet
      symbol: 'BNB',
      decimals: 18,
    },
    100: {
      // gnosis
      symbol: 'GNO',
      decimals: 18,
    },
    137: {
      symbol: 'MATIC',
      decimals: 18,
    },
    8453: {
      symbol: 'ETH',
      decimals: 18,
    },
    42161: {
      symbol: 'ETH',
      decimals: 18,
    },
    43114: {
      symbol: 'AVAX',
      decimals: 18,
    },
    8822: {
      symbol: 'IOTA',
      decimals: 18,
    },
    1329: {
      symbol: 'SEI',
      decimals: 18,
    },
  }

  return chainIdToToken[chainId]
}

export let nftPositionManagers: any = {
  '1': {
    // ETH mainnet
    '0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },

  '10': {
    // ETH mainnet
    '0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },

  '5': {
    // Goerli
    '0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },

  '56': {
    // BSC
    '0x7b8A01B39D58278b5DE7e48c8449c9f4F5170613': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
    '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364': {
      name: 'Pancakeswap V3',
      getPoolLink: (nftId: any) => {
        return `https://pancakeswap.finance/liquidity/${nftId}`
      },
      addLiquidity: 'https://pancakeswap.finance/add/BNB',
    },
  },

  '137': {
    // Polygon
    '0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },

  '8453': {
    // Base
    '0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
    '0x827922686190790b37229fd06084350E74485b72': {
      name: 'Aerodrome V3',
      getPoolLink: (nftId: any) => {
        return `https://app.aerodrome.xyz/pool/${nftId}`
      },
      addLiquidity: 'https://app.aerodrome.xyz/add/ETH',
    },
  },

  '42161': {
    // Arbitrum
    '0xC36442b4a4522E871399CD717aBDD847Ab11FE88': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },

  '43114': {
    // Avalanche
    '0x655C406EBFa14EE2006250925e54ec43AD184f8B': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },

  '11155111': {
    // Sepolia
    '0x1238536071E1c677A632429e3655c799b22cDA52': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },
  '130': {
    // UNICHAIN
    '0x943e6e07a7E8E791dAFC44083e54041D743C46E9': {
      name: 'Uniswap V3',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH'
    },
  },
  '1329': {
    // SEI
    '0xa7FDcBe645d6b2B98639EbacbC347e2B575f6F70': {
      name: 'DragonSwap V2',
      getPoolLink: (nftId: any) => {
        // TODO arnau - in dragonswap doesnt seem to have a NFT view page https://dragonswap.app/pools/0x882f62fe8e9594470d1da0f70bc85096f6c60423?positions=all&tab=manage
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
    },
  },
}

export let nftPositionManagersV4: any = {
  // Ethereum Mainnet
  '1': {
    '0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e': {
      name: 'Uniswap V4',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },

  // Base
  '8453': {
    '0x7c5f5a4bbd8fd63184577525326123b519429bdc': {
      name: 'Uniswap V4',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },

  // Arbitrum
  '42161': {
    '0x1b35d13a2e2528f192637f14b05f0dc0e7deb566': {
      name: 'Uniswap V4',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },

  // Polygon
  '137': {
    '0x1ec2ebf4f37e7363fdfe3551602425af0b3ceef9': {
      name: 'Uniswap V4',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/MATIC',
    },
  },

  // Avalanche
  '43114': {
    '0xb74b1f14d2754acfcbbe1a221023a5cf50ab8acd': {
      name: 'Uniswap V4',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/AVAX',
    },
  },

  // Sepolia Testnet
  '11155111': {
    '0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4': {
      name: 'Uniswap V4',
      getPoolLink: (nftId: any) => {
        return `https://app.uniswap.org/#/pools/${nftId}`
      },
      addLiquidity: 'https://app.uniswap.org/#/add/ETH',
    },
  },
}

// ... existing code ...

// helper functions

// export function calendarDateTimeToTimestamp(calendarDateTime: CalendarDateTime): number {
//   // Assuming calendarDateTime includes properties like year, month, day, etc.
//   // and a toString() method that returns an ISO 8601 string representation including the time zone.
//   const date = new Date(calendarDateTime.toString());
//   return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
// }

// export function timestampToCalendarDateTime(timestamp: number): CalendarDateTime {
//   const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
//   // Create a CalendarDateTime object. This example assumes the Gregorian calendar.
//   // You may need to adjust this based on how your CalendarDateTime constructor expects arguments.
//   return new CalendarDateTime(
//     date.getFullYear(),    // Local year
//     date.getMonth() + 1,   // Local month (JavaScript months are 0-indexed)
//     date.getDate(),        // Local day
//     date.getHours(),       // Local hour
//     date.getMinutes(),     // Local minute
//     date.getSeconds()      // Local second
//   );
// }

export function sanitizeAmount({
  amount,
  max,
  decimals,
  onField,
}: {
  amount: string
  onField: string
  max?: string
  decimals?: number
}) {
  // remove 0s in front
  // let dezerofiedAmount = (amount == '') ? '' : amount
  // let sanitisedInput = Number(amount).toString().replace(/[^\d.-]/g, '')
  // let error = ''

  // TODO FORCED OPTIONAL UNWRAP
  let decimalsPayloadAmount = amount.includes('.') ? amount.split('.').pop()!.length : 0

  if (amount.split('.').length - 1 > 1) {
    return {
      sanitisedAmount: amount,
      error: `Invalid ${onField} value`,
    }
  } else if (max && decimals && parseUnits(amount, decimals) > parseUnits(max, decimals)) {
    return {
      sanitisedAmount: amount,
      error: `Entered ${onField} amount exceeds your balance`,
    }
  } else if (decimals && decimalsPayloadAmount > decimals) {
    return {
      sanitisedAmount: amount,
      error: `Entered ${onField} amount exceeds the decimal count`,
    }
  }

  return {
    sanitisedAmount: amount,
    error: '',
  }
}

export function sanitizeAddress({ address, onField }: { address: string; onField: string }) {
  // Convert the address to lowercase (or you could choose to use checksum validation here instead)
  let addressSanitised = address.toLowerCase()

  let errorMessage = ''

  let fieldName = onField.toLowerCase()
  const addressWithoutPrefix = address.slice(2)

  if (address == '') {
    // errorMessage = ""
    return {
      sanitisedAddress: '',
      error: `${capitalizeFirstLetter(fieldName)} is empty`,
    }
  } else if (!address.startsWith('0x') && address.length > 1) {
    errorMessage = `${capitalizeFirstLetter(fieldName)} address must start with 0x`

    return {
      sanitisedAddress: addressSanitised,
      error: errorMessage,
    }
  } else if (
    // Check if all characters after '0x' are hexadecimal
    !/^[0-9a-fA-F]+$/.test(addressWithoutPrefix) &&
    address.length > 2
  ) {
    errorMessage = `Non hexadecimal ${fieldName} address`

    return {
      sanitisedAddress: addressSanitised,
      error: errorMessage,
    }
  } else if (address.length !== 42) {
    errorMessage = `Enter a valid ${fieldName} address length`

    return {
      sanitisedAddress: addressSanitised,
      error: errorMessage,
    }
  } else {
    errorMessage = ''
  }

  return {
    sanitisedAddress: addressSanitised,
    error: errorMessage,
  }
}

export function capitalizeFirstLetter(string: string): string {
  if (!string) return string // return the original stringing if it's empty
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getValuesStartingWith(
  map: {
    [key: string]: `0x${string}`
  },
  prefix: string
): string[] {
  return Object.entries(map)
    .filter(([key, _]) => key.startsWith(prefix))
    .map(([_, value]) => value)
}

export const now: DateTime = DateTime.local()

export const hours = now.hour
export const minutes = now.minute

// hours, minutes

// const nowTimeZoned = now('UTC')
export const nowTime = new Time(hours, minutes)
// const nowDate = today(getLocalTimeZone())

export const yearDate = new CalendarDate(now.year + 1, now.month, now.day)

// current day / time initialisers
// const dateJS = new Date();
// timestamps require (month - 1)
export const nextYearDate = new Date(now.year + 1, now.month - 1, now.day)
export const todayDate = new Date(now.year, now.month - 1, now.day)
export const presetTimeInSeconds = nowTime.hour * 3600 + nowTime.minute * 60

export const nextYearTimestampSeconds = nextYearDate.getTime() / 1000
export const todayTimestampSeconds = todayDate.getTime() / 1000

export const timeNowPreset = new CalendarDateTime(
  now.year,
  now.month,
  now.day,
  nowTime.hour,
  nowTime.minute,
  nowTime.second
)
export const timeDayPreset = new CalendarDateTime(
  now.year,
  now.month,
  now.day,
  nowTime.hour,
  nowTime.minute,
  nowTime.second
).add({
  /** The number of hours to add or subtract. */
  days: 1,
})
export const timeMonthPreset = new CalendarDateTime(
  now.year,
  now.month,
  now.day,
  nowTime.hour,
  nowTime.minute,
  nowTime.second
).add({
  /** The number of hours to add or subtract. */
  months: 1,
})
export const timeYearPreset = new CalendarDateTime(
  now.year,
  now.month,
  now.day,
  nowTime.hour,
  nowTime.minute,
  nowTime.second
).add({
  /** The number of hours to add or subtract. */
  years: 1,
})
export const timeTenYearsPreset = new CalendarDateTime(
  now.year,
  now.month,
  now.day,
  nowTime.hour,
  nowTime.minute,
  nowTime.second
).add({
  /** The number of hours to add or subtract. */
  years: 10,
})
export const timeMaxPreset = new CalendarDateTime(
  now.year,
  now.month,
  now.day,
  nowTime.hour,
  nowTime.minute,
  nowTime.second
).add({
  /** The number of hours to add or subtract. */
  years: 256,
})

const jsDate = new Date(
  timeMaxPreset.year,
  timeMaxPreset.month,
  timeMaxPreset.day,
  timeMaxPreset.hour,
  timeMaxPreset.minute,
  timeMaxPreset.second
)

export const unixTimestamp256Year = Math.floor(jsDate.getTime() / 1000)

export const truncate = (fullStr: string, strLen: number, separator: string) => {
  if (fullStr.length <= strLen) return fullStr

  separator = separator || '&hellip;'

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2)

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars)
}

export function tm(unix_tm: number) {
  var dt = new Date(unix_tm * 1000).toUTCString()
  return dt
}

// export function getFormattedDate(time: number, language: string) {
//   const date = new Date(time)
//   const day = localisation.weekdays[language][date.getDay()]
//   const dayOfTheMonth = (date.getDate() < 10 ? '0' : '') + date.getDate()
//   const month = localisation.monthNames[language][date.getMonth()]
//   // const month = (adjustMonth<10?'0':'') + adjustMonth
//   // const year = (date.getFullYear()<10?'0':'') + date.getFullYear()

//   var h = (date.getHours() < 10 ? '0' : '') + date.getHours()
//   var m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()

//   if (language == 'ch') {
//     return `${date.getMonth()}${localisation['month'][language]}${date.getDay()}${localisation['day'][language]
//       } (${day}) ${h}:${m}`
//   } else {
//     return `${day} ${dayOfTheMonth} ${month} ${h}:${m}`
//   }
// }

export function secondsToDhms(secs: string, language: string) {
  const seconds = Number(secs)
  var years = Math.floor(seconds / (3600 * 24))
  var months = Math.floor(seconds / (3600 * 24))

  var d = Math.floor(seconds / (3600 * 24))
  var h = Math.floor((seconds % (3600 * 24)) / 3600)
  var m = Math.floor((seconds % 3600) / 60)
  var s = Math.floor(seconds % 60)

  if (d > 0) return d + (d == 1 ? ' day ' : ' days ')
  if (h > 0) return h + (h == 1 ? ' hour ' : ' hours ')
  if (m > 0) return m + (m == 1 ? ' minute ' : ' minutes ')
  if (s > 0) return s + (s == 1 ? ' second' : ' seconds ')
  return ''
}

// var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
//     var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
//     var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
//     var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
//     return (dDisplay + hDisplay).replace(/,\s*$/, "");

export function numberFormatter(num: number, digits: number) {
  // TODO: find chinese version
  var si = [
    { value: 1e18, symbol: 'Qi' },
    { value: 1e15, symbol: 'Qa' },
    { value: 1e12, symbol: 'T' },
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' },
  ],
    i
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (
        (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
      )
    }
  }
  return num.toString()
}

export async function getBlockTime(w3: any): Promise<any> {
  try {
    const blockDiff = 1000
    const blockNumber = await w3.eth.getBlockNumber()
    let currentBlock = await w3.eth.getBlock(blockNumber)
    let currentTimestamp = currentBlock['timestamp']
    let historicBlock = await w3.eth.getBlock(blockNumber - blockDiff)
    let historicTimestamp = historicBlock['timestamp']

    const diff = currentTimestamp - historicTimestamp
    return diff / blockDiff
  } catch (e) {
    return getBlockTime(w3)
  }
}

// export function timeCalculator(seconds: number, language: string) {
//   let y = Math.floor(seconds / 31536000)
//   let mo = Math.floor((seconds % 31536000) / 2628000)
//   let d = Math.floor(((seconds % 31536000) % 2628000) / 86400)
//   let h = Math.floor((seconds % (3600 * 24)) / 3600)
//   let m = Math.floor((seconds % 3600) / 60)
//   let s = Math.floor(seconds % 60)

//   if (y > 0) return y + (y === 1 ? localisation['year'][language] : localisation['years'][language])
//   if (mo > 0)
//     return mo + (mo === 1 ? localisation['month'][language] : localisation['months'][language])
//   if (d > 0) return d + (d === 1 ? localisation['day'][language] : localisation['days'][language])
//   if (h > 0) return h + (h === 1 ? localisation['hour'][language] : localisation['hours'][language])
//   if (m > 0)
//     return m + (m === 1 ? localisation['minute'][language] : localisation['minutes'][language])
//   if (s > 0)
//     return s + (s === 1 ? localisation['second'][language] : localisation['seconds'][language])
//   return ''
// }

export function getDecimalSupply(args: { supply: bigint; decimals: number }): string {
  const result = formatUnits(args.supply, args.decimals)

  return result
}

export const formatNumberString = (str: string) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(parseFloat(str))
}

export function getRelativeTime(targetTimestamp: number): string {
  const now: DateTime = DateTime.utc()
  const targetDate: DateTime = DateTime.fromSeconds(targetTimestamp, { zone: 'utc' })

  if (targetDate < now) {
    return 'in the past'
  }

  let diff: Duration = targetDate.diff(now, ['months', 'days', 'hours', 'minutes', 'seconds'])

  // Convert excess days to months more accurately
  const totalMonths = diff.months + Math.floor(diff.days / 30.44) // Using average days in a month
  const remainingDays = Math.round(diff.days % 30.44)

  const units: Array<[string, number]> = [
    ['month', totalMonths],
    ['day', remainingDays],
    ['hour', Math.floor(diff.hours)],
    ['minute', Math.floor(diff.minutes)],
    ['second', Math.round(diff.seconds)],
  ]

  const nonZeroUnits = units.filter(([, value]) => value > 0)

  if (nonZeroUnits.length >= 2) {
    return nonZeroUnits
      .slice(0, 2)
      .map(([unit, value]) => `${value} ${unit}${value !== 1 ? 's' : ''}`)
      .join(' and ')
  }

  if (nonZeroUnits.length === 1) {
    const [unit, value] = nonZeroUnits[0]
    return `${value} ${unit}${value !== 1 ? 's' : ''}`
  }

  return 'just now'
}

export const fractionSupply = (balance: `${number}`, decimals: number, fraction: number) => {
  let wholeSupply = parseUnits(balance, decimals)
  let fractionedSupply = fraction < 4 ? (wholeSupply / 4n) * BigInt(fraction) : wholeSupply
  let decimalSupply = formatUnits(fractionedSupply, decimals)
  return decimalSupply
}

export const wholeFractionSupply = (balance: bigint, decimals: number, fraction: number) => {
  // let wholeSupply = ethers.utils.parseUnits(balance, decimals)
  let fractionedSupply = fraction < 4 ? (balance / BigInt(4)) * BigInt(fraction) : balance
  let decimalSupply = formatUnits(fractionedSupply, decimals)
  return decimalSupply
}

export function timeDifference(timestamp: number): string {
  const now: Date = new Date()
  const targetDate: Date = new Date(timestamp)
  const isFuture: boolean = targetDate.getTime() > now.getTime()
  const seconds: number = Math.abs(Math.floor((targetDate.getTime() - now.getTime()) / 1000))
  const minutes: number = Math.floor(seconds / 60)
  const hours: number = Math.floor(minutes / 60)
  const days: number = Math.floor(hours / 24)

  // Calculate months using average days per month
  const totalMonths: number = Math.floor(days / 30.44)

  // Convert months to years and remaining months
  const years: number = Math.floor(totalMonths / 12)
  const months: number = totalMonths % 12

  if (years > 0) {
    if (months > 0) {
      return isFuture
        ? `in ${years} ${years === 1 ? 'year' : 'years'} and ${months} ${months === 1 ? 'month' : 'months'}`
        : `${years} ${years === 1 ? 'year' : 'years'} and ${months} ${months === 1 ? 'month' : 'months'} ago`
    } else {
      return isFuture
        ? `in ${years} ${years === 1 ? 'year' : 'years'}`
        : `${years} ${years === 1 ? 'year' : 'years'} ago`
    }
  } else if (months > 0) {
    return isFuture
      ? `in ${months} ${months === 1 ? 'month' : 'months'}`
      : `${months} ${months === 1 ? 'month' : 'months'} ago`
  } else if (days > 0) {
    return isFuture
      ? `in ${days} ${days === 1 ? 'day' : 'days'}`
      : `${days} ${days === 1 ? 'day' : 'days'} ago`
  } else if (hours > 0) {
    return isFuture
      ? `in ${hours} ${hours === 1 ? 'hour' : 'hours'}`
      : `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (minutes > 0) {
    return isFuture
      ? `in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
      : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return isFuture
      ? `in ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
      : `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`
  }
}

export function timeDifferenceSimple(timestamp: number): string {
  const now: Date = new Date()
  const targetDate: Date = new Date(timestamp)
  const isFuture: boolean = targetDate.getTime() > now.getTime()
  const seconds: number = Math.abs(Math.floor((targetDate.getTime() - now.getTime()) / 1000))
  const minutes: number = Math.floor(seconds / 60)
  const hours: number = Math.floor(minutes / 60)
  const days: number = Math.floor(hours / 24)

  // Calculate months using average days per month
  const totalMonths: number = Math.floor(days / 30.44)

  // Convert months to years and remaining months
  const years: number = Math.floor(totalMonths / 12)
  const months: number = totalMonths % 12

  if (years > 0) {
    if (months > 0) {
      return isFuture
        ? `${years} ${years === 1 ? 'year' : 'years'} and ${months} ${months === 1 ? 'month' : 'months'}`
        : `${years} ${years === 1 ? 'year' : 'years'} and ${months} ${months === 1 ? 'month' : 'months'} ago`
    } else {
      return isFuture
        ? `${years} ${years === 1 ? 'year' : 'years'}`
        : `${years} ${years === 1 ? 'year' : 'years'} ago`
    }
  } else if (months > 0) {
    return isFuture
      ? `${months} ${months === 1 ? 'month' : 'months'}`
      : `${months} ${months === 1 ? 'month' : 'months'} ago`
  } else if (days > 0) {
    return isFuture
      ? `${days} ${days === 1 ? 'day' : 'days'}`
      : `${days} ${days === 1 ? 'day' : 'days'} ago`
  } else if (hours > 0) {
    return isFuture
      ? `${hours} ${hours === 1 ? 'hour' : 'hours'}`
      : `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (minutes > 0) {
    return isFuture
      ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
      : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return isFuture
      ? `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
      : `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`
  }
}

export function numberWithSuffix(num: string | number): string {
  let inputNumber: number = typeof num === 'string' ? parseFloat(num) : num
  let result: string

  // if (isNaN(inputNumber)) {
  //     throw new Error("Invalid input. The provided value cannot be converted to a number.");
  // }

  if (inputNumber >= 1000000000) {
    result = (Math.round((inputNumber / 1000000000) * 100) / 100).toFixed(2) + 'B'
  } else if (inputNumber >= 1000000) {
    result = (Math.round((inputNumber / 1000000) * 100) / 100).toFixed(2) + 'M'
  } else {
    result = inputNumber.toFixed(2)
  }

  return result
}

export function truncateDecimal(input: number) {
  let str = input.toString()
  let decimalPos = str.indexOf('.')

  if (decimalPos === -1) {
    return input // return the input as is if there's no decimal point
  }

  let nonZeroDecimalPos = str.slice(decimalPos).search(/[^0\.]/)

  if (nonZeroDecimalPos === -1) {
    return input // return the input as is if there's no non-zero digit after the decimal point
  }

  return parseFloat(str.slice(0, decimalPos + nonZeroDecimalPos + 1))
}

// export function mulDiv(a: bigint, b: bigint, denominator: bigint): bigint {
//   // 512-bit multiply [prod1 prod0] = a * b
//   let prod0 = a * b;  // Least significant 256 bits of the product
//   let prod1 = (a * b) / BigInt(2 ** 256); // Most significant 256 bits of the product

//   // Handle non-overflow cases, 256 by 256 division
//   if (prod1 === BigInt(0)) {
//     if (denominator === BigInt(0)) throw new Error("Division by zero");
//     return prod0 / denominator;
//   }

//   // Make sure the result is less than 2**256 and denominator isn't zero
//   if (denominator <= prod1) throw new Error("Invalid denominator, result must be less than 2**256");
//   if (denominator === BigInt(0)) throw new Error("Division by zero");

//   // Make division exact by subtracting the remainder from [prod1 prod0]
//   let remainder = (a * b) % denominator;

//   // Subtract 256 bit number from 512 bit number
//   if (remainder > prod0) {
//     prod1 -= BigInt(1);
//     prod0 -= remainder;
//   } else {
//     prod0 -= remainder;
//   }

//   // Factor powers of two out of denominator
//   let twos = (BigInt(2 ** 256) - denominator + BigInt(1)) & denominator;

//   // Divide denominator by power of two
//   denominator /= twos;

//   // Divide [prod1 prod0] by the factors of two
//   prod0 /= twos;

//   // Shift in bits from prod1 into prod0. For this we need to flip `twos`
//   twos = BigInt(2 ** 256) / twos + BigInt(1);
//   prod0 |= prod1 * twos;

//   // Invert denominator mod 2**256 using the Newton-Raphson iteration
//   let inv = (BigInt(3) * denominator) ^ BigInt(2);
//   inv *= BigInt(2) - denominator * inv; // inverse mod 2**8
//   inv *= BigInt(2) - denominator * inv; // inverse mod 2**16
//   inv *= BigInt(2) - denominator * inv; // inverse mod 2**32
//   inv *= BigInt(2) - denominator * inv; // inverse mod 2**64
//   inv *= BigInt(2) - denominator * inv; // inverse mod 2**128
//   inv *= BigInt(2) - denominator * inv; // inverse mod 2**256

//   // Multiply with the modular inverse of denominator to get the result
//   return prod0 * inv;
// }

const UINT256_SIZE = 2n ** 256n
const UINT256_MAX = UINT256_SIZE - 1n

function require(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || 'Requirement failed')
  }
}

function mul(a: bigint, b: bigint): bigint {
  return (a * b) % UINT256_SIZE
}

function mulmod(a: bigint, b: bigint, m: bigint): bigint {
  return (a * b) % m
}

function div(a: bigint, b: bigint): bigint {
  return a / b
}

function add(a: bigint, b: bigint): bigint {
  return (a + b) % UINT256_SIZE
}

function sub(a: bigint, b: bigint): bigint {
  return (a - b + UINT256_SIZE) % UINT256_SIZE
}

function lt(a: bigint, b: bigint): boolean {
  return a < b
}

function gt(a: bigint, b: bigint): boolean {
  return a > b
}

function not(x: bigint): bigint {
  return ~x & UINT256_MAX
}

export function muldiv(a: bigint, b: bigint, denominator: bigint): bigint {
  require(denominator > 0n, 'Denominator must be greater than zero')

  let prod0 = mul(a, b)
  let prod1 = (a * b) >> 256n

  if (prod1 === 0n) {
    return div(prod0, denominator)
  }

  require(prod1 < denominator, 'Overflow risk')

  let remainder = mulmod(a, b, denominator)

  prod1 = sub(prod1, gt(remainder, prod0) ? 1n : 0n)
  prod0 = sub(prod0, remainder)

  let twos = -denominator & denominator
  denominator = div(denominator, twos)

  prod0 = div(prod0, twos)
  twos = add(div(sub(0n, twos), twos), 1n)

  prod0 |= prod1 * twos

  let inv = (3n * denominator) ^ 2n

  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv
  inv *= 2n - denominator * inv

  let result = prod0 * inv
  return result % UINT256_SIZE
}

export function getWithdrawableAmount(
  startEmission: bigint,
  endEmission: bigint,
  amount: bigint,
  timeStamp: bigint,
  condition: string | null
): bigint {
  // Check unlock condition

  // TODO: do a contract call
  // .unlockTokens()
  if (condition && condition !== '0x0000000000000000000000000000000000000000') {
    return amount
  }

  // Logic for normal unlock on due date
  if (startEmission === 0n || startEmission === endEmission) {
    return endEmission < timeStamp ? amount : 0n
  }

  // Linear scaling lock logic
  let timeClamp = timeStamp
  if (timeClamp > endEmission) {
    timeClamp = endEmission
  }
  if (timeClamp < startEmission) {
    timeClamp = startEmission
  }
  const elapsed = timeClamp - startEmission
  const fullPeriod = endEmission - startEmission
  return muldiv(amount, elapsed, fullPeriod)
}

// TODO: convert to a contract call?
export function getWithdrawableShares(lock: TokenLock): bigint {
  const lockType = lock.startEmission === 0n ? 1 : 2
  const amount = lockType === 1 ? lock.sharesDeposited - lock.sharesWithdrawn : lock.sharesDeposited
  let withdrawable = getWithdrawableAmount(
    lock.startEmission,
    lock.endEmission,
    amount,
    BigInt(currentTimestamp.toFixed(0)) - 45n,
    lock.condition
  )

  if (lockType === 2) {
    withdrawable -= lock.sharesWithdrawn
  }

  return withdrawable
}

export function getWithdrawableTokens(lock: TokenLock): bigint {
  // const lockType = lock.startEmission === 0n ? 1 : 2;
  // const amount = lockType === 1 ? lock.tokensDeposited - lock.tokensWithdrawn : lock.tokensDeposited;
  // let withdrawable = getWithdrawableAmount(
  //   lock.startEmission,
  //   lock.endEmission,
  //   amount,
  //   BigInt(currentTimestamp.toFixed(0)) - 100n,
  //   lock.condition
  // );

  // if (lockType === 2) {
  //   withdrawable -= lock.tokensWithdrawn;
  // }

  let withdrawableShares = getWithdrawableShares(lock)

  // TODO: do we need withdrawals?
  // TODO: check numerator division rounding logic

  let numerator =
    (lock.tokensDeposited - lock.tokensWithdrawn === 0n
      ? 1n
      : lock.tokensDeposited - lock.tokensWithdrawn) /
    (lock.sharesDeposited - lock.sharesWithdrawn === 0n
      ? 1n
      : lock.sharesDeposited - lock.sharesWithdrawn)

  let withdrawable = withdrawableShares * numerator

  return withdrawable
}

// export function

// linear logic

// export function getWithdrawableToken(lock: TokenLock): bigint {
//   TokenLock storage userLock = LOCKS[_lockID];
//   uint256 withdrawableShares = getWithdrawableShares(userLock.lockID);
//   uint256 balance = IERC20(userLock.tokenAddress).balanceOf(address(this));
//   uint256 amountTokens = FullMath.mulDiv(withdrawableShares, balance, SHARES[userLock.tokenAddress] == 0 ? 1 : SHARES[userLock.tokenAddress]);
//   return amountTokens;
// }

// export function convertSharesToTokens(withdrawableShares: bigint, userBalance: bigint, ): bigint {

//   // FullMath.mulDiv(withdrawableShares, balance, SHARES[userLock.tokenAddress] == 0 ? 1 : SHARES[userLock.tokenAddress])

//   // return mulDiv(shares, userBalance, );

// }

export async function isERC20(address: Address, client: PublicClient): Promise<boolean> {
  try {
    await client.readContract({ address, abi: erc20Abi, functionName: 'symbol' })
    return true
  } catch (error) {
    return false
  }
}

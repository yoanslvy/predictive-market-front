import React from 'react'

import IconApp from '@images/apps/app.svg'
import IconDocs from '@images/apps/docs.svg'
import IconFarms from '@images/apps/farms.svg'
import IconLockV2 from '@images/apps/lock-v2.svg'
import IconLockV3 from '@images/apps/lock-v3.svg'
import IconMinter from '@images/apps/minter.svg'
import IconStealth from '@images/apps/stealth.svg'
import IconVesting from '@images/apps/vesting.svg'

type AppMenuItem = {
  title: React.ReactNode
  pathname: string
  query?: Record<string, string>
  description?: React.ReactNode
  icon?: React.ReactNode
}

type AppMenuSection = {
  title: string
  items: AppMenuItem[]
}

export const AppMenuSections = (address?: string, chain?: string): AppMenuSection[] => [
  {
    title: '',
    items: [
      {
        title: 'Token Vesting',
        pathname: '/lockers/manage/vesting',
        query: {
          service: 'overview',
          ...(address && { wallet: address }),
          ...(chain && { chain }),
        },
        description: 'Experience the most powerful token vesting platform.',
        icon: <IconVesting />,
      },
      {
        title: 'EVM LP lockers',
        pathname: '/lockers/manage/lockers-v4',
        query: {
          service: 'overview',
          ...(address && { wallet: address }),
          ...(chain && { chain }),
        },
        description: 'Lock your EVM LP positions (Uniswap, PancakeSwap, Aerodrome...).',
        icon: <IconLockV2 />,
      },
      {
        title: 'Solana Lockers',
        pathname: 'https://solana.uncx.network/',
        description: 'Lock your Tokens and LPs with Solana Lockers.',
        icon: <IconLockV3 />,
      },
    ],
  },
  {
    title: '',
    items: [
      {
        title: 'Minter',
        pathname: '/minter/manage',
        description: 'Mint a token from an audited factory.',
        icon: <IconMinter />,
      },
      {
        title: 'Stealth Launch',
        pathname: '/stealth/explore',
        description: 'Launch your project safely with our ethical and easy to use stealth.',
        icon: <IconStealth />,
      },
      {
        title: 'Farms',
        pathname: '/staking/explore',
        description:
          'Create customized rewarding programs for your community with our incredibly powerful staking and farming pool creator.',
        icon: <IconFarms />,
      },
    ],
  },
  {
    title: ' ',
    items: [
      {
        title: 'Disperser',
        pathname: '/disperser/disperse',
        description: 'Disperse a token or native currency.',
        icon: <IconApp />,
      },
      {
        title: 'Docs',
        pathname: 'https://docs.uncx.network/',
        description: 'Documentation for all UNCX Network services.',
        icon: <IconDocs />,
      },
    ],
  },
]

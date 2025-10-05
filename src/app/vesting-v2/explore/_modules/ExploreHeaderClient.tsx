'use client'

import ChainAsset from '@/src/components/modules/ChainAsset'
import Dropdown from '@/src/components/modules/Dropdown'
import { chainNameMap } from '@/src/utils/global'

import { CreateEventBtn } from '../../_components/CreateEventBtn'
import { vestingV2Contracts } from '@/src/interfaces/web3/vesting-v2/contracts'

type DashboardHeaderProps = {
  filter?: string
  wallet?: string
  chainId?: number
  chainFilter?: number
}

const availableChainKeys = Object.keys(vestingV2Contracts).map((e) => e.toString())

const allAvailableChains = Object.entries(chainNameMap).filter(([key]) => {
  return availableChainKeys.includes(key)
})

export function ExploreHeaderClient({ chainFilter }: DashboardHeaderProps) {
  const allChainsIcon = (
    <div className="flex items-center justify-between">
      <div className="flex justify-between -space-x-1 overflow-hidden ">
        <ChainAsset id={42161} onlyIcon={true} size="xs" />
        <ChainAsset id={56} onlyIcon={true} size="xs" />
        <ChainAsset id={1} onlyIcon={true} size="xs" />
      </div>
      <div className="ml-2">All</div>
    </div>
  )

  const baseExploreUrl = '/vesting-v2/explore/tokens'

  return (
    <div className="flex justify-between md:flex-row flex-col items-start md:items-center gap-[1rem]">
      <strong className="text-3xl text-white">Explore</strong>
      <div className="flex items-center gap-[1em]">
        <Dropdown
          size="xs"
          prefetch={true}
          caption={
            !chainFilter ? (
              allChainsIcon
            ) : (
              <ChainAsset id={chainFilter} onlyIcon={false} size="xs" />
            )
          }
          items={[
            {
              scroll: false,
              href: {
                pathname: baseExploreUrl,
              },
              caption: allChainsIcon,
            },
            ...allAvailableChains.map(([key]) => {
              return {
                scroll: false,
                href: {
                  pathname: baseExploreUrl,
                  query: {
                    ['chainFilter']: key,
                  },
                },
                caption: <ChainAsset id={key} onlyIcon={false} size="xs" />,
              }
            }),
          ]}
        />
        <CreateEventBtn />
      </div>
    </div>
  )
}

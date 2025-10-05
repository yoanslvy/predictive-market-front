'use client'

import { Checkbox } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'

import { useState } from 'react'

import ChainAsset from '@/src/components/modules/ChainAsset'
import Dropdown from '@/src/components/modules/Dropdown'
import { vestingV2Contracts } from '@/src/interfaces/web3/vesting-v2/contracts'
import { capitalizeFirstLetter, chainNameMap } from '@/src/utils/global'

import { FluxDirection } from '../_views/VestingDashboardView'
import { useParams } from '../create/_steps/_hooks/useParams'
import { DashboardSearchBar } from './DashboardSearchBar'

type DashboardHeaderProps = {
  table: FluxDirection
  filter?: string
  wallet: string
  chainId: number
  direction: 'incoming' | 'outgoing' | 'all'
  onlyClaimable: boolean
  chainFilter?: number
}

const availableChainKeys = Object.keys(vestingV2Contracts).map((e) => e.toString())

const allAvailableChains = Object.entries(chainNameMap).filter(([key]) => {
  return availableChainKeys.includes(key)
})

export function DashboardHeaderClient({
  table,
  filter,
  wallet,
  chainId,
  direction,
  onlyClaimable,
  chainFilter,
}: DashboardHeaderProps) {
  const [checked, setChecked] = useState(onlyClaimable)
  const { createQueryString } = useParams()
  const router = useRouter()
  const pathname = usePathname()

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

  const baseExploreUrl = `/vesting-v2/dashboard/${table}`

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-[1em] w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-[1em] w-full lg:w-auto lg:ml-auto">
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
                query: {
                  wallet,
                  chainId,
                },
              },
              caption: allChainsIcon,
            },
            ...allAvailableChains.map(([key]) => {
              return {
                scroll: false,
                href: {
                  pathname: baseExploreUrl,
                  query: {
                    chainFilter: key,
                    wallet,
                    chainId,
                  },
                },
                caption: <ChainAsset id={key} onlyIcon={false} size="xs" />,
              }
            }),
          ]}
        />
        <Dropdown
          size="xs"
          prefetch={true}
          caption={capitalizeFirstLetter(direction)}
          items={[
            {
              scroll: false,
              href: {
                pathname: baseExploreUrl,
                query: {
                  wallet,
                  chainId,
                  onlyClaimable: onlyClaimable ? 'true' : 'false',
                  direction: 'all',
                },
              },
              caption: 'All',
            },
            {
              scroll: false,
              href: {
                pathname: baseExploreUrl,
                query: {
                  wallet,
                  chainId,
                  onlyClaimable: onlyClaimable ? 'true' : 'false',
                  direction: 'incoming',
                },
              },
              caption: 'Incoming',
            },
            {
              scroll: false,
              href: {
                pathname: baseExploreUrl,
                query: {
                  wallet,
                  chainId,
                  onlyClaimable: onlyClaimable ? 'true' : 'false',
                  direction: 'outgoing',
                },
              },
              caption: 'Outgoing',
            },
          ]}
        />
        <div className="flex items-center gap-[0.5em] w-full sm:w-auto">
          <Checkbox
            checked={checked}
            onChange={({ target }) => {
              setChecked(target.checked)
              const params = createQueryString('onlyClaimable', target.checked ? 'true' : 'false')
              router.replace(`${pathname}?${params}`)
            }}
            size="xs"
            classNames={{
              input:
                'bg-transparent border-[#757A8B9E] border-2 bg-[#757A8B52] checked:bg-[#2FFA8129] checked:border-transparent',
              icon: 'text-[#2FFA81]',
              label: 'text-[14px] text-[#757A8BB8] whitespace-nowrap',
            }}
            labelPosition="right"
            label="Claimable"
          />
        </div>
        <div className="w-full sm:w-auto lg:min-w-[200px]">
          <DashboardSearchBar filter={filter} table={table} />
        </div>
      </div>
    </div>
  )
}

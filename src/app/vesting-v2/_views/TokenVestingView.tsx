import { VestingsOfTokenPagedQuery } from '@/.graphclient'

import { getAddress } from 'viem'

import Button from '@modules/Button'
import Card from '@modules/Card'
import Copy from '@modules/Copy'
import DexToolsChart from '@modules/DexToolsChart'
import Message from '@modules/Message'
import PageBanner from '@modules/Page/PageBanner'
import TokenAsset from '@modules/TokenAsset'

import IconEtherscan from '@images/apps/etherscan.svg'

import { MultiEmissionsChart } from '@/src/app/vesting-v2/_components/MultiEmissionsChart'
import DexScreenerChart from '@/src/components/modules/DexScreenerChart'
import Pagination from '@/src/components/modules/Pagination'
import Tabs from '@/src/components/modules/Tabs'
import { chainMetadata, truncate } from '@/src/utils/global'

import { EmissionType } from '../_components/EmissionsChart'
import { PageHeader } from '../_components/PageHeader'
import { paginate } from '../_utils/utils'
import { VestingLocksTable } from '../token/chain/[chain]/address/[token]/_components/tables/vestingLocksTable'

const entriesPerPage = 25

type DataItem = {
  time: string
  amountBD: number
  amount: string
}

type SummedItem = {
  time: string
  amountBD: number
}

function sumAmountBDByTime(data: DataItem[]): SummedItem[] {
  const grouped: Record<string, SummedItem> = {}

  data.forEach((item) => {
    const { time, amountBD } = item

    if (!grouped[time]) {
      grouped[time] = { time, amountBD: 0 }
    }

    grouped[time].amountBD += amountBD
  })

  return Object.values(grouped)
}

export function TokenVestingView({
  chain,
  token,
  vestingData,
  view,
  wallet,
  page,
  tokenSymbol,
}: {
  chain: number
  token: string
  vestingData: VestingsOfTokenPagedQuery
  view: 'vesting' | 'airdrop'
  wallet?: string
  page: number
  tokenSymbol: string
}) {
  const vestings = vestingData.vestingV2_vestings.filter((lock) => {
    return BigInt(lock.amount) > BigInt(lock.amountReleased)
  })

  const cVestings = Object.values(
    vestings.reduce(
      (acc, v) => {
        const key = `${v.endTime}@${v.startTime}@${v.vestingEmissionType}`

        if (!acc[key]) {
          acc[key] = {
            data: [],
            key,
            emissionType: v.vestingEmissionType,
          }
        }

        acc[key].data.push(...v.tranches)

        return acc
      },
      {} as Record<
        string,
        {
          data: VestingsOfTokenPagedQuery['vestingV2_vestings'][number]['tranches']
          key: string
          emissionType: string
        }
      >
    )
  ).map((e) => {
    return { ...e, data: sumAmountBDByTime(e.data).sort((a, b) => Number(a.time) - Number(b.time)) }
  })

  const paginatedVestings = paginate(vestings, page, entriesPerPage)

  const currentLockSlug = `/vesting-v2/token/chain/1/address/${token}`

  const tabs = [
    {
      caption: 'Vesting',
      href: {
        pathname: currentLockSlug,
        query: {
          view: 'vesting',
          wallet,
          chain,
        },
      },
      value: 'vesting',
      isActive: view === 'vesting',
      scroll: false,
    },
    {
      caption: 'Airdrops',
      href: {
        pathname: currentLockSlug,
        query: {
          view: 'airdrop',
          wallet,
          chain,
        },
      },
      value: 'airdrop',
      isActive: view === 'airdrop',
      scroll: false,
    },
  ]

  return (
    <>
      <PageBanner>
        <div className="hidden md:block">
          <DexScreenerChart address={getAddress(token)} chainId={chain} />
        </div>
      </PageBanner>

      <PageHeader
        leftHref={`/vesting-v2/explore/tokens`}
        leftLabel="Tokens"
        title={
          <div className="flex items-center justify-center gap-4">
            <div className="hidden lg:block">
              <TokenAsset address={token} chainId={chain} symbol={tokenSymbol} onlyIcon size="lg" />
            </div>
            <div className="block lg:hidden">
              <TokenAsset address={token} chainId={chain} symbol={tokenSymbol} onlyIcon size="sm" />
            </div>
            <p className="text-center text-xl sm:text-2xl md:text-[32px] font-bold text-[#F0F2FB]">
              {tokenSymbol}
            </p>
          </div>
        }
        rightSide={
          <div className="flex items-center justify-end gap-2">
            <div className="hidden lg:block">
              <Copy caption={truncate(token || '', 12, '...')} text={token || ''} />
            </div>
            <Button
              icon={<IconEtherscan />}
              href={`${chainMetadata[chain].explorer.url}/address/${token}`}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        }
      />

      <div>
        <Tabs type="section" size="sm" items={tabs} />
      </div>

      {vestings.length > 0 ? (
        <>
          <Card type="shade" title={view === 'vesting' ? 'Token Vesting' : 'Token Airdrop'}>
            {view === 'vesting' && (
              <div className="border shadow-2xl  backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 border-white/10 rounded-xl p-[2em]">
                <MultiEmissionsChart
                  tokenSymbol={tokenSymbol}
                  omitResponsiveContainer={true}
                  series={cVestings.map(({ data, emissionType, key }) => ({
                    data,
                    key,
                    emissionType: emissionType as EmissionType,
                    fullData: [],
                  }))}
                />
              </div>
            )}
            <VestingLocksTable vestingLocks={paginatedVestings} />
          </Card>
          <Pagination
            total={vestings.length}
            perPage={entriesPerPage}
            page={page}
            pathname={`/vesting-v2/token/chain/${chain}/address/${token}`}
            query={{ page, wallet, chain, view }}
          />
        </>
      ) : (
        <Message type="info" title="No Tokens Vested" />
      )}
    </>
  )
}

import { FluxesAllPagedByChainQuery } from '@/.graphclient'
import { ErrorBoundary } from 'react-error-boundary'
import 'server-only'

import Table from '@modules/Table'
import TokenAsset from '@modules/TokenAsset'

import { FluxDirection } from '@/src/app/vesting-v2/_views/VestingDashboardView'
import Message from '@/src/components/modules/Message'
import Pagination from '@/src/components/modules/Pagination'
import { fluxesPagedCached } from '@/src/server/fetchers/vesting-v2/fluxesPaged'

import { dateFormatter, emissionTypeMapper, paginate } from '../../../_utils/utils'
import { StatusBadge } from './StatusBadge'
import TokenTableError from './error'

type Props = {
  filter?: string
  page: number
  table: FluxDirection
  entriesPerPage: number
  chainId: number
  wallet: string
  direction: 'incoming' | 'outgoing' | 'all'
  onlyClaimable: boolean
  chainFilter?: number
}

function getStatus(flux: FluxesAllPagedByChainQuery['vestingV2_vestings'][number]) {
  if (flux.cancelDate) {
    return 'stopped'
  }

  const now = Date.now() / 1000

  if (flux.startTime > now) {
    return 'upcoming'
  }

  const claimProgress = Math.min(1, Math.max(0, flux.amountReleasedBD / flux.amountBD))
  const claimableAmount = Math.max(0, flux.amountWithdrawableBD)
  const unlockedAmount = Math.max(0, claimableAmount + flux.amountReleasedBD)
  const unlockProgress = Math.min(1, Math.max(0, unlockedAmount / flux.amountBD))

  if (claimProgress === 1) {
    return 'completed'
  }

  return unlockProgress
}

export default async function FluxesTableServer({
  direction,
  filter,
  page,
  entriesPerPage,
  chainId,
  wallet,
  onlyClaimable,
  table,
  chainFilter,
}: Props) {
  const fetchFluxes = async (entriesPerPage: number, page: number) => {
    return fluxesPagedCached(
      entriesPerPage,
      page,
      wallet,
      30,
      table === 'fluxes', // onlyVesting
      direction,
      onlyClaimable,
      chainFilter
    )
  }

  const isAirdrop = table === 'airdrops'

  const fluxesData = (
    await Promise.all(
      Array.from({
        length: 1, // todo arnau - same as beta. eventually needs to be increased. could be improved
      }).map((_, i) => fetchFluxes(1000, i + 1))
    )
  )
    .flat()
    .flat()
    .map((e) => e.vestingV2_vestings)
    .flat()

  const filteredFluxes = fluxesData.filter((flux) => {
    if (!filter) return true
    return (
      flux.beneficiaryId.toLowerCase().includes(filter.toLowerCase()) ||
      flux.vestingId.toString().includes(filter) ||
      flux.tokenVested.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      flux.tokenVested.name.toLowerCase().includes(filter.toLowerCase()) ||
      flux.tokenVested.tokenAddress.toLowerCase().includes(filter.toLowerCase()) ||
      flux.vestingEmissionType.toLowerCase().includes(filter.toLowerCase())
    )
  })

  function getRowHref<T extends { id: string }>(data: T) {
    let url = `/vesting-v2/${isAirdrop ? 'airdrop' : 'flux'}/${data.id}`
    url += `?chain=${chainId}`
    url += `&wallet=${wallet}`
    return url
  }

  return (
    <ErrorBoundary fallback={<TokenTableError />}>
      {filteredFluxes.length > 0 ? (
        <Table
          isLoading={false}
          rowHref={(data) => getRowHref(data!).toString()}
          columns={[
            {
              title: 'ID',
              type: 'number',
              render: ({ data }) => (
                <p className="text-[#F0F2FB4D] text-[15px]">{data.vestingId}</p>
              ),
            },
            // {
            //   title: 'Chain',
            //   render: ({ data }) => (
            //     <div className="flex items-center gap-2">
            //       <div className="[&>svg]:size-[1.6em] [&>img]:size-[1.6em] [&>img]:rounded-full [&>svg]:rounded-full">
            //         {ChainsData[data.chainId].logo}
            //       </div>
            //       <p className="text-sm font-semibold text-white">
            //         {ChainsData[data.chainId].displayName}
            //       </p>
            //     </div>
            //   ),
            // },
            {
              title: 'Token',
              render: ({ data }) => (
                <div className="w-[8em] min-w-[8em]">
                  <TokenAsset
                    chainId={data.chainId}
                    address={data.tokenVested.tokenAddress}
                    name={data.tokenVested.name}
                    symbol={data.tokenVested.symbol}
                    size="xs"
                    titleClassName="text-[15px]"
                    // showChain={false}
                  />
                </div>
              ),
            },
            {
              title: 'Total Payout',
              render: ({ data }) => (
                <p className="text-[15px] capitalize w-[8em] min-w-[8em]">
                  {data.amountBD.toLocaleString('en', { notation: 'compact' })}
                </p>
              ),
            },
            {
              title: 'Status',
              render: ({ data }) => (
                <div className="w-[10em] min-w-[10em]">
                  <StatusBadge status={getStatus(data)} />
                </div>
              ),
            },

            {
              title: 'Type',
              render: ({ data }) => (
                <p className="text-[15px] capitalize w-[8em] min-w-[8em]">
                  {emissionTypeMapper[
                    data.vestingEmissionType as keyof typeof emissionTypeMapper
                  ] || 'Unknown'}
                </p>
              ),
            },
            {
              title: 'End date',
              render: ({ data }) => (
                <p className="text-[15px] capitalize w-[8em] min-w-[8em]">
                  {dateFormatter(new Date(Number(data.endTime) * 1000), false, false)}
                </p>
              ),
            },
          ]}
          data={paginate(
            filteredFluxes.map((e, idx) => ({ ...e, idx })),
            page ?? 1,
            entriesPerPage
          )}
        />
      ) : (
        <Message
          type="info"
          title={`No ${isAirdrop ? 'airdrops' : 'vesting'} found`}
          text={`Your ${isAirdrop ? 'airdrops' : 'vesting'} will appear here.`}
        />
      )}
      <Pagination
        total={Number(filteredFluxes.length)}
        perPage={Number(entriesPerPage)}
        page={page ? Number(page) : 1}
        pathname={`/vesting-v2/dashboard/${table}`}
        query={{ page, filter, chain: chainId, wallet }}
      />
    </ErrorBoundary>
  )
}

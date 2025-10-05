import { VestingByIdQuery } from '@/.graphclient'
import 'server-only'

import { cn } from '@/src/src/utils'

import { CoverBanner } from '../_components/CoverBanner'
import { EmissionType } from '../_components/EmissionsChart'
import { PageHeader } from '../_components/PageHeader'
import { Emissions } from '../_flux/_components/Emissions'
import { FluxNotFound } from '../_flux/_components/FluxNotFound'
import { NftDetails } from '../_flux/_components/NftDetails'
import { Progress } from '../_flux/_components/Progress'
import { VestingDetails } from '../_flux/_components/VestingDetails'
import FluxTransactionsTable from '../_tables/FluxTxTableServer'

export function Flux({
  wallet,
  fluxData,
  page,
  chainId,
  isAirdrop = false,
}: {
  wallet?: string
  fluxData: VestingByIdQuery
  page?: number
  chainId?: number
  isAirdrop?: boolean
}) {
  const data = fluxData.vestingV2_vestingById
  const title = isAirdrop ? 'Airdrop Details' : 'Vesting Details'
  const dashboardPath = isAirdrop ? 'airdrops' : 'fluxes'
  const dashboardUrl = `/vesting-v2/dashboard/${dashboardPath}?wallet=${wallet}&chain=${chainId}`

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-start">
        <PageHeader
          title={title}
          leftHref={dashboardUrl}
          leftLabel="Back to the dashboard"
          rightHref={dashboardUrl}
        />
        <FluxNotFound wallet={wallet} chainId={chainId} isAirdrop={isAirdrop} />
      </div>
    )
  }

  const emissions = (() => {
    const pv = data.tranches.map((e) => ({
      name: new Date(e.time * 1000),
      pv: e.amountBD,
    }))

    return [...pv]
  })()

  return (
    <div className="flex flex-col items-center justify-start">
      <PageHeader
        title={title}
        leftHref={dashboardUrl}
        leftLabel="Back to the dashboard"
        rightHref={dashboardUrl}
      />
      {(!!data.apiParams.coverPicture || !!data.apiParams.profilePicture) && (
        <CoverBanner
          coverUrl={data.apiParams.coverPicture ?? null}
          logoUrl={data.apiParams.profilePicture ?? null}
          chainId={chainId}
          wallet={wallet}
          fluxData={data}
        />
      )}
      <div className="w-full h-full mt-8">
        <div
          className={cn('grid gap-4 grid-cols-1', 'xl:grid-cols-5 xl:grid-rows-[390px_350px]')}>
          <div className="xl:col-span-2 xl:row-span-1">
            <Progress vesting={data} wallet={wallet} />
          </div>

          <div className="xl:col-span-3 xl:row-span-1">
            <VestingDetails data={data} wallet={wallet} />
          </div>

          <div className={cn('xl:row-start-2', 'xl:col-span-2')}>
            <NftDetails vesting={data} wallet={wallet} />
          </div>

          <div
            className={cn(
              'h-full border shadow-2xl rounded-xl backdrop-blur-xl',
              'xl:col-span-3 xl:col-start-3 xl:row-start-2',
              'bg-gradient-to-br from-white/5 to-white/10 border-white/10',
              'flex flex-col transition-all duration-300 ease-in-out'
            )}>
            <div className="flex flex-col h-full p-1 overflow-hidden">
              <Emissions
                emissions={emissions}
                tokenName={data.tokenVested.symbol}
                emissionType={data.vestingEmissionType as EmissionType}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-col items-start gap-[1rem] mt-[2em]">
        <div className="mb-[2rem] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <p className="text-[24px] text-white font-bold">Transaction history</p>
          {/* <FilterButton /> */}
        </div>
        <FluxTransactionsTable fluxData={data} page={page} wallet={wallet} chainId={chainId} />
      </div>
    </div>
  )
}

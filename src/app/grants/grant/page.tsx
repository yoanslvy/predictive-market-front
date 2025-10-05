import { Suspense } from 'react'

import SubmitAnswer from '@/src/components/modules/SubmitAnswer'
import { cn } from '@/src/src/utils'

import { getGrant, getGrantBestAnswer } from '../../server/getAllGrants'
import FluxTransactionsTable from '../../vesting-v2/_tables/FluxTxTableServer'
import { DetailCard, GrantDetails } from './components/GrantDetails'
import ResolutionProgressBar from './components/ResolutionProgressBar'

export const dynamic = 'force-dynamic'
export const revalidate = false
export const fetchCache = 'only-no-store'

export default async function GrantLayout({
  searchParams,
}: {
  searchParams: {
    grantId?: string
    question?: string
    bond?: string
    minBond?: string
    openingTime?: string
    resolved?: string
    recipient?: string
  }
}) {
  const grantId = searchParams.grantId as string

  if (!grantId) {
    return <div>No grant ID provided</div>
  }

  const grant = await getGrant(grantId)
  const answerStatus = await getGrantBestAnswer(grantId)

  const openingTime = searchParams.openingTime as string
  const now = new Date()
  const openingTimeDate = openingTime ? new Date(Number(openingTime) * 1000) : null
  const isOpeningTimePassed = openingTimeDate ? openingTimeDate < now : false
  const resolved = searchParams.resolved === 'true'

  return (
    <div>
      <div className={cn('grid gap-4 grid-cols-1', 'xl:grid-cols-3 xl:grid-rows-[390px]')}>
        <div className="xl:col-span-2 xl:row-span-1">
          <GrantDetails grant={grant} resolved={resolved} />
        </div>
        <div className="xl:col-span-1 xl:row-span-1">
          {resolved ? (
            <DetailCard label="Condition">
              <p className="text-white text-md font-medium leading-relaxed">{grant.question}</p>
              <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
                Resolved to {answerStatus}
              </span>
            </DetailCard>
          ) : isOpeningTimePassed ? (
            <SubmitAnswer
              grant={grant}
              isopeningTimePassed={isOpeningTimePassed}
              answerStatus={answerStatus}
            />
          ) : (
            <DetailCard label="Condition">
              <p className="text-white text-md font-medium leading-relaxed">{grant.question}</p>
            </DetailCard>
          )}
        </div>
      </div>

      <div className="w-full flex-col items-start gap-[1rem] mt-[2em]">
        <ResolutionProgressBar
          grantId={grantId}
          creationDate={openingTime}
          openingTime={openingTime}
          resolved={resolved}
        />
      </div>

      <div className="w-full flex-col items-start gap-[1rem] mt-[2em]">
        <div className="mb-[2rem] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <p className="text-[24px] text-white font-bold">Transaction history</p>
        </div>
        <FluxTransactionsTable page={1} chainId={11155111} />
      </div>
    </div>
  )
}

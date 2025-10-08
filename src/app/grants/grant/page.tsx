import SubmitAnswer from '@/src/components/modules/SubmitAnswer'
import { getAnswersByQuestionIdFetcherCached } from '@/src/server/fetchers/getAnswers'
import { getGrantDatasByChainFetcherCached } from '@/src/server/fetchers/getGrantById'
import { cn } from '@/src/src/utils'

import { getGrantBestAnswer } from '../../server/getAllGrants'
import FluxTransactionsTable from '../_components/FluxTxTableServer'
import { Answers, Grants } from '../explore/latest/_modules/tokenTable/data'
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
  }
}) {
  const grantId = searchParams.grantId as string

  if (!grantId) {
    return <div>No grant ID provided</div>
  }

  const grant = await getGrantDatasByChainFetcherCached({ id: grantId, chain: '11155111' })
  const grantData = grant.conditional_grants[0] as unknown as Grants

  const answer = await getAnswersByQuestionIdFetcherCached({
    chainId: '11155111',
    questionId: grantData.questionId,
  })
  const answerData = answer.conditional_answers as unknown as Answers[]
  const filteredAnswer = answerData.sort(
    (answerA, answerB) => Number(answerA.creationTimestamp) - Number(answerB.creationTimestamp)
  )
  const answerStatus = await getGrantBestAnswer(grantId)

  const now = new Date()

  let countdown = undefined

  if (filteredAnswer.length > 0) {
    const firstAnswer = filteredAnswer[0]
    const resolutionTime = new Date(Number(firstAnswer.creationTimestamp) + 24 * 60 * 60 * 1000) // +1 day
    const countdownDiffMs = resolutionTime.getTime() - now.getTime()

    if (countdownDiffMs <= 0) {
      countdown = 'Countdown finished'
    } else {
      const hours = Math.floor(countdownDiffMs / (1000 * 60 * 60))
      const minutes = Math.floor((countdownDiffMs / (1000 * 60)) % 60)
      const seconds = Math.floor((countdownDiffMs / 1000) % 60)

      countdown = `${hours}h ${minutes}m ${seconds}s`
    }
  }

  const openingTime = grantData.questionEntity.openingTs
  const openingTimeDate = openingTime ? new Date(Number(openingTime)) : null
  const isOpeningTimePassed = openingTimeDate ? openingTimeDate < now : false
  const resolved = grantData.resolved

  const collateralToken = grantData.collateralToken

  const creationTx = {
    creationTimestamp: grantData.creationTimestamp.toString(),
    txnHash: grantData.txnHash,
    amount: grantData.amount.toString(),
    token: collateralToken,
  }
  const question = grantData.questionEntity.question.slice(0, -10)

  return (
    <div>
      <div className={cn('grid gap-4 grid-cols-1', 'xl:grid-cols-3 xl:grid-rows-[390px]')}>
        <div className="xl:col-span-2 xl:row-span-1">
          <GrantDetails grant={grantData} resolved={resolved} />
        </div>
        <div className="xl:col-span-1 xl:row-span-1">
          {resolved ? (
            <DetailCard label="Condition">
              <p className="text-white text-md font-medium leading-relaxed">{question}</p>
              <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
                Resolved to {answerStatus}
              </span>
            </DetailCard>
          ) : isOpeningTimePassed ? (
            <SubmitAnswer
              grant={grantData}
              isopeningTimePassed={isOpeningTimePassed}
              answerStatus={answerStatus}
              countdown={countdown}
            />
          ) : (
            <DetailCard label="Condition">
              <p className="text-white text-md font-medium leading-relaxed">{question}</p>
            </DetailCard>
          )}
        </div>
      </div>

      <div className="w-full flex-col items-start gap-[1rem] mt-[2em]">
        <ResolutionProgressBar
          grantId={grantId}
          creationDate={grantData.creationTimestamp.toString()}
          openingTime={openingTime.toString()}
          resolved={resolved}
        />
      </div>

      <div className="w-full flex-col items-start gap-[1rem] mt-[2em]">
        <div className="mb-[2rem] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <p className="text-[24px] text-white font-bold">Transaction history</p>
        </div>
        <FluxTransactionsTable page={1} chainId={11155111} creationTx={creationTx} />
      </div>
    </div>
  )
}

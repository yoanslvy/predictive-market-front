import { Suspense } from 'react'

import CurrentAnswer from './components/CurrentAnswer'
import GrantTab from './components/Tabs'

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
  }
}) {
  const grantId = searchParams.grantId as string

  if (!grantId) {
    return <div>No grant ID provided</div>
  }

  const question = searchParams.question as string
  const bond = searchParams.bond as string
  const minBond = searchParams.minBond as string
  const openingTime = searchParams.openingTime as string
  const resolved = searchParams.resolved == 'true' ? true : false

  // Check if openingTime has passed
  const now = new Date()
  const openingTimeDate = openingTime ? new Date(Number(openingTime) * 1000) : null
  const isopeningTimePassed = openingTimeDate ? openingTimeDate < now : false

  return (
    <>
      <div className="mb-8 bg-dark-base-800 rounded-2xl p-6 border border-dark-base-600 backdrop-blur-md shadow-md shadow-black/40">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-[#00e068] rounded-full mt-2"></div>
            <div>
              <span className="text-xs font-semibold text-[#00e068] uppercase tracking-wider">
                Grant ID
              </span>
              <p className="text-base font-mono text-[#80838f] mt-1 break-all">{grantId}</p>
            </div>
          </div>
          {question && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-[#27beff] rounded-full mt-2"></div>
              <div>
                <span className="text-xs font-semibold text-[#27beff] uppercase tracking-wider">
                  Question
                </span>
                <p className="text-base text-[#80838f] mt-1 leading-relaxed">{question}</p>
              </div>
            </div>
          )}

          {openingTime && (
            <div className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  isopeningTimePassed ? 'bg-[#ff4063]' : 'bg-[#ff9900]'
                }`}></div>
              <div>
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isopeningTimePassed ? 'text-[#ff4063]' : 'text-[#ff9900]'
                  }`}>
                  opening time:
                </span>
                <p className="text-base text-[#80838f] mt-1">
                  {openingTimeDate ? openingTimeDate.toLocaleString() : openingTime}
                </p>
                {resolved && (
                  <p className="text-sm text-[#ff4063] mt-1 font-medium">Grant resolved</p>
                )}
                {!resolved && !isopeningTimePassed && (
                  <p className="text-sm text-[#ff4063] mt-1 font-medium">Grant not open yet</p>
                )}
                {!resolved && isopeningTimePassed && (
                  <p className="text-sm mt-1 font-medium">Grant open</p>
                )}
              </div>
            </div>
          )}
          <CurrentAnswer grantId={grantId} />
        </div>
      </div>
      <Suspense>
        <GrantTab
          grantId={grantId}
          question={question}
          bond={bond}
          minBond={minBond}
          openingTime={openingTime}
          isopeningTimePassed={isopeningTimePassed}
          resolved={resolved}
        />
      </Suspense>
    </>
  )
}

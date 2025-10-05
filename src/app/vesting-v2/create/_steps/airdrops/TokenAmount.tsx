'use client'

import { useState } from 'react'

import Table from '@/src/components/modules/Table'
import { cn } from '@/src/src/utils'

import { AmountInputWithMaxAmount } from '../../../_components/AmountInputWithMaxAmount'
import {
  dateFormatter,
  formatAmount,
  getAmountAndDatePerStepWithFee,
  getNormalizedTokenAmount,
  getStepsUnixTimestamps,
} from '../../../_utils/utils'
import { AnyRecipient, useAirdropStore } from '../_hooks/useAirdropStore'

export function TokenAmount({
  tokenAmountUi,
  tokenPriceUsd,
  tokenSymbol,
  tokenDecimals,
}: {
  tokenSymbol: string
  tokenAmountUi: number
  tokenPriceUsd: number | null
  tokenDecimals: number
}) {
  const [showAllRows, setShowAllRows] = useState(false)

  const {
    setAirdropTokenAmountUi,
    airdropTokenAmountUi,
    endDate,
    startDate,
    steps,
    setRecipients,
    emissionType,

    setLinearRecipients,
    setScheduledRecipients,
    setStepsRecipients,
  } = useAirdropStore((s) => ({
    setAirdropTokenAmountUi: s.setAirdropTokenAmountUi,
    airdropTokenAmountUi: s.airdropTokenAmountUi,
    steps: s.steps,
    startDate: s.startDate,
    endDate: s.endDate,
    setRecipients: s.setRecipients,
    emissionType: s.emissionType,

    setScheduledRecipients: s.setScheduledRecipients,
    setStepsRecipients: s.setStepsRecipients,
    setLinearRecipients: s.setLinearRecipients,
  }))

  function getStepDates() {
    if (!startDate || !endDate || !steps) {
      return []
    }
    const amountPerStep = ((airdropTokenAmountUi ?? 0) * 10 ** 18) / (steps ?? 1) / 10 ** 18
    const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)
    const datesUnix = getStepsUnixTimestamps(startDate, endDate, steps)
    return getAmountAndDatePerStepWithFee(amountPerStepNorm, datesUnix).map((e) => ({
      name: new Date(e.date * 1000),
      pv: Number(amountPerStepNorm),
    }))
  }

  const stepDates = getStepDates()
  const displayData = showAllRows ? stepDates : stepDates.slice(0, 3)
  const hasMoreRows = stepDates.length > 3

  const totalAmount = stepDates.at(-1)?.pv ?? 0

  const hasInsufficientFunds =
    (!!tokenAmountUi && !!airdropTokenAmountUi && !!(tokenAmountUi < airdropTokenAmountUi)) ||
    (!!tokenAmountUi && !!totalAmount && !!(tokenAmountUi < totalAmount))

  const handleSetRecipients = (
    newRecipients: AnyRecipient[] | ((prev: AnyRecipient[]) => AnyRecipient[])
  ) => {
    if (emissionType.value === 'scheduled') {
      setScheduledRecipients(newRecipients)
    } else if (emissionType.value === 'unlockInSteps' && steps) {
      setStepsRecipients(newRecipients)
    } else if (emissionType.value === 'linear') {
      setLinearRecipients(newRecipients)
    }
  }

  return (
    <div className="mb-[3rem] md:mb-[5rem] flex w-full flex-col md:flex-row items-start gap-y-[1rem] md:gap-x-[1rem] md:gap-y-[2rem]">
      <div className="flex flex-col gap-y-[0.75em] md:gap-y-[1em] w-full max-w-[700px]">
        <p className="text-sm md:text-base">Assign the same token amount to all addresses</p>
        <AmountInputWithMaxAmount
          maxTokenDecimals={tokenDecimals}
          hasInsufficientFunds={hasInsufficientFunds}
          tokenPriceUsd={tokenPriceUsd}
          maxAmount={tokenAmountUi}
          tokenSymbol={tokenSymbol}
          amount={airdropTokenAmountUi}
          onChange={(e) => {
            const n = Number(e)
            setAirdropTokenAmountUi(n)
            handleSetRecipients([])
          }}
          className="w-full"
        />
        {hasInsufficientFunds && (
          <p className="text-sm font-bold text-red-500">Insufficient funds</p>
        )}
        {stepDates.length > 0 && (
          <div className="w-full p-2 sm:p-3 bg-[#2C2F3A]/30 rounded-lg border border-[#2C2F3A] flex flex-col gap-2">
            <div className="mt-2">
              <div className="overflow-x-auto">
                <Table
                  className="border border-[#2C2F3A] min-w-full"
                  data={displayData.map(({ name, pv }, idx) => ({
                    id: idx + 1,
                    date: dateFormatter(name),
                    pv,
                  }))}
                  columns={[
                    {
                      title: 'Release #',
                      render: ({ data }) => (
                        <p className="text-[#F0F2FB4D] text-[11px] sm:text-[13px] lg:text-[15px]">
                          {data.id}
                        </p>
                      ),
                    },
                    {
                      title: 'Release Date',
                      render: ({ data }) => (
                        <p className="text-[11px] sm:text-[13px] lg:text-[15px] capitalize">
                          {data.date}
                        </p>
                      ),
                    },
                    {
                      title: 'Amount',
                      render: ({ data }) => (
                        <p
                          className={cn(
                            'text-[11px] sm:text-[13px] lg:text-[15px]',
                            data.pv ? 'text-white' : 'text-red-500'
                          )}>
                          {formatAmount(data.pv)}
                        </p>
                      ),
                    },
                  ]}
                  showHeader={true}
                />
              </div>
              {hasMoreRows && (
                <div className="flex justify-center mt-3">
                  <button
                    type="button"
                    onClick={() => setShowAllRows(!showAllRows)}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs lg:text-sm bg-[#202228] hover:bg-[#2A2C33] border border-[#2C2F3A] rounded-md text-white transition-colors duration-200 flex items-center gap-1 sm:gap-2">
                    {showAllRows ? (
                      <>
                        <span className="inline">Show Less</span>
                        <svg
                          className="w-2 h-2 rotate-180 sm:w-3 sm:h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span className="inline">Show All {stepDates.length} Rows</span>
                        <svg
                          className="w-2 h-2 sm:w-3 sm:h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

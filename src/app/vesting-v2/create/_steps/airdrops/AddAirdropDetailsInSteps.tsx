import { Divider } from '@mantine/core'
import dayjs from 'dayjs'

import { useState } from 'react'

import { Address } from 'viem'

import Table from '@modules/Table'

import { cn } from '@/src/src/utils'

import { DateRangePicker } from '../../../_components/DatePicker'
import { NumberInputWithLeftArrows } from '../../../_components/NumberInputWithLeftArrows'
import { TokenAddressInputWithQueryStatus } from '../../../_components/TokenAddressInputWithQueryStatus'
import {
  dateFormatter,
  getStepsUnixTimestamps,
  MAX_STEPS_PER_BATCH,
  MIN_STEPS_PER_BATCH,
} from '../../../_utils/utils'
import { DistributionCard } from '../_components/DistributionCard'
import { TokenInformation } from '../_components/TokenInformation'
import { distributionTypes, useAirdropStore } from '../_hooks/useAirdropStore'
import { useQueryMintAndSetToStore } from '../_hooks/useQueryMintAndSetToStore'

export function AddAirdropDetailsInSteps({ wallet, chainId }: { wallet: string; chainId: number }) {
  const {
    endDate,
    selectedDistributionType,
    setDistributionType,
    setEndDate,
    setStartDate,
    setTokenAddress,
    startDate,
    tokenAddress,
    setTokenAmountUi,
    setTokenLogoURI,
    setTokenPriceUsd,
    setTokenSymbol,
    tokenLogoURI,
    tokenSymbol,
    setSteps,
    steps,
    resetFluxes,
    setTokenDecimals,
  } = useAirdropStore((state) => ({
    setEndDate: state.setEndDate,
    setStartDate: state.setStartDate,
    endDate: state.endDate,
    startDate: state.startDate,
    setTokenAddress: state.setTokenAddress,
    tokenAddress: state.tokenAddress,
    tokenLogoURI: state.tokenLogoURI,
    tokenSymbol: state.tokenSymbol,
    setDistributionType: state.setDistributionType,
    selectedDistributionType: state.distributionType,
    setTokenSymbol: state.setTokenSymbol,
    setTokenAmountUi: state.setTokenAmountUi,
    setTokenPriceUsd: state.setTokenPriceUsd,
    setTokenLogoURI: state.setTokenLogoURI,
    setSteps: state.setSteps,
    steps: state.steps,
    resetFluxes: state.resetFluxes,
    setTokenDecimals: state.setTokenDecimals,
  }))

  const { isError, isLoading, mintQuery, priceUsdQuery, tokenLogoQuery } =
    useQueryMintAndSetToStore({
      tokenAddress: tokenAddress as Address | null,
      wallet: wallet as Address,
      setTokenAmountUi,
      setTokenLogoURI,
      setTokenPriceUsd,
      setTokenSymbol,
      chainId,
      setTokenDecimals,
    })

  const [showAllRows, setShowAllRows] = useState(false)

  function getStepDates() {
    if (!startDate || !endDate || !steps) {
      return []
    }
    return getStepsUnixTimestamps(startDate, endDate, steps)
  }

  const stepDates = getStepDates()
  const displayData = showAllRows ? stepDates : stepDates.slice(0, 3)
  const hasMoreRows = stepDates.length > 3

  return (
    <div className="flex w-full flex-col items-start gap-x-[1rem] gap-y-[2rem]">
      <div className="flex w-full max-w-[700px] flex-col gap-y-[1rem]">
        <div className="flex w-full flex-col gap-y-[1rem]">
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-white">Add details</p>
          <TokenAddressInputWithQueryStatus
            isError={isError}
            isLoading={isLoading}
            tokenAddress={tokenAddress}
            onChange={(e) => {
              setTokenAddress(e.target.value)
              resetFluxes()
            }}
            tokenSymbol={tokenSymbol}
            mintLogoUri={tokenLogoURI}
          />
          <TokenInformation
            mintQuery={mintQuery}
            tokenLogoQuery={tokenLogoQuery}
            priceUsdQuery={priceUsdQuery}
          />
          <Divider className="w-full" color="#202228" />
          <NumberInputWithLeftArrows
            placeholder="Number of steps"
            value={steps}
            setValue={setSteps}
            min={MIN_STEPS_PER_BATCH}
            max={MAX_STEPS_PER_BATCH}
          />
          <p className="text-sm">
            Min: {MIN_STEPS_PER_BATCH}, Max: {MAX_STEPS_PER_BATCH}
          </p>
          <Divider className="w-full" color="#202228" />
          <DateRangePicker
            enableYearNavigation
            showTimePicker
            value={{
              from: startDate ?? undefined,
              to: endDate ?? undefined,
            }}
            onChange={(value) => {
              if (value) {
                setStartDate(value.from ? value.from : null)
                setEndDate(value.to ? value.to : null)
              }
            }}
            fromDate={new Date()}
            className="px-[16px] py-[12px] text-[16px] text-white h-[48px]"
            placeholder="Select start and end date"
            tooltip="Select the date and time when the airdrop distribution begins and ends. This will determine when each step of the airdrop occurs. After the end date, no more airdrops will be distributed but they will still be claimable."
          />

          {(startDate || endDate) && (
            <div className="w-full p-2 sm:p-3 bg-[#2C2F3A]/30 rounded-lg border border-[#2C2F3A] flex flex-col gap-2">
              <div className="flex flex-col gap-2 text-xs sm:text-sm">
                {startDate && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-0">
                    <span className="text-[#757A8B]">Starts in:</span>
                    <span
                      className={cn(
                        !dayjs(startDate).isBefore(dayjs()) ? 'text-white' : 'text-red-500'
                      )}>
                      {dayjs(startDate).diff(dayjs(), 'day')} days,{' '}
                      {dayjs(startDate).diff(dayjs(), 'hour') % 24} hours (
                      {dayjs(startDate).format('MMM DD, YYYY')})
                    </span>
                  </div>
                )}
                {startDate && endDate && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-0">
                    <span className="text-[#757A8B]">Duration:</span>
                    <span className="text-white">
                      {dayjs(endDate).diff(dayjs(startDate), 'day')} days,{' '}
                      {dayjs(endDate).diff(dayjs(startDate), 'hour') % 24} hours
                    </span>
                  </div>
                )}
              </div>
              {stepDates.length >= 2 && (
                <div className="mt-2">
                  <div className="overflow-x-auto">
                    <Table
                      className="border border-[#2C2F3A] min-w-full"
                      data={displayData
                        .map((timestamp, idx) => ({
                          id: idx + 1,
                          date: dateFormatter(new Date(timestamp * 1000)),
                        }))
                        .slice(0, MAX_STEPS_PER_BATCH)}
                      columns={[
                        {
                          title: 'Release #',
                          render: ({ data }) => (
                            <p className="text-[#F0F2FB4D] text-[13px] sm:text-[15px]">{data.id}</p>
                          ),
                        },
                        {
                          title: 'Release Date',
                          render: ({ data }) => (
                            <p className="text-[13px] sm:text-[15px] capitalize">{data.date}</p>
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
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-[1rem] w-full max-w-[700px]">
        <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-white">Distribution Type</p>
        <div className="flex flex-col sm:flex-row gap-[1rem] w-full">
          {distributionTypes.map((distributionType) => (
            <button
              className="flex-1 w-full"
              onClick={() => {
                setDistributionType(distributionType)
                resetFluxes()
              }}
              key={distributionType.title}>
              <DistributionCard
                title={distributionType.title}
                bottomText={distributionType.bottomText}
                isActive={
                  distributionType.title.toLowerCase() ===
                  selectedDistributionType.title.toLowerCase()
                }
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

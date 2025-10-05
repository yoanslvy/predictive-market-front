import { Divider } from '@mantine/core'
import dayjs from 'dayjs'

import { Address } from 'viem'

import { cn } from '@/src/src/utils'

import { DateRangePicker, SingleDatePicker } from '../../../_components/DatePicker'
import { TokenAddressInputWithQueryStatus } from '../../../_components/TokenAddressInputWithQueryStatus'
import { DistributionCard } from '../_components/DistributionCard'
import { TokenInformation } from '../_components/TokenInformation'
import { distributionTypes, useAirdropStore } from '../_hooks/useAirdropStore'
import { useQueryMintAndSetToStore } from '../_hooks/useQueryMintAndSetToStore'

export function AddAirdropDetailsLinear({ wallet, chainId }: { wallet: string; chainId: number }) {
  const {
    selectedDistributionType,
    setDistributionType,
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
    resetFluxes,
    endDate,
    setEndDate,
    setTokenDecimals,
  } = useAirdropStore((state) => ({
    setStartDate: state.setStartDate,
    setEndDate: state.setEndDate,
    startDate: state.startDate,
    endDate: state.endDate,
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

  return (
    <div className="flex w-full flex-col items-start gap-x-[1rem] gap-y-[2rem]">
      <div className="flex w-full max-w-[700px] flex-col gap-y-[1rem]">
        <div className="flex w-full flex-col gap-y-[1rem]">
          <p className="text-[20px] text-white">Add details</p>
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

          {startDate && (
            <div className="w-full p-3 bg-[#2C2F3A]/30 rounded-lg border border-[#2C2F3A]">
              <div className="flex flex-col gap-2 text-sm">
                {startDate && (
                  <div className="flex justify-between">
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
              </div>
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

import type { Address } from 'viem'

import { shortenEthAddress } from '@/src/app/minter/global'
import { cn } from '@/src/src/utils'

import { Loader } from '../../../_svg/Loader'
import { TickInFilledCircle } from '../../../_svg/TickInFilledCircle'
import { dateFormatter, formatAmount } from '../../../_utils/utils'
import { CheckoutFeeStructure } from '../_components/CheckoutFeeStructure'
import { CheckoutTokenSummary } from '../_components/CheckoutTokenSummary'
import { CliffExponentialFlux, useVestingStore } from '../_hooks/useVestingStore'
import { CheckoutTable } from './CheckoutTable'
import { CheckoutVestingSchedule } from './CheckoutVestingSchedule'

export function CheckoutCliffExponential({
  vestingContract,
  chainId,
  tokenAddress,
  wallet,
}: {
  vestingContract: Address
  chainId: number
  wallet: Address
  tokenAddress: Address
}) {
  const { fluxSettings, tokenSymbol, activeFluxes } = useVestingStore((s) => ({
    fluxSettings: s.fluxSettings,
    tokenSymbol: s.tokenSymbol,
    activeFluxes: s.activeFluxes as CliffExponentialFlux[],
  }))

  const { isFluxCancellable, isFluxTransferrable } = fluxSettings

  const totalTokenAmount = activeFluxes.reduce((acc, recipient) => {
    return acc + recipient.amount
  }, 0)

  return (
    <>
      <div className="flex w-full flex-col items-start gap-x-[1rem] gap-y-[1.5em] mt-[2em]">
        {/* Combined token and fees section */}
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          <CheckoutTokenSummary
            totalTokenAmount={totalTokenAmount}
            tokenSymbol={tokenSymbol}
            isFluxCancellable={isFluxCancellable}
            isFluxTransferrable={isFluxTransferrable}
          />
          <CheckoutFeeStructure
            vestingContract={vestingContract}
            chainId={chainId}
            totalTokenAmount={totalTokenAmount}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            wallet={wallet}
          />
        </div>

        <div className="flex w-full justify-between gap-y-[1rem]">
          <div className="flex w-full flex-col gap-y-[1rem]">
            <CheckoutVestingSchedule recipientCount={activeFluxes.length}>
              <CheckoutTable
                headers={[
                  { jsx: '' },
                  { jsx: 'Recipient' },
                  {
                    jsx: 'Amount',
                    className: 'text-end',
                  },
                  {
                    jsx: 'Start',
                  },
                  {
                    jsx: 'End',
                  },
                  {
                    jsx: 'Cliff Date',
                  },
                  {
                    jsx: 'Cliff Amount',
                  },
                  {
                    jsx: 'Initial Unlocked Amount',
                  },
                ]}>
                {activeFluxes.map((recipient, idx) => (
                  <tr
                    className={cn(
                      'table-row h-[4rem] text-base text-white hover:bg-[#2a2d38]/50 transition-colors',
                      idx % 2 === 0 ? 'bg-[#1a1b23]/50' : 'bg-[#2022289E]',
                      idx > 0 && 'border-t border-[#3a3d4a]/50'
                    )}
                    key={JSON.stringify({ ...recipient, idx })}>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max">
                          {recipient.isCompleted ? (
                            <div className="scale-75">
                              <TickInFilledCircle />
                            </div>
                          ) : (
                            <div className="scale-75">
                              <Loader className="animate-spin" />
                            </div>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max">{shortenEthAddress(recipient.address)}</span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem]">
                      <div className="flex items-center justify-end w-full h-full">
                        <span className="capitalize min-w-max">
                          {formatAmount(recipient.amount)} {tokenSymbol}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max">{dateFormatter(recipient.startDate)}</span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max">{dateFormatter(recipient.endDate)}</span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max">{dateFormatter(recipient.cliffDate)}</span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem]">
                      <div className="flex items-center justify-end w-full h-full">
                        <span className="capitalize min-w-max">
                          {formatAmount(recipient.cliffAmount)} {tokenSymbol}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem]">
                      <div className="flex items-center justify-end w-full h-full">
                        <span className="capitalize min-w-max">
                          {formatAmount(recipient.initialUnlockedAmount)} {tokenSymbol}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </CheckoutTable>
            </CheckoutVestingSchedule>
          </div>
        </div>
      </div>
    </>
  )
}

import type { Address } from 'viem'

import { CheckoutFeeStructure } from '../_components/CheckoutFeeStructure'
import { CheckoutTokenSummary } from '../_components/CheckoutTokenSummary'
import { useAirdropStore } from '../_hooks/useAirdropStore'
import { CheckoutDateInfo } from './CheckoutDateInfo'
import { CheckoutRecipientsTable } from './CheckoutRecipientsTable'

export function Checkout({
  chainId,
  vestingContract,
  wallet,
  tokenAddress,
}: {
  chainId: number
  vestingContract: string
  wallet: Address
  tokenAddress: Address
}) {
  const { activeRecipients, startDate, tokenSymbol, fluxSettings } = useAirdropStore((s) => ({
    activeRecipients: s.activeRecipients,
    startDate: s.startDate,
    tokenSymbol: s.tokenSymbol,
    fluxSettings: s.fluxSettings,
  }))

  const totalTokenAmount = activeRecipients.reduce((acc, { amount }) => acc + amount, 0)

  return (
    <>
      <div className="flex w-full flex-col items-start gap-x-[1rem] gap-y-[1.5em] mt-[2em]">
        {/* Combined token and fees section */}
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
          <CheckoutTokenSummary
            totalTokenAmount={totalTokenAmount}
            tokenSymbol={tokenSymbol}
            isFluxCancellable={fluxSettings.isFluxCancellable}
            isFluxTransferrable={fluxSettings.isFluxTransferrable}
          />
          <CheckoutFeeStructure
            vestingContract={vestingContract as Address}
            chainId={chainId}
            totalTokenAmount={totalTokenAmount}
            tokenSymbol={tokenSymbol}
            wallet={wallet}
            tokenAddress={tokenAddress}
          />
        </div>

        {/* Fee structure section */}
        <div className="w-full">
          <CheckoutDateInfo startDate={startDate} />
        </div>

        {/* Recipients table section */}
        <div className="flex w-full justify-between gap-y-[1rem]">
          <div className="flex w-full flex-col gap-y-[1rem]">
            <CheckoutRecipientsTable
              vestingContract={vestingContract as Address}
              chainId={chainId}
              recipients={activeRecipients}
            />
          </div>
        </div>
      </div>
    </>
  )
}

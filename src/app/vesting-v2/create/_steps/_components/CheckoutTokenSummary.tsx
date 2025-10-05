import { ConfigCard } from '../../../_flux/_components/VestingDetailsPopover'
import { formatTokenAmountWithDecimals } from '../../../_utils/utils'

interface CheckoutTokenSummaryProps {
  totalTokenAmount: number
  tokenSymbol: string | null
  isFluxCancellable: boolean
  isFluxTransferrable: boolean
}

export function CheckoutTokenSummary({
  totalTokenAmount,
  tokenSymbol,
  isFluxCancellable,
  isFluxTransferrable,
}: CheckoutTokenSummaryProps) {
  return (
    <div className="bg-[#1A1B23] border border-[#30333C] rounded-xl">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[#01EB5A] rounded-full"></div>
          <h3 className="text-[18px] font-bold text-[#F0F2FB]">Token Summary</h3>
        </div>

        <div className="space-y-3">
          <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between">
            <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
              Total Token Amount
            </span>
            <div className="mt-1">
              <span className="text-sm font-semibold text-white">
                {formatTokenAmountWithDecimals(totalTokenAmount)} {tokenSymbol || ''}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ConfigCard label="Cancellable" isEnabled={isFluxCancellable} className="h-[72px]" />
            <ConfigCard
              label="Transferrable"
              isEnabled={isFluxTransferrable}
              className="h-[72px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

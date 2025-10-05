import type { Address } from 'viem'

import { formatAmount } from '../../../_utils/utils'
import { useAirdropStore } from '../_hooks/useAirdropStore'
import { useVestingFees } from '../_hooks/useVestingFees'
import { useVestingFeesExemption } from '../_hooks/useVestingFeesExemption'

interface CheckoutFeeStructureProps {
  vestingContract: Address
  chainId: number
  totalTokenAmount: number
  tokenSymbol: string | null
  tokenAddress: Address
  wallet: Address
}

export function CheckoutFeeStructure({
  vestingContract,
  chainId,
  totalTokenAmount,
  tokenSymbol,
  tokenAddress,
  wallet,
}: CheckoutFeeStructureProps) {
  const { feeData, nativeCurrency, nativeCurrencyDecimals } = useVestingFees(
    vestingContract,
    chainId
  )

  const { feeExemptionData } = useVestingFeesExemption(
    vestingContract,
    chainId,
    wallet,
    tokenAddress
  )

  const store = useAirdropStore((s) => ({
    emissionType: s.emissionType,
    distributionType: s.distributionType,
  }))

  let percentageFee = feeData?.[0]?.result ? Number(feeData[0].result) / 100 : 0

  let flatFee = feeData?.[1]?.result ? Number(feeData[1].result) / 10 ** nativeCurrencyDecimals : 0

  let tokenFeeAmount = (percentageFee / 100) * totalTokenAmount

  const isFeeExempt = feeExemptionData?.[0]?.result || feeExemptionData?.[1]?.result

  let currentEmissionType: 'scheduled' | 'unlockInSteps' | 'linear' | 'linearBulk' =
    store.emissionType.value
  if (store.distributionType.title === 'Custom' && currentEmissionType === 'linear') {
    currentEmissionType = 'linearBulk'
  }

  if (isFeeExempt) {
    percentageFee = 0
    flatFee = 0
    if (currentEmissionType == 'linearBulk' && feeExemptionData?.[0]?.result) {
      flatFee = 0
    }
    if (currentEmissionType == 'linearBulk' && !feeExemptionData?.[0]?.result) {
      flatFee = feeData?.[1]?.result ? Number(feeData[1].result) / 10 ** nativeCurrencyDecimals : 0
    }
    tokenFeeAmount = 0
  }

  return (
    <div className="bg-[#1A1B23] border border-[#30333C] rounded-xl">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[#01EB5A] rounded-full"></div>
          <h3 className="text-[18px] font-bold text-[#F0F2FB]">Fee Structure</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between">
            <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
              Percentage Fee
            </span>
            <div className="mt-1">
              <span className="text-sm font-semibold text-white">
                {formatAmount(percentageFee)}%
                {tokenFeeAmount == 0 && (
                  <span className="text-xs text-[#01EB5A] ml-1">(Fee Exempt)</span>
                )}
              </span>
            </div>
          </div>

          <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between">
            <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
              Flat Fee
            </span>
            <div className="mt-1">
              <span className="text-sm font-semibold text-white">
                {formatAmount(flatFee)} {nativeCurrency}
                {flatFee == 0 && <span className="text-xs text-[#01EB5A] ml-1">(Fee Exempt)</span>}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between">
          <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
            Total Fees
          </span>
          <div className="mt-1">
            <span className="text-sm font-semibold text-white">
              {formatAmount(tokenFeeAmount)} {tokenSymbol || 'tokens'} + {formatAmount(flatFee)}{' '}
              {nativeCurrency}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

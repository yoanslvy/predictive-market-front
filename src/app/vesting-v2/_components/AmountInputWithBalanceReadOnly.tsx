import { cn } from '@/src/src/utils'

import { formatAmount } from '../_utils/utils'

export function AmountInputWithBalanceReadOnly({
  hasInsufficientFunds = false,
  balance,
  tokenSymbol,
  tokenPriceUsd,
}: {
  hasInsufficientFunds?: boolean
  tokenPriceUsd: number | null
  balance: number
  tokenSymbol: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-y-[1rem] rounded-xl border  px-[16px] py-[12px] text-[16px] text-white ',
        hasInsufficientFunds ? 'border-red-500' : 'border-[#2C2F3A]'
      )}>
      <span className={cn('text-[16px]', balance ? 'text-white' : 'text-red-500')}>
        {formatAmount(balance)} {tokenSymbol}{' '}
        {tokenPriceUsd ? '~ $' + formatAmount((tokenPriceUsd ?? 0) * (balance ?? 0)) : ''}
      </span>
    </div>
  )
}

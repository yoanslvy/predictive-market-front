import { Skeleton } from '@mantine/core'
import type { QueryStatus } from '@tanstack/react-query'

import type { ChangeEvent } from 'react'


import { formatAmount } from '../_utils/utils'
import { cn } from '@/src/src/utils'
import { focusWithinInput } from '../_utils/focusInput'

export function NumberInputWithBalanceAndQueryStatus({
  hasInsufficientFunds = false,
  amount,
  balance,
  tokenSymbol,
  onChange,
  mintQueryStatus,
}: {
  mintQueryStatus: QueryStatus
  hasInsufficientFunds?: boolean
  balance: number
  tokenSymbol: string
  amount: number | null
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-y-[1rem] rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] py-[12px] text-[16px] text-white',
        hasInsufficientFunds ? 'border-red-500' : 'border-[#2C2F3A]',
        focusWithinInput
      )}>
      <div className="text-[#757A8B85]">
        {mintQueryStatus === 'success' ? (
          <span>
            Balance: {formatAmount(balance)} {tokenSymbol}
          </span>
        ) : (
          <span className="flex items-center gap-x-[0.5rem]">
            Balance:{' '}
            <Skeleton
              height={'16'}
              width={140}
              className="before:bg-steel-80 after:bg-[#757A8B85]"
            />
          </span>
        )}
      </div>
      <input
        className="m-0 border-transparent bg-transparent p-0 text-[20px] text-white outline outline-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={amount ?? ''}
        onChange={onChange}
        type="number"
        placeholder="Enter amount"
      />
    </div>
  )
}

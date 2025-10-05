import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Tooltip } from '@mantine/core'

import { useState, type ChangeEvent } from 'react'

import { cn } from '@/src/src/utils'

import { focusWithinInput } from '../_utils/focusInput'

interface AmountInputWithMaxAmountProps {
  hasInsufficientFunds?: boolean
  tokenPriceUsd: number | null
  maxAmount?: number
  tokenSymbol: string
  amount: number | null
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  tooltip?: string
  maxTokenDecimals?: number
}

const formatAmount = (value: number): string => {
  return value.toLocaleString('en', {
    currencyDisplay: 'symbol',
  })
}

const formatUsdValue = (tokenAmount: number, price: number): string => {
  return (price * tokenAmount).toLocaleString('en', {
    currencyDisplay: 'symbol',
  })
}

export function AmountInputWithMaxAmount({
  hasInsufficientFunds = false,
  amount,
  maxAmount,
  tokenSymbol,
  onChange,
  tokenPriceUsd,
  placeholder = 'Enter amount',
  className,
  tooltip,
  maxTokenDecimals,
}: AmountInputWithMaxAmountProps) {
  const hasMaxAmount = typeof maxAmount === 'number'

  const usdValue =
    hasMaxAmount && tokenPriceUsd ? `~ $${formatUsdValue(maxAmount, tokenPriceUsd)}` : ''

  const [inputValue, setInputValue] = useState<string>(amount?.toString() || '')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    // Allow empty value
    if (val === '') {
      setInputValue('')
      onChange?.('')
      return
    }

    const regex = /^-?\d*\.?\d*$/
    if (!regex.test(val)) return

    const parts = val.split('.')
    if (typeof maxTokenDecimals === 'number' && parts[1] && parts[1].length > maxTokenDecimals)
      return

    if (typeof maxAmount === 'number' && Number(val) > maxAmount) {
      setInputValue(maxAmount.toString())
      onChange?.(maxAmount.toString())
      return
    }

    setInputValue(val)
    onChange?.(val)
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-y-[1rem] rounded-xl border bg-[#202228] px-[16px] py-[12px] text-[16px] text-white hover:bg-[#26282E] transition-all',
        hasInsufficientFunds ? 'border-red-500' : 'border-[#2C2F3A]',
        focusWithinInput,
        className
      )}>
      {(tooltip || hasMaxAmount) && (
        <div className="flex items-center gap-[0.5em]">
          {tooltip && (
            <div>
              <Tooltip
                label={tooltip}
                position="bottom"
                withArrow
                multiline
                classNames={{
                  tooltip: 'bg-[#2A2C33] text-[#F0F2FB] border border-[#757A8B]/20 max-w-[250px]',
                }}>
                <div className="cursor-help text-[#757A8B] hover:text-[#F0F2FB] transition-colors text-[14px]">
                  <QuestionMarkCircleIcon width={20} height={20} />
                </div>
              </Tooltip>
            </div>
          )}
          {hasMaxAmount && (
            <div className="text-[#757A8B] text-[14px]">
              Remaining: {formatAmount(maxAmount)} {tokenSymbol} {usdValue}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-x-[12px]">
        <input
          className="flex-1 m-0 border-transparent bg-transparent p-0 text-[16px] text-white outline outline-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          onChange={handleChange}
          placeholder={placeholder}
          type="text"
          inputMode="decimal"
          value={inputValue}
        />
        {hasMaxAmount && (
          <button
            className="text-[#06c68d] hover:text-[#06c68d]/80 bg-[#2C2F3A] hover:bg-[#2C2F3A]/80 rounded-lg px-[12px] py-[6px] text-[14px] font-medium transition-colors"
            onClick={() => {
              setInputValue(maxAmount.toString())
              onChange?.(maxAmount.toString())
            }}
            type="button"
            aria-label={`Set maximum amount of ${formatAmount(maxAmount)} ${tokenSymbol}`}>
            Max
          </button>
        )}
      </div>
    </div>
  )
}

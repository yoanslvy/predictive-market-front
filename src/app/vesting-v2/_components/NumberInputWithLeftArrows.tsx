import { Dispatch, SetStateAction } from 'react'

import { cn } from '@/src/src/utils'

import { focusWithinInput, focusWithinInputRed } from '../_utils/focusInput'

export function NumberInputWithLeftArrows({
  value,
  setValue,
  placeholder,
  min,
  max,
}: {
  value: number | null
  setValue: Dispatch<SetStateAction<number | null>>
  placeholder: string
  min?: number
  max?: number
}) {
  return (
    <div
      className={cn(
        'flex w-full h-[48px] rounded-xl border border-[#2C2F3A] bg-[#202228] text-white overflow-hidden hover:bg-[#26282E] transition-all',
        (min && value && value < min) || (max && value && value > max)
          ? [...focusWithinInputRed, 'border-red-500']
          : focusWithinInput
      )}>
      <div className="flex flex-col justify-center border-r border-[#2C2F3A] px-2">
        <button
          type="button"
          className="text-[#757A8BB8] hover:text-white transition-colors h-[24px] px-2 flex items-center justify-center"
          onClick={() => {
            if (max && value && value >= max) return
            if (!value && min) return setValue(min)

            setValue((prev) => (prev || 0) + 1)
          }}>
          ▲
        </button>
        <button
          type="button"
          className="text-[#757A8BB8] hover:text-white transition-colors h-[24px] px-2 flex items-center justify-center"
          onClick={() => {
            if (min && value && value <= min) return

            setValue((prev) => (prev && prev > 1 ? prev - 1 : 1))
          }}>
          ▼
        </button>
      </div>
      <div className="flex items-center flex-1">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => {
            const num = e.currentTarget.value

            setValue(num ? Number(num) : null)
          }}
          className="m-0 h-full w-full border-transparent bg-transparent px-[16px] text-[16px] text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder={placeholder}
          min={min || 0}
          max={max || undefined}
        />
      </div>
    </div>
  )
}

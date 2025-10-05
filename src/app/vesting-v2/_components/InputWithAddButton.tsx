import type { ChangeEvent } from 'react'

import { cn } from '@/src/src/utils'

import { focusWithinInput } from '../_utils/focusInput'

export function InputWithAddButton({
  onInputChange,
  onAddClick,
}: {
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  onAddClick: () => void
}) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-x-[1rem] rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] py-[12px] text-white hover:bg-[#26282E] transition-all',
        focusWithinInput
      )}>
      <input
        onChange={onInputChange}
        className="m-0 w-full border-transparent bg-transparent p-0 text-[16px] text-white outline outline-transparent"
        placeholder={'Enter wallet address'}
      />
      <button
        type="button"
        className="h-fit cursor-pointer rounded-full text-[14px] bg-white px-[12px] py-[4px] text-black"
        onClick={onAddClick}>
        Add
      </button>
    </div>
  )
}

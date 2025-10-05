import type { ChangeEvent } from 'react'

import { cn } from '@/src/src/utils'

import { focusWithinInput } from '../_utils/focusInput'

export function RecipientAddressInput({
  onChange,
  recipient,
  placeholder = 'Recipient Address',
}: {
  recipient: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}) {
  return (
    <div
      className={cn(
        'flex w-full gap-x-[1rem] rounded-lg border border-[#2C2F3A] bg-[#202228] px-[16px] py-[12px] text-[16px] text-white h-[48px] hover:bg-[#26282E] transition-all',
        focusWithinInput
      )}>
      <input
        value={recipient}
        onChange={onChange}
        className="m-0 w-full border-transparent bg-transparent p-0 text-[16px] text-white outline outline-transparent"
        placeholder={placeholder}
      />
    </div>
  )
}

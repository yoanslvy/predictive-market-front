'use client'

import type { Dispatch, SetStateAction } from 'react'

import { cn } from '@/src/src/utils'

import { Search } from '../_svg/Search'
import { focusWithinInput } from '../_utils/focusInput'

export function SearchInput({
  search,
  setSearch,
  placeholder = 'Search by name or tag',
}: {
  search?: string | null
  setSearch?: Dispatch<SetStateAction<string | null>>
  placeholder?: string
}) {
  return (
    <div
      className={cn(
        'flex sm:max-w-[412px] items-center gap-x-[16px] rounded-full border border-[#202228] bg-transparent px-[16px] py-[12px] transition-all',
        focusWithinInput
      )}>
      <div className="shrink-0 w-[16px] h-[16px] flex items-center justify-center">
        <Search />
      </div>
      <input
        value={search ?? undefined}
        placeholder={placeholder}
        onChange={(e) => setSearch?.(e.currentTarget.value.toLowerCase())}
        className={
          'm-0 border-transparent bg-transparent p-0 text-[16px] text-white outline outline-transparent'
        }
      />
    </div>
  )
}

import { Skeleton } from '@mantine/core'

import type { ChangeEvent } from 'react'

import { cn } from '@/src/src/utils'
import { focusWithinInput } from '../_utils/focusInput'

export function TokenAddressInputWithQueryStatus({
  isLoading,
  isError,
  tokenAddress,
  onChange,
  tokenSymbol,
  mintLogoUri,
}: {
  isLoading: boolean
  isError: boolean
  tokenAddress: string | null
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  tokenSymbol: string | null
  mintLogoUri: string | null
}) {
  return (
    <div
      className={cn(
        'flex gap-x-[1rem] rounded-lg border border-[#2C2F3A] bg-[#202228] px-[16px] py-[12px] text-[16px] text-white hover:bg-[#26282E] transition-all',
        !isLoading && !isError && tokenAddress && 'border-green-500',
        isError && 'border-red-500',
        focusWithinInput
      )}>
      <input
        value={tokenAddress ?? ''}
        onChange={onChange}
        className="m-0 h-[2.5em] w-full border-transparent bg-transparent px-0 pb-0 text-[16px] text-white outline outline-transparent ring-transparent"
        placeholder={'Token Address'}
      />
      {!isLoading && !isError ? (
        <div className="flex min-w-fit items-center gap-x-[1rem]">
          <p className="text-[16px] text-[#FFFFFF4D]">{tokenSymbol}</p>
          {mintLogoUri && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mintLogoUri} alt={`${tokenSymbol} logo`} className="size-10 rounded-xl" />
          )}
        </div>
      ) : isError ? (
        <div className="inline-block items-center gap-x-[1rem]">
          <p className="text-[12px] text-red-500">Invalid Address</p>
        </div>
      ) : (
        <>
          {tokenAddress ? (
            <div className="flex items-center justify-center gap-x-[1rem]">
              <Skeleton
                height={'30'}
                width={60}
                className="before:bg-steel-80 after:bg-[#757A8B85]"
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

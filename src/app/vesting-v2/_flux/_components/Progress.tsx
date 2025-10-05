'use client'

import { VestingByIdQuery } from '@/.graphclient'
import { RingProgress } from '@mantine/core'

import { StatusBadge } from '../../dashboard/_modules/FluxesTable/StatusBadge'
import { ClaimButton } from './ClaimButton'
import { DetailCard } from './VestingDetailsPopover'

const formatToThreeDecimals = (num: number): string => {
  return Number(num.toFixed(3)).toString()
}

export function Progress({
  vesting,
  wallet,
}: {
  vesting: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  wallet?: string
}) {
  const status = vesting.cancelDate ? 'stopped' : null
  const claimProgress = Math.min(1, Math.max(0, vesting.amountReleasedBD / vesting.amountBD))
  const claimableAmount = Math.max(0, vesting.amountWithdrawableBD)
  const unlockedAmount = Math.max(0, claimableAmount + vesting.amountReleasedBD)
  const unlockProgress = Math.min(1, Math.max(0, unlockedAmount / vesting.amountBD))

  return (
    <div className="h-full w-full rounded-xl bg-[#17181C] px-[34px] py-[32px]">
      <div className="flex h-full flex-col items-start justify-between gap-[0.6rem]">
        <div className="flex items-center gap-[0.6rem]">
          <p className="text-[24px] text-[#F0F2FB] font-bold">Progress</p>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-start flex-col gap-[1em] justify-between w-full h-full ">
          <div className="w-full h-full  bg-[#17181C] p-4">
            <div className="grid w-full grid-cols-1 gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex justify-center lg:justify-start">
                  <RingProgress
                    sections={[
                      {
                        value: claimProgress * 100,
                        color: '#2FFA81',
                        tooltip: `Claimed: ${formatToThreeDecimals(claimProgress * 100)}%`,
                      },
                      {
                        value: (unlockProgress - claimProgress) * 100,
                        color: '#01EB5A',
                        tooltip: `Unlocked: ${formatToThreeDecimals(unlockProgress * 100)}%`,
                      },
                    ]}
                    rootColor="#1a2426"
                    thickness={8}
                    size={120}
                    label={
                      <div className="flex flex-col items-center">
                        <div className="text-[14px] font-bold text-[#01EB5A]">
                          {formatToThreeDecimals(unlockProgress * 100)}%
                        </div>
                        <div className="text-[10px] text-[#F0F2FB] opacity-70 font-medium">
                          Unlocked
                        </div>
                      </div>
                    }
                  />
                </div>

                <div className="flex justify-center w-full lg:justify-end">
                  <DetailCard label="Available to Claim" className="w-full max-w-[320px] h-full">
                    <div className="flex items-center w-full h-full gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#01EB5A]"></div>
                      <p className="text-[16px] font-bold text-[#F0F2FB]">
                        {formatToThreeDecimals(claimableAmount)} {vesting.tokenVested.symbol}
                      </p>
                    </div>
                  </DetailCard>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailCard label={`Unlocked: ${formatToThreeDecimals(unlockProgress * 100)}%`}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#01EB5A]"></div>
                    <p className="text-[16px] font-bold text-[#F0F2FB]">
                      {formatToThreeDecimals(unlockedAmount)} {vesting.tokenVested.symbol}
                    </p>
                  </div>
                </DetailCard>

                <DetailCard label={`Claimed: ${formatToThreeDecimals(claimProgress * 100)}%`}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#01EB5A]"></div>
                    <p className="text-[16px] font-bold text-[#F0F2FB]">
                      {formatToThreeDecimals(vesting.amountReleasedBD)} {vesting.tokenVested.symbol}
                    </p>
                  </div>
                </DetailCard>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full gap-[1em] flex-wrap">
            <ClaimButton wallet={wallet} fluxData={vesting} />
          </div>
        </div>
      </div>
    </div>
  )
}

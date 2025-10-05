'use client'

import { VestingByIdQuery } from '@/.graphclient'
import { Check, X } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/src/src/utils'

import { shortenEthAddress } from '@/src/app/minter/global'
import { ChainsData } from '@/src/components/modules/ChainAsset/constants'
import { chainMetadata } from '@/src/utils/global'

import { dateFormatter, emissionTypeMapper, formatAmount } from '../../_utils/utils'

type DetailCardProps = {
  label: string
  children: React.ReactNode
  className?: string
}

export function DetailCard({ label, children, className }: DetailCardProps) {
  return (
    <div
      className={cn(
        'bg-[#252831] rounded-lg p-3 border border-[#30333C] min-h-[72px] flex flex-col justify-between',
        className
      )}>
      <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">{label}</span>
      <div className="mt-1">{children}</div>
    </div>
  )
}

type ConfigCardProps = {
  label: string
  isEnabled: boolean
  className?: string
}

export function ConfigCard({ label, isEnabled, className }: ConfigCardProps) {
  return (
    <div
      className={cn(
        'bg-[#252831] rounded-lg p-2 border border-[#30333C] text-center',
        className
      )}>
      <div className="flex flex-col items-center justify-center h-full gap-1">
        <span className="text-[#757A8B] text-xs uppercase tracking-wide">{label}</span>
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1A1B23]">
          {isEnabled ? (
            <Check className="w-3 h-3 text-[#01EB5A]" />
          ) : (
            <X className="w-3 h-3 text-red-400" />
          )}
        </div>
      </div>
    </div>
  )
}

type VestingDetailsPopoverProps = {
  data: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  beneficiaryAddress: string
  isStopped: boolean
  unlockProgress: number
  emissionType: string
  unlocksLeft: number
  nextUnlockDate: string | null
}

export function VestingDetailsPopover({
  data,
  beneficiaryAddress,
  isStopped,
  unlockProgress,
  emissionType,
  nextUnlockDate,
  unlocksLeft,
}: VestingDetailsPopoverProps) {
  const shouldShowNextUnlockAndUnlocksLeft =
    data.vestingEmissionType === 'SCHEDULED' ||
    data.vestingEmissionType === 'UNLOCK_IN_STEPS' ||
    data.vestingEmissionType === 'MONTHLY_UNLOCKS'
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-[#01EB5A] rounded-full"></div>
        <h3 className="text-[18px] font-bold text-[#F0F2FB]">Vesting Details</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-3">
          <DetailCard label="Emission Type">
            <span className="text-sm font-semibold text-white">
              {emissionTypeMapper[emissionType as keyof typeof emissionTypeMapper] || 'Unknown'}
            </span>
          </DetailCard>

          <DetailCard label="Creator">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#01EB5A] text-sm font-semibold underline hover:text-[#01EB5A80] transition-colors"
              href={`${chainMetadata[data.chainId].explorer.url}/address/${
                data.creator.walletAddress
              }`}>
              {shortenEthAddress(data.creator.walletAddress)}
            </Link>
          </DetailCard>

          <DetailCard label="Recipient">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#01EB5A] text-sm font-semibold underline hover:text-[#01EB5A80] transition-colors"
              href={`${chainMetadata[data.chainId].explorer.url}/address/${beneficiaryAddress}`}>
              {shortenEthAddress(beneficiaryAddress)}
            </Link>
          </DetailCard>

          <DetailCard label="Token Symbol">
            <span className="text-sm font-semibold text-white">{data.tokenVested.symbol}</span>
          </DetailCard>

          {shouldShowNextUnlockAndUnlocksLeft && (
            <DetailCard label="Next Unlock Date">
              <span className="text-sm font-semibold text-white">
                {!nextUnlockDate ? '-' : dateFormatter(new Date(1000 * Number(nextUnlockDate)))}
              </span>
            </DetailCard>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <DetailCard label="Vested Amount">
            <span className="text-sm font-semibold text-white">
              {formatAmount(data.amountBD)} {data.tokenVested.symbol}
            </span>
          </DetailCard>

          <DetailCard label="Token Address">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#01EB5A] text-sm font-semibold underline hover:text-[#01EB5A80] transition-colors"
              href={`${chainMetadata[data.chainId].explorer.url}/token/${
                data.tokenVested.tokenAddress
              }`}>
              {shortenEthAddress(data.tokenVested.tokenAddress)}
            </Link>
          </DetailCard>

          <DetailCard label="Chain">
            <div className="flex items-center gap-2">
              <div className="[&>svg]:size-[1.6em] [&>img]:size-[1.6em] [&>img]:rounded-full [&>svg]:rounded-full">
                {ChainsData[data.chainId].logo}
              </div>
              <p className="text-sm font-semibold text-white">
                {ChainsData[data.chainId].displayName}
              </p>
            </div>
          </DetailCard>

          <DetailCard label="Status & Progress">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isStopped
                      ? 'bg-red-400'
                      : unlockProgress >= 1
                        ? 'bg-[#01EB5A]'
                        : 'bg-orange-400'
                  }`}></div>
                <span
                  className={`text-xs font-semibold ${
                    isStopped
                      ? 'text-red-400'
                      : unlockProgress >= 1
                        ? 'text-[#01EB5A]'
                        : 'text-orange-400'
                  }`}>
                  {isStopped ? 'Stopped' : unlockProgress >= 1 ? 'Completed' : 'Active'}
                </span>
                <span className="ml-auto text-xs font-semibold text-white">
                  {Math.round(unlockProgress * 100)}%
                </span>
              </div>
              <div className="flex-1 bg-[#1A1B23] rounded-full h-1.5">
                <div
                  className="bg-[#01EB5A] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(unlockProgress * 100)}%` }}></div>
              </div>
            </div>
          </DetailCard>

          {shouldShowNextUnlockAndUnlocksLeft && (
            <DetailCard label="Unlocks Left">
              <span className="text-sm font-semibold text-white">{unlocksLeft}</span>
            </DetailCard>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-[#30333C]">
        <h4 className="text-[#F0F2FB] text-sm font-semibold mb-3">Configuration</h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ConfigCard label="Can be transferred" isEnabled={data.isTransferable} />
          <ConfigCard label="Can Be Topped Up" isEnabled={data.isTopable} />
          <ConfigCard label="Can be Cancelled" isEnabled={data.isSoft} />
        </div>
      </div>
    </div>
  )
}

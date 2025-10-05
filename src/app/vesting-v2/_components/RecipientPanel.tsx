import { Divider } from '@mantine/core'

import { dateFormatter, formatAmount } from '../_utils/utils'
import { Recipient } from '../create/_steps/_hooks/useAirdropStore'
import {
  LinearFlux,
  UnlockCliffFlux,
  MonthlyUnlocksFlux,
  StepsFlux,
  ExponentialFlux,
  CliffFlux,
  TimelockFlux,
} from '../create/_steps/_hooks/useVestingStore'

export type RecipientPanelProps<TRecipient> = {
  recipient: TRecipient
  tokenPriceUsd: number
  tokenSymbol: string
}

export function RecipientPanelLinear({
  recipient,
  tokenPriceUsd,
  tokenSymbol,
}: RecipientPanelProps<LinearFlux | UnlockCliffFlux | ExponentialFlux>) {
  return (
    <div className="mt-[0.7em] w-full">
      <div className="flex items-center gap-x-[0.5rem]">
        <span className="text-white">{formatAmount(recipient.amount)}</span>
        <span className="text-[#757A8B80]">{tokenSymbol}</span>
      </div>
      <span className="text-[#757A8B]">${formatAmount(recipient.amount * tokenPriceUsd)}</span>
      <Divider className="my-[1em] w-full" color="#202228" />
      <div className="flex items-start justify-between w-full">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Start</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.startDate)}</p>
        </div>
        {'endDate' in recipient && (
          <div>
            <p className="text-[13px] text-[#757A8B80]">End</p>
            <p className="text-[14px] text-white">{dateFormatter(recipient.endDate)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function RecipientPanelScheduled({
  recipient,
  tokenPriceUsd,
  tokenSymbol,
}: RecipientPanelProps<Recipient & { startDate: Date; endDate: Date }>) {
  return (
    <div className="mt-[0.7em] w-full">
      <div className="flex items-center gap-x-[0.5rem]">
        <span className="text-white">{formatAmount(recipient.amount)}</span>
        <span className="text-[#757A8B80]">{tokenSymbol}</span>
      </div>
      <span className="text-[#757A8B]">${formatAmount(recipient.amount * tokenPriceUsd)}</span>
      <Divider className="my-[1em] w-full" color="#202228" />
      <div className="flex items-start justify-between w-full">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Start</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.startDate)}</p>
        </div>
        {'endDate' in recipient && recipient.endDate && (
          <div>
            <p className="text-[13px] text-[#757A8B80]">End</p>
            <p className="text-[14px] text-white">{dateFormatter(recipient.endDate)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function RecipientPanelMonthlyUnlocks({
  recipient,
  tokenPriceUsd,
  tokenSymbol,
}: RecipientPanelProps<MonthlyUnlocksFlux>) {
  return (
    <div className="mt-[0.7em] w-full">
      <div className="flex items-center gap-x-[0.5rem]">
        <span className="text-white">{formatAmount(recipient.amount)}</span>
        <span className="text-[#757A8B80]">{tokenSymbol}</span>
      </div>
      <span className="text-[#757A8B]">${formatAmount(recipient.amount * tokenPriceUsd)}</span>
      <Divider className="my-[1em] w-full" color="#202228" />
      <div className="flex items-start justify-between w-full">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Start</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.startDate)}</p>
        </div>
        <div>
          <p className="text-[13px] text-[#757A8B80]">Months</p>
          <p className="text-[14px] text-white">{recipient.months}</p>
        </div>
      </div>
    </div>
  )
}

export function RecipientPanelSteps({
  recipient,
  tokenPriceUsd,
  tokenSymbol,
}: RecipientPanelProps<StepsFlux>) {
  return (
    <div className="mt-[0.7em] w-full">
      <div className="flex items-center gap-x-[0.5rem]">
        <span className="text-white">{formatAmount(recipient.amount)}</span>
        <span className="text-[#757A8B80]">{tokenSymbol}</span>
      </div>
      <span className="text-[#757A8B]">${formatAmount(recipient.amount * tokenPriceUsd)}</span>
      <Divider className="my-[1em] w-full" color="#202228" />
      <div className="flex items-start justify-between w-full">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Start</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.startDate)}</p>
        </div>
        <div>
          <p className="text-[13px] text-[#757A8B80]">Steps</p>
          <p className="text-[14px] text-white">{recipient.steps}</p>
        </div>
      </div>
      <div className="flex items-start justify-between w-full">
        <div>
          <p className="text-[13px] text-[#757A8B80]">End</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.endDate)}</p>
        </div>
      </div>
    </div>
  )
}

export function RecipientPanelCliff({
  recipient,
  tokenPriceUsd,
  tokenSymbol,
}: RecipientPanelProps<CliffFlux>) {
  return (
    <div className="mt-[0.7em] w-full">
      <div className="flex items-center gap-x-[0.5rem]">
        <span className="text-white">{formatAmount(recipient.amount)}</span>
        <span className="text-[#757A8B80]">{tokenSymbol}</span>
      </div>
      <span className="text-[#757A8B]">${formatAmount(recipient.amount * tokenPriceUsd)}</span>
      <Divider className="my-[1em] w-full" color="#202228" />
      <div className="grid w-full grid-cols-2">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Start</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.cliffDate)}</p>
        </div>
        <div>
          <p className="text-[13px] text-[#757A8B80]">End</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.endDate)}</p>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 mt-[1em]">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Cliff Amount</p>
          <p className="text-[14px] text-white">
            {recipient.cliffAmount} {tokenSymbol}
          </p>
        </div>
      </div>
    </div>
  )
}

export function RecipientPanelUnlockCliff({
  recipient,
  tokenPriceUsd,
  tokenSymbol,
}: RecipientPanelProps<UnlockCliffFlux>) {
  return (
    <div className="mt-[0.7em] w-full">
      <div className="flex items-center gap-x-[0.5rem]">
        <span className="text-white">{formatAmount(recipient.amount)}</span>
        <span className="text-[#757A8B80]">{tokenSymbol}</span>
      </div>
      <span className="text-[#757A8B]">${formatAmount(recipient.amount * tokenPriceUsd)}</span>
      <Divider className="my-[1em] w-full" color="#202228" />
      <div className="grid w-full grid-cols-2">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Start</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.startDate)}</p>
        </div>
        <div>
          <p className="text-[13px] text-[#757A8B80]">End</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.endDate)}</p>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 mt-[1em]">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Cliff Date</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.cliffDate)}</p>
        </div>
        <div>
          <p className="text-[13px] text-[#757A8B80]">Cliff Amount</p>
          <p className="text-[14px] text-white">
            {formatAmount(recipient.cliffAmount)} {tokenSymbol}
          </p>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 mt-[1em]">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Initial Unlocked Amount</p>
          <p className="text-[14px] text-white">
            {formatAmount(recipient.initialUnlockedAmount)} {tokenSymbol}
          </p>
        </div>
      </div>
    </div>
  )
}

export function RecipientPanelTimelock({
  recipient,
  tokenPriceUsd,
  tokenSymbol,
}: RecipientPanelProps<TimelockFlux>) {
  return (
    <div className="mt-[0.7em] w-full">
      <div className="flex items-center gap-x-[0.5rem]">
        <span className="text-white">{formatAmount(recipient.amount)}</span>
        <span className="text-[#757A8B80]">{tokenSymbol}</span>
      </div>
      <span className="text-[#757A8B]">${formatAmount(recipient.amount * tokenPriceUsd)}</span>
      <Divider className="my-[1em] w-full" color="#202228" />
      <div className="flex items-start justify-between w-full">
        <div>
          <p className="text-[13px] text-[#757A8B80]">Unlock Date</p>
          <p className="text-[14px] text-white">{dateFormatter(recipient.unlockDate)}</p>
        </div>
      </div>
    </div>
  )
}

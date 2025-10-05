import { useState } from 'react'

import { Address } from 'viem'

import { useAccount } from 'wagmi'

import { shortenEthAddress } from '@/src/app/minter/global'
import LogoSpinner from '@/src/components/spinners/logoSpinnerAnimated'
import { cn } from '@/src/src/utils'

import { Loader } from '../../../_svg/Loader'
import { TickInFilledCircle } from '../../../_svg/TickInFilledCircle'
import { useAirdropApprove } from '../_hooks/useAirdropApprove'
import { useAirdropBatches } from '../_hooks/useAirdropBatches'
import { CheckoutTable } from '../vesting/CheckoutTable'

interface Recipient {
  address: string
  amount: number
  isCompleted: boolean
}

interface CheckoutRecipientsTableProps {
  recipients: Recipient[]
  stepsPerRecipient?: number // default to 1 if not provided
  vestingContract: Address
  chainId: number
}

export function CheckoutRecipientsTable({
  recipients,
  chainId,
  vestingContract,
}: CheckoutRecipientsTableProps) {
  const [activeBatch, setActiveBatch] = useState(0)
  const { address } = useAccount()

  const { airdropApproveQuery } = useAirdropApprove({
    vestingContract,
    chainId,
    openModal: () => {}, // No modal needed here, just for the hook to work
    wallet: address!,
  })

  const { airdropBatchesQuery } = useAirdropBatches({
    recipients,
    vestingContract,
    chainId,
    enabled: airdropApproveQuery.data === false,
    wallet: address as Address,
  })

  const { data: batches, status } = airdropBatchesQuery

  const currentBatch = batches?.[activeBatch] || []

  return (
    <div className="bg-[#1A1B23] border border-[#30333C] rounded-xl">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[#01EB5A] rounded-full"></div>
          <h3 className="text-[18px] font-bold text-[#F0F2FB]">
            Recipients ({recipients.length} Total)
          </h3>
        </div>

        {/* Batch tabs */}
        {(batches ?? []).length > 1 && airdropApproveQuery.data === false && (
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto">
              {(batches ?? []).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBatch(idx)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                    activeBatch === idx
                      ? 'bg-[#01EB5A] text-black'
                      : 'bg-[#30333C] text-[#F0F2FB] hover:bg-[#3a3d4a]'
                  )}>
                  Batch {idx + 1} ({(batches ?? [])[idx].length})
                </button>
              ))}
            </div>
            <div className="mt-2 text-sm text-[#8B949E]">
              Showing batch {activeBatch + 1} of {(batches ?? []).length}({currentBatch.length}{' '}
              recipients)
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-[#30333C]">
          {status === 'success' && airdropApproveQuery.data === false && (
            <CheckoutTable
              headers={[
                { jsx: '#' },
                { jsx: '' },
                { jsx: 'Recipient' },
                { jsx: 'Amount', className: 'text-end' },
              ]}>
              {currentBatch.map((recipient, idx) => {
                const globalIndex = activeBatch * currentBatch.length + idx + 1
                const isCompleted = !!recipients.find(
                  (e) => e.address === recipient.address && e.amount === recipient.amount
                )?.isCompleted
                return (
                  <tr
                    className={cn(
                      'table-row h-[4rem] text-base text-white hover:bg-[#2a2d38]/50 transition-colors',
                      idx % 2 === 0 ? 'bg-[#1a1b23]/50' : 'bg-[#2022289E]',
                      idx > 0 && 'border-t border-[#3a3d4a]/50'
                    )}
                    key={recipient.address}>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max text-[#8B949E] text-sm font-mono">
                          {globalIndex}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max">
                          {isCompleted ? (
                            <div className="scale-75">
                              <TickInFilledCircle />
                            </div>
                          ) : (
                            <div className="scale-75">
                              <Loader className="animate-spin" />
                            </div>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max">{shortenEthAddress(recipient.address)}</span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem]">
                      <div className="flex items-center justify-end w-full h-full">
                        <span className="capitalize min-w-max">{recipient.amount}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </CheckoutTable>
          )}
          {airdropApproveQuery.data && (
            <CheckoutTable
              headers={[
                { jsx: '#' },
                { jsx: '' },
                { jsx: 'Recipient' },
                { jsx: 'Amount', className: 'text-end' },
              ]}>
              {recipients.map((recipient, idx) => {
                const globalIndex = idx + 1
                const isCompleted = !!recipients.find(
                  (e) => e.address === recipient.address && e.amount === recipient.amount
                )?.isCompleted
                return (
                  <tr
                    className={cn(
                      'table-row h-[4rem] text-base text-white hover:bg-[#2a2d38]/50 transition-colors',
                      idx % 2 === 0 ? 'bg-[#1a1b23]/50' : 'bg-[#2022289E]',
                      idx > 0 && 'border-t border-[#3a3d4a]/50'
                    )}
                    key={recipient.address}>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max text-[#8B949E] text-sm font-mono">
                          {globalIndex}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max">
                          {isCompleted ? (
                            <div className="scale-75">
                              <TickInFilledCircle />
                            </div>
                          ) : (
                            <div className="scale-75">
                              <Loader className="animate-spin" />
                            </div>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
                      <div className="flex items-center w-full h-full">
                        <span className="min-w-max">{shortenEthAddress(recipient.address)}</span>
                      </div>
                    </td>
                    <td className="table-cell h-[4rem] px-[1rem]">
                      <div className="flex items-center justify-end w-full h-full">
                        <span className="capitalize min-w-max">{recipient.amount}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </CheckoutTable>
          )}
          {((status === 'pending' && airdropApproveQuery.data === false) ||
            airdropApproveQuery.status === 'pending') && (
            <div className="flex items-center justify-center py-4">
              <div className="p-2 rounded-full h-44 w-44 bg-dark-base-999">
                <LogoSpinner></LogoSpinner>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

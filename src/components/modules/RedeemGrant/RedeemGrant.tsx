'use client'

import { FC, useState, useEffect } from 'react'
import clsx from 'clsx'
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'
import { conditionalTokenAbi } from '@/src/app/contract/ConditionalToken'
import Button from '../Button'

const GRANT_MANAGER_ADDRESS = '0x4F07b6daCcd6dF8D52efd32F22534304Cc0e1114' as const
const TOKEN_ADDRESS = '0x8bdC504dC3A05310059c1c67E0A2667309D27B93' as const

type Grant = {
  id: string
  question: string
  bond: string
  openingTime: string
  answer?: string
  maxPrevious?: string
}

interface RedeemGrantProps {
  grant: Grant
  className?: string
}

export const RedeemGrant: FC<RedeemGrantProps> = ({ grant, className }) => {
  const { address, isConnected } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  // Check if already approved
  const { data: isApproved, refetch: refetchApproval } = useReadContract({
    address: TOKEN_ADDRESS,
    abi: conditionalTokenAbi,
    functionName: 'isApprovedForAll',
    args: [address as `0x${string}`, GRANT_MANAGER_ADDRESS],
    query: { enabled: !!address },
  })

  // Approve contract
  const {
    writeContract: writeApprovalContract,
    data: approvalHash,
    isPending: isApprovalWritePending,
    error: approvalWriteError,
  } = useWriteContract()

  const {
    isLoading: isApprovalConfirming,
    isSuccess: isApprovalConfirmed,
    error: approvalReceiptError,
  } = useWaitForTransactionReceipt({
    hash: approvalHash,
  })

  // Redeem contract
  const {
    writeContract: writeResolveContract,
    data: answerHash,
    isPending: isAnswerWritePending,
    error: answerWriteError,
  } = useWriteContract()

  const {
    isLoading: isAnswerConfirming,
    isSuccess: isAnswerConfirmed,
    error: answerReceiptError,
  } = useWaitForTransactionReceipt({
    hash: answerHash,
  })

  // Reset states after tx confirmations
  useEffect(() => {
    if (isAnswerConfirmed) setIsSubmitting(false)
  }, [isAnswerConfirmed])

  useEffect(() => {
    if (isApprovalConfirmed) {
      setIsApproving(false)
      refetchApproval()
    }
  }, [isApprovalConfirmed, refetchApproval])

  const handleApprove = async () => {
    if (!isConnected || !address) return
    try {
      setIsApproving(true)
      writeApprovalContract({
        address: TOKEN_ADDRESS,
        abi: conditionalTokenAbi,
        functionName: 'setApprovalForAll',
        args: [GRANT_MANAGER_ADDRESS, true],
      })
    } catch (error) {
      console.error('Error approving token:', error)
      setIsApproving(false)
    }
  }

  const handleSubmit = async () => {
    if (!isConnected || isSubmitting) return
    try {
      setIsSubmitting(true)
      const grantId = grant.id as `0x${string}`
      writeResolveContract({
        address: GRANT_MANAGER_ADDRESS,
        abi: simpleGrantManagerAbi,
        functionName: 'redeemGrant',
        args: [grantId],
      })
    } catch (error) {
      console.error('Error redeeming grant:', error)
      setIsSubmitting(false)
    }
  }

  const error =
    answerWriteError || answerReceiptError || approvalWriteError || approvalReceiptError

  return (
    <div
      className={clsx(
        'bg-dark-base-800 rounded-2xl p-6 border border-dark-base-600 backdrop-blur-md shadow-md shadow-black/40',
        className
      )}>
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0 w-3 h-3 bg-[#00e068] rounded-full"></div>
          <h3 className="text-lg font-semibold text-[#80838f]">Redeem Grant</h3>
        </div>
        <p className="text-sm text-[#80838f] opacity-80">
          Redeem your YES tokens for collateral.
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {error && (
          <div className="bg-[#ff4063]/10 border border-[#ff4063]/30 rounded-lg p-4">
            <span className="text-sm font-medium text-[#ff4063]">
              Error: {error.message || 'Transaction failed'}
            </span>
          </div>
        )}

        {/* Approval feedback */}
        {approvalHash && (
          <div className="bg-[#00e068]/10 border border-[#00e068]/30 rounded-lg p-4">
            <p className="text-sm text-[#80838f] font-mono break-all">
              Approval tx: {approvalHash}
            </p>
            {isApprovalConfirming && (
              <p className="text-sm text-[#ff9900]">⏳ Confirming approval...</p>
            )}
            {isApprovalConfirmed && (
              <p className="text-sm text-[#00e068]">✅ Approved!</p>
            )}
          </div>
        )}

        {/* Redeem feedback */}
        {answerHash && (
          <div className="bg-[#00e068]/10 border border-[#00e068]/30 rounded-lg p-4">
            <p className="text-sm text-[#80838f] font-mono break-all">
              Redeem tx: {answerHash}
            </p>
            {isAnswerConfirming && (
              <p className="text-sm text-[#ff9900]">⏳ Confirming...</p>
            )}
            {isAnswerConfirmed && (
              <p className="text-sm text-[#00e068]">✅ Redeemed!</p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          {/* Approve button */}
          {!isApproved && (
            <Button
              type="primary"
              onClick={handleApprove}
              disabled={
                !isConnected ||
                isApproving ||
                isApprovalWritePending ||
                isApprovalConfirming
              }
              isPending={isApproving || isApprovalWritePending || isApprovalConfirming}
              className="min-w-[140px]">
              {isApprovalWritePending
                ? 'Approving...'
                : isApprovalConfirming
                  ? 'Confirming Approval...'
                  : 'Approve Token'}
            </Button>
          )}

          {/* Redeem button */}
          {isApproved && (
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!isConnected || isSubmitting}
              isPending={isAnswerWritePending || isAnswerConfirming || isSubmitting}
              className="min-w-[140px]">
              {!isConnected
                ? 'Connect Wallet'
                : isAnswerWritePending
                  ? 'Submitting...'
                  : isAnswerConfirming
                    ? 'Confirming...'
                    : 'Redeem Grant'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default RedeemGrant

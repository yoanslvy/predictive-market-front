'use client'

import { FC, useState, useEffect } from 'react'

import clsx from 'clsx'

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'

import Button from '../Button'

const GRANT_MANAGER_ADDRESS = '0x667B6911206f208FDEa3Ab647Aa84996863AFf48' as const

type Grant = {
  id: string
  question: string
  bond: string
  deadline: string
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

  // Contract write for answer submission
  const {
    writeContract: writeResolveContract,
    data: answerHash,
    isPending: isAnswerWritePending,
    error: answerWriteError,
  } = useWriteContract()

  // Wait for answer transaction
  const {
    isLoading: isAnswerConfirming,
    isSuccess: isAnswerConfirmed,
    error: answerReceiptError,
  } = useWaitForTransactionReceipt({
    hash: answerHash,
  })

  // Reset form on successful answer submission
  useEffect(() => {
    if (isAnswerConfirmed) {
      setIsSubmitting(false)
    }
  }, [isAnswerConfirmed])

  const handleSubmit = async () => {
    if (!isConnected || isSubmitting) return

    try {
      setIsSubmitting(true)

      // Parse the values from the form
      const grantId = grant.id as `0x${string}`

      console.log({grantId})

      writeResolveContract({
        address: GRANT_MANAGER_ADDRESS,
        abi: simpleGrantManagerAbi,
        functionName: 'redeemGrant',
        args: [grantId],
      })
    } catch (error) {
      console.error('Error submitting answer:', error)
      setIsSubmitting(false)
    }
  }

  const error = answerWriteError || answerReceiptError

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
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#ff4063] rounded-full"></div>
              <span className="text-sm font-medium text-[#ff4063]">Error</span>
            </div>
            <p className="text-sm text-[#80838f] mt-2">{error.message || 'Transaction failed'}</p>
          </div>
        )}

        {answerHash && (
          <div className="bg-[#00e068]/10 border border-[#00e068]/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#00e068] rounded-full"></div>
              <span className="text-sm font-medium text-[#00e068]">Transaction Submitted</span>
            </div>
            <p className="text-sm text-[#80838f] mt-2 font-mono break-all">{answerHash}</p>
            {isAnswerConfirming && (
              <p className="text-sm text-[#ff9900] mt-1">⏳ Confirming transaction...</p>
            )}
            {isAnswerConfirmed && (
              <p className="text-sm text-[#00e068] mt-1">✅ Transaction confirmed!</p>
            )}
          </div>
        )}

        <div className="flex justify-end">
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
        </div>
      </form>
    </div>
  )
}

export default RedeemGrant

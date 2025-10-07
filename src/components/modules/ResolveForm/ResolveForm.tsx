'use client'

import { FC, useState, useEffect } from 'react'

import clsx from 'clsx'

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'
import { Grant } from '@/src/app/server/getAllGrants'

import { Button } from '../Button/Button'

const GRANT_MANAGER_ADDRESS = '0x0Ea58737FA363Fcd31e84DA2eCa54e55F0701309' as const

interface ResolveFormProps {
  grant: Grant
  className?: string
}

export const ResolveForm: FC<ResolveFormProps> = ({ grant, className }) => {
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
      const grantId = grant.grantId as `0x${string}`

      writeResolveContract({
        address: GRANT_MANAGER_ADDRESS,
        abi: simpleGrantManagerAbi,
        functionName: 'resolveGrant',
        args: [grantId],
      })
    } catch (error) {
      console.error('Error submitting answer:', error)
      setIsSubmitting(false)
    }
  }

  const error = answerWriteError || answerReceiptError

  const DetailCard = ({ label, children }: { label?: string; children: React.ReactNode }) => (
    <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] flex flex-col gap-2">
      {label && (
        <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">{label}</span>
      )}
      <div>{children}</div>
    </div>
  )

  return (
    <div className={clsx('w-full rounded-xl bg-[#17181C] px-6 py-4', className)}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <DetailCard label="Condition">
          <p className="text-white text-md font-medium leading-relaxed">{grant.question}</p>
        </DetailCard>

        <DetailCard label="RESOLVED TO">
          <p className="text-[#757A8B] text-sm">
            Resolve this grant question by triggering the resolution process.
          </p>
        </DetailCard>

        {error && (
          <div className="bg-[#ff4063]/10 border border-[#ff4063]/20 rounded p-2">
            <div className="text-[#ff4063] text-xs">
              Error: {error.message || 'Transaction failed'}
            </div>
          </div>
        )}

        {answerHash && (
          <div className="bg-[#01EB5A]/10 border border-[#01EB5A]/20 rounded p-2">
            <div className="text-[#01EB5A] text-xs">
              <div>Tx: {answerHash.slice(0, 10)}...</div>
              {isAnswerConfirming && <div>Confirming...</div>}
              {isAnswerConfirmed && <div>Confirmed!</div>}
            </div>
          </div>
        )}

        <Button
          buttonType="button"
          type="action"
          onClick={handleSubmit}
          disabled={!isConnected || isSubmitting}
          className={clsx(
            'w-full px-4 py-2 rounded text-sm font-semibold transition-all duration-200',
            !isConnected || isSubmitting || isAnswerWritePending || isAnswerConfirming
              ? 'bg-[#2C2F3A] text-[#757A8B] cursor-not-allowed'
              : 'bg-[#01EB5A] text-[#17181C] hover:bg-[#01EB5A]/90'
          )}>
          {!isConnected
            ? 'Connect Wallet'
            : isAnswerWritePending
              ? 'Submitting...'
              : isAnswerConfirming
                ? 'Confirming...'
                : 'Resolve Grant'}
        </Button>
      </form>
    </div>
  )
}

export default ResolveForm

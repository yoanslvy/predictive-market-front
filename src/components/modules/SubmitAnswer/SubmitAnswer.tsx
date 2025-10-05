'use client'

import { FC, useState, useEffect } from 'react'

import clsx from 'clsx'

import { formatEther, parseEther, parseUnits } from 'viem'

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'
import YesTokenBalance from '@/src/app/grants/grant/components/YesTokenBalance'
import { Grant } from '@/src/app/server/getAllGrants'
import { useSubmitAnswerStore } from '@/src/stores/grants/useSubmitAnswerStore'

import { Button } from '../Button/Button'

const GRANT_MANAGER_ADDRESS = '0x4F07b6daCcd6dF8D52efd32F22534304Cc0e1114' as const

interface SubmitAnswerProps {
  grant: Grant
  className?: string
  isopeningTimePassed: boolean
  answerStatus: string
}

export const SubmitAnswer: FC<SubmitAnswerProps> = ({
  grant,
  className,
  isopeningTimePassed,
  answerStatus,
}) => {
  const { address, isConnected } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const status = grant.resolved ? 'Resolved' : isopeningTimePassed ? 'Open' : 'Not Open'

  const { SubmitAnswerData, updateForm, updateBooleans, clearForm, isFormValid } =
    useSubmitAnswerStore()

  // Contract write for answer submission
  const {
    writeContract: writeAnswerContract,
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
      clearForm()
      setIsSubmitting(false)
    }
  }, [isAnswerConfirmed, clearForm])

  const handleSubmit = async () => {
    if (!isConnected || isSubmitting) return

    try {
      setIsSubmitting(true)

      // Parse the values from the form
      const grantId = grant.grantId as `0x${string}`
      const answer = BigInt(SubmitAnswerData.answer.value)
      const maxPrevious = parseUnits(SubmitAnswerData.maxPrevious.value, 18)
      const bondAmount = BigInt(grant.bond)
      const minBondAmount = BigInt(grant.minBond)

      console.log({ grantId, answer, maxPrevious, bondAmount, minBondAmount })

      writeAnswerContract({
        address: GRANT_MANAGER_ADDRESS,
        abi: simpleGrantManagerAbi,
        functionName: 'submitAnswer',
        args: [grantId, answer, maxPrevious],
        value: bondAmount > minBondAmount ? bondAmount : minBondAmount,
      })
    } catch (error) {
      console.error('Error submitting answer:', error)
      setIsSubmitting(false)
    }
  }

  // Set answer to Yes (1)
  const setAnswerYes = () => {
    updateForm({
      name: 'answer',
      input: '1',
    })
  }

  // Set answer to No (0)
  const setAnswerNo = () => {
    updateForm({
      name: 'answer',
      input: '0',
    })
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
        <DetailCard label="Your Answer">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[#757A8B] text-xs">
              Current Allocation Threshold: {formatEther(BigInt(grant.bond)).toString()} ETH
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={setAnswerYes}
              className={clsx(
                'px-4 py-2 rounded text-sm font-semibold transition-all duration-200 flex-1',
                SubmitAnswerData.answer.value === '1'
                  ? 'bg-[#01EB5A] text-[#17181C] hover:bg-[#01EB5A]/90'
                  : 'bg-[#2C2F3A] text-[#F0F2FB] border border-[#30333C] hover:border-[#01EB5A40] hover:text-[#01EB5A]'
              )}>
              Yes
            </button>
            <button
              type="button"
              onClick={setAnswerNo}
              className={clsx(
                'px-4 py-2 rounded text-sm font-semibold transition-all duration-200 flex-1',
                SubmitAnswerData.answer.value === '0'
                  ? 'bg-[#01EB5A] text-[#17181C] hover:bg-[#01EB5A]/90'
                  : 'bg-[#2C2F3A] text-[#F0F2FB] border border-[#30333C] hover:border-[#01EB5A40] hover:text-[#01EB5A]'
              )}>
              No
            </button>
          </div>

          <input
            type="number"
            placeholder="Answer Allocation (ETH)"
            value={SubmitAnswerData.maxPrevious.value}
            onChange={(e) => updateForm({ name: 'maxPrevious', input: e.target.value })}
            className="w-full px-3 py-2 bg-[#1A1B23] border border-[#30333C] rounded text-white placeholder-[#757A8B] text-sm focus:border-[#01EB5A] focus:outline-none transition-colors"
          />

          {SubmitAnswerData.answer.message && (
            <div className="text-[#ff4063] text-xs mt-2">{SubmitAnswerData.answer.message}</div>
          )}
          {SubmitAnswerData.maxPrevious.message && (
            <div className="text-[#ff4063] text-xs mt-1">
              {SubmitAnswerData.maxPrevious.message}
            </div>
          )}
        </DetailCard>

        <DetailCard>
          <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
            Current Answer Status: {answerStatus}
          </span>
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
          disabled={!isConnected || !isFormValid() || isSubmitting   || isAnswerWritePending || isAnswerConfirming}
          className={clsx(
            'w-full px-4 py-2 rounded text-sm font-semibold transition-all duration-200',
            !isConnected ||
              isSubmitting ||
              isAnswerWritePending ||
              isAnswerConfirming
              ? 'bg-[#2C2F3A] text-[#757A8B] cursor-not-allowed'
              : 'bg-[#01EB5A] text-[#17181C] hover:bg-[#01EB5A]/90'
          )}>
          {!isConnected
            ? 'Connect Wallet'
            : isAnswerWritePending
              ? 'Submitting...'
              : isAnswerConfirming
                ? 'Confirming...'
                : 'Submit Answer'}
        </Button>
      </form>
    </div>
  )
}

export default SubmitAnswer

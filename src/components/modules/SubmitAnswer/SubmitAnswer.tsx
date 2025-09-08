'use client'

import { FC, useState, useEffect } from 'react'

import clsx from 'clsx'

import { parseEther, parseUnits } from 'viem'

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'
import { useSubmitAnswerStore } from '@/src/stores/grants/useSubmitAnswerStore'

import Button from '../Button'
import Card from '../Card'
import Input from '../Input'
import styles from './SubmitAnswer.module.scss'

const GRANT_MANAGER_ADDRESS = '0x667B6911206f208FDEa3Ab647Aa84996863AFf48' as const

type Grant = {
  id: string
  question: string
  bond: string
  openingTime: string
  answer?: string
  maxPrevious?: string
  resolved: boolean
}

interface SubmitAnswerProps {
  grant: Grant
  className?: string
  isopeningTimePassed: boolean
}

export const SubmitAnswer: FC<SubmitAnswerProps> = ({ grant, className, isopeningTimePassed }) => {
  const { address, isConnected } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

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
      const grantId = grant.id as `0x${string}`
      const answer = BigInt(SubmitAnswerData.answer.value)
      const maxPrevious = parseUnits(SubmitAnswerData.maxPrevious.value, 18)
      const bondAmount = BigInt(grant.bond == "0" ? parseEther("0.001") : grant.bond) // Default to 0.001 ETH if bond is 0

      console.log(grant.bond)

      writeAnswerContract({
        address: GRANT_MANAGER_ADDRESS,
        abi: simpleGrantManagerAbi,
        functionName: 'submitAnswer',
        args: [grantId, answer, maxPrevious],
        value: bondAmount,
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

  if (grant.resolved) {
    return (
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0 w-3 h-3 bg-[#00e068] rounded-full"></div>
          <h3 className="text-lg font-semibold text-[#80838f]">Grant is resolved</h3>
        </div>
      </div>
    )
  }

  return (
    <Card title="Submit Answer" className={clsx(styles.container, className)} type="shade">
      <div className={styles.header}>
        <p className={styles.description}>
          Submit an answer to resolve a grant question. You must provide a bond that will be at risk
          if your answer is incorrect.
        </p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.section}>
          <label className={styles.inputLabel}>Answer</label>
          <div className={styles.answerContainer}>
            <Button
              type={SubmitAnswerData.answer.value === '1' ? 'primary' : 'secondary'}
              buttonType="button"
              size="sm"
              onClick={setAnswerYes}
              className={styles.answerButton}>
              Yes (1)
            </Button>
            <Button
              type={SubmitAnswerData.answer.value === '0' ? 'primary' : 'secondary'}
              buttonType="button"
              size="sm"
              onClick={setAnswerNo}
              className={styles.answerButton}>
              No (0)
            </Button>
          </div>
          {SubmitAnswerData.answer.message && (
            <div className={styles.error}>{SubmitAnswerData.answer.message}</div>
          )}
        </div>

        <div className={styles.section}>
          <Input
            title="Max Previous Bond (ETH)"
            placeholder="0.0"
            type="number"
            value={SubmitAnswerData.maxPrevious.value}
            onValueChange={(value) => updateForm({ name: 'maxPrevious', input: value })}
            className={styles.input}
          />
          {SubmitAnswerData.maxPrevious.message && (
            <div className={styles.error}>{SubmitAnswerData.maxPrevious.message}</div>
          )}
        </div>

        {error && (
          <div className={styles.error}>Error: {error.message || 'Transaction failed'}</div>
        )}

        {answerHash && (
          <div className={styles.success}>
            Answer transaction: {answerHash}
            {isAnswerConfirming && <span> - Confirming...</span>}
            {isAnswerConfirmed && <span> - Confirmed!</span>}
          </div>
        )}

        <div className={styles.actions}>
          <Button type="secondary" onClick={clearForm} disabled={isSubmitting || isApproving}>
            Clear
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!isConnected || !isFormValid() || isSubmitting}
            isPending={isAnswerWritePending || isAnswerConfirming || isSubmitting}
            className={styles.submitButton}>
            {!isConnected
              ? 'Connect Wallet'
              : isAnswerWritePending
                ? 'Submitting...'
                : isAnswerConfirming
                  ? 'Confirming...'
                  : 'Submit Answer'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default SubmitAnswer

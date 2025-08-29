'use client'

import { FC, useState, useEffect } from 'react'

import clsx from 'clsx'

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'

import Button from '../Button'
import Card from '../Card'
import styles from './ResolveForm.module.scss'

const GRANT_MANAGER_ADDRESS = '0x667B6911206f208FDEa3Ab647Aa84996863AFf48' as const

type Grant = {
  id: string
  question: string
  bond: string
  answer?: string
  maxPrevious?: string
}

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
      const grantId = grant.id as `0x${string}`

      writeResolveContract({
        address: GRANT_MANAGER_ADDRESS,
        abi: simpleGrantManagerAbi,
        functionName: 'resolveGrant',
        args: [grantId],
        value: BigInt(grant.bond),
      })
    } catch (error) {
      console.error('Error submitting answer:', error)
      setIsSubmitting(false)
    }
  }

  const error = answerWriteError || answerReceiptError

  return (
    <Card title="Resolve Grant" className={clsx(styles.container, className)} type="shade">
      <div className={styles.header}>
        <p className={styles.description}>Resolve a grant question.</p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!isConnected || isSubmitting}
            isPending={isAnswerWritePending || isAnswerConfirming || isSubmitting}
            className={styles.submitButton}>
            {!isConnected
              ? 'Connect Wallet'
              : isAnswerWritePending
                ? 'Submitting...'
                : isAnswerConfirming
                  ? 'Confirming...'
                  : 'Resolve Grant'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ResolveForm

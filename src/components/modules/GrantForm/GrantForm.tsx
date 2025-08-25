'use client'

import { FC, useState, useEffect } from 'react'

import clsx from 'clsx'

import { parseUnits, formatUnits } from 'viem'

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'
import { useGrantFormStore } from '@/src/stores/grants/useGrantFormStore'

import Button from '../Button'
import Card from '../Card'
import Input from '../Input'
import styles from './GrantForm.module.scss'

const GRANT_MANAGER_ADDRESS = '0xe48DBCd180C114A669B75274DeF111dC2B1ccB9c' as const

interface GrantFormProps {
  className?: string
}

export const GrantForm: FC<GrantFormProps> = ({ className }) => {
  const { address, isConnected } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { grantFormData, updateForm, updateBooleans, clearForm, isFormValid } = useGrantFormStore()

  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash,
  })

  // Reset form on successful transaction
  useEffect(() => {
    if (isConfirmed) {
      clearForm()
      setIsSubmitting(false)
    }
  }, [isConfirmed, clearForm])

  const handleSubmit = async () => {
    console.log('handleSubmit')
    console.log({ isConnected, isFormValid, isSubmitting })
    if (!isConnected || isSubmitting) return
    console.log('handleSubmit 2')

    try {
      setIsSubmitting(true)

      const deadline = parseInt(grantFormData.deadline.value)
      const amount = parseUnits(grantFormData.amount.value, 18) // Assuming 18 decimals
      const minBond = parseUnits(grantFormData.minBond.value, 18)

      console.log({ deadline, amount, minBond })

      console.log({
        question: grantFormData.question.value,
        collateralToken: grantFormData.collateralToken.value as `0x${string}`,
        amount,
        recipient: grantFormData.recipient.value as `0x${string}`,
        deadline,
        minBond,
      })

      writeContract({
        address: GRANT_MANAGER_ADDRESS,
        abi: simpleGrantManagerAbi,
        functionName: 'createGrant',
        args: [
          grantFormData.question.value,
          grantFormData.collateralToken.value as `0x${string}`,
          amount,
          grantFormData.recipient.value as `0x${string}`,
          deadline,
          minBond,
        ],
      })
    } catch (error) {
      console.error('Error creating grant:', error)
      setIsSubmitting(false)
    }
  }

  // Generate deadline timestamp for one week from now
  const generateDeadlineTimestamp = () => {
    const oneWeekFromNow = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    updateForm({
      name: 'deadline',
      input: oneWeekFromNow.toString(),
    })
  }

  const error = writeError || receiptError

  return (
    <Card title="Create Grant" className={clsx(styles.container, className)} type="shade">
      <div className={styles.header}>
        <p className={styles.description}>
          Create a conditional grant that will be released to the recipient when the question is
          resolved positively.
        </p>
      </div>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.section}>
          <Input
            title="Question"
            placeholder="What condition must be met for this grant to be released?"
            value={grantFormData.question.value}
            onValueChange={(value) => updateForm({ name: 'question', input: value })}
            className={styles.input}
          />
          {grantFormData.question.message && (
            <div className={styles.error}>{grantFormData.question.message}</div>
          )}
        </div>

        <div className={styles.section}>
          <Input
            title="Collateral Token Address"
            placeholder="0x..."
            value={grantFormData.collateralToken.value}
            onValueChange={(value) => updateForm({ name: 'collateralToken', input: value })}
            className={styles.input}
          />
          {grantFormData.collateralToken.message && (
            <div className={styles.error}>{grantFormData.collateralToken.message}</div>
          )}
        </div>

        <div className={styles.section}>
          <Input
            title="Grant Amount"
            placeholder="0.0"
            type="number"
            value={grantFormData.amount.value}
            onValueChange={(value) => updateForm({ name: 'amount', input: value })}
            className={styles.input}
          />
          {grantFormData.amount.message && (
            <div className={styles.error}>{grantFormData.amount.message}</div>
          )}
        </div>

        <div className={styles.section}>
          <Input
            title="Recipient Address"
            placeholder="0x..."
            value={grantFormData.recipient.value}
            onValueChange={(value) => updateForm({ name: 'recipient', input: value })}
            className={styles.input}
          />
          {grantFormData.recipient.message && (
            <div className={styles.error}>{grantFormData.recipient.message}</div>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.deadlineContainer}>
            <Input
              title="Deadline (Unix Timestamp)"
              placeholder="1735689600"
              value={grantFormData.deadline.value}
              onValueChange={(value) => updateForm({ name: 'deadline', input: value })}
              className={styles.input}
            />
            <Button
              type="secondary"
              buttonType="button"
              size="sm"
              onClick={generateDeadlineTimestamp}
              className={styles.generateButton}>
              +7 days
            </Button>
          </div>
          {grantFormData.deadline.value && (
            <div className={styles.deadlinePreview}>
              Deadline: {new Date(parseInt(grantFormData.deadline.value) * 1000).toLocaleString()}
            </div>
          )}
          {grantFormData.deadline.message && (
            <div className={styles.error}>{grantFormData.deadline.message}</div>
          )}
        </div>

        <div className={styles.section}>
          <Input
            title="Minimum Bond"
            placeholder="0.0"
            type="number"
            value={grantFormData.minBond.value}
            onValueChange={(value) => updateForm({ name: 'minBond', input: value })}
            className={styles.input}
          />
          {grantFormData.minBond.message && (
            <div className={styles.error}>{grantFormData.minBond.message}</div>
          )}
        </div>

        <div className={styles.section}>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={grantFormData.hasAcceptedTerms}
              onChange={(e) => updateBooleans({ hasAcceptedTerms: e.target.checked })}
            />
            <span>I understand that this grant will be locked until the question is resolved</span>
          </label>
        </div>

        {error && (
          <div className={styles.error}>Error: {error.message || 'Transaction failed'}</div>
        )}

        {hash && (
          <div className={styles.success}>
            Transaction submitted: {hash}
            {isConfirming && <span> - Confirming...</span>}
            {isConfirmed && <span> - Confirmed!</span>}
          </div>
        )}

        <div className={styles.actions}>
          <Button type="secondary" onClick={clearForm} disabled={isSubmitting}>
            Clear
          </Button>

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!isConnected || !isFormValid() || isSubmitting}
            isPending={isWritePending || isConfirming || isSubmitting}
            className={styles.submitButton}>
            {!isConnected
              ? 'Connect Wallet'
              : isWritePending
                ? 'Submitting...'
                : isConfirming
                  ? 'Confirming...'
                  : 'Create Grant'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default GrantForm

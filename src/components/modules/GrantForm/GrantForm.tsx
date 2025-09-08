'use client'

import { FC, useState, useEffect } from 'react'

import clsx from 'clsx'

import { parseUnits, formatUnits } from 'viem'

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'
import { useGrantFormStore } from '@/src/stores/grants/useGrantFormStore'

import Button from '../Button'
import Card from '../Card'
import Input from '../Input'
import styles from './GrantForm.module.scss'

const GRANT_MANAGER_ADDRESS = '0x667B6911206f208FDEa3Ab647Aa84996863AFf48' as const

// Standard ERC20 ABI for approve and allowance functions
const erc20Abi = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

interface GrantFormProps {
  className?: string
}

export const GrantForm: FC<GrantFormProps> = ({ className }) => {
  const { address, isConnected } = useAccount()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const { grantFormData, updateForm, updateBooleans, clearForm, isFormValid } = useGrantFormStore()

  // Check current allowance
  const { data: currentAllowance, refetch: refetchAllowance } = useReadContract({
    address: grantFormData.collateralToken.value as `0x${string}`,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address as `0x${string}`, GRANT_MANAGER_ADDRESS],
    query: {
      enabled: !!(
        address &&
        grantFormData.collateralToken.value &&
        grantFormData.collateralToken.value.startsWith('0x')
      ),
    },
  })

  // Contract write for grant creation
  const {
    writeContract: writeGrantContract,
    data: grantHash,
    isPending: isGrantWritePending,
    error: grantWriteError,
  } = useWriteContract()

  // Contract write for token approval
  const {
    writeContract: writeApprovalContract,
    data: approvalHash,
    isPending: isApprovalWritePending,
    error: approvalWriteError,
  } = useWriteContract()

  // Wait for grant transaction
  const {
    isLoading: isGrantConfirming,
    isSuccess: isGrantConfirmed,
    error: grantReceiptError,
  } = useWaitForTransactionReceipt({
    hash: grantHash,
  })

  // Wait for approval transaction
  const {
    isLoading: isApprovalConfirming,
    isSuccess: isApprovalConfirmed,
    error: approvalReceiptError,
  } = useWaitForTransactionReceipt({
    hash: approvalHash,
  })

  // Reset form on successful grant creation
  useEffect(() => {
    if (isGrantConfirmed) {
      clearForm()
      setIsSubmitting(false)
    }
  }, [isGrantConfirmed, clearForm])

  // Refetch allowance after approval is confirmed
  useEffect(() => {
    if (isApprovalConfirmed) {
      setIsApproving(false)
      refetchAllowance()
    }
  }, [isApprovalConfirmed, refetchAllowance])

  // Check if approval is needed
  const needsApproval = () => {
    if (!currentAllowance || !grantFormData.amount.value) return true

    try {
      const requiredAmount = parseUnits(grantFormData.amount.value, 18)
      return currentAllowance < requiredAmount
    } catch {
      return false
    }
  }

  const handleApprove = async () => {
    if (!isConnected || !grantFormData.collateralToken.value || !grantFormData.amount.value) return

    try {
      setIsApproving(true)
      const amount = parseUnits(grantFormData.amount.value, 18)

      writeApprovalContract({
        address: grantFormData.collateralToken.value as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [GRANT_MANAGER_ADDRESS, amount],
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

      const openingTime = parseInt(grantFormData.openingTime.value)
      const amount = parseUnits(grantFormData.amount.value, 18) // Assuming 18 decimals
      const minBond = parseUnits(grantFormData.minBond.value, 18)

      writeGrantContract({
        address: GRANT_MANAGER_ADDRESS,
        abi: simpleGrantManagerAbi,
        functionName: 'createGrant',
        args: [
          grantFormData.question.value,
          grantFormData.collateralToken.value as `0x${string}`,
          amount,
          grantFormData.recipient.value as `0x${string}`,
          openingTime,
          minBond,
        ],
      })
    } catch (error) {
      console.error('Error creating grant:', error)
      setIsSubmitting(false)
    }
  }

  // Generate openingTime timestamp for one week from now
  const generateopeningTimeTimestamp = () => {
    const oneWeekFromNow = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    updateForm({
      name: 'openingTime',
      input: oneWeekFromNow.toString(),
    })
  }

  const error = grantWriteError || grantReceiptError || approvalWriteError || approvalReceiptError

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

          {/* Show current allowance info */}
          {currentAllowance !== undefined && grantFormData.collateralToken.value && (
            <div className={styles.allowanceInfo}>
              Current allowance: {formatUnits(currentAllowance, 18)} tokens
              {needsApproval() && <span className={styles.approvalNeeded}> - Approval needed</span>}
            </div>
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
          <div className={styles.openingTimeContainer}>
            <Input
              title="opening Time (Unix Timestamp)"
              placeholder="1735689600"
              value={grantFormData.openingTime.value}
              onValueChange={(value) => updateForm({ name: 'openingTime', input: value })}
              className={styles.input}
            />
            <Button
              type="secondary"
              buttonType="button"
              size="sm"
              onClick={generateopeningTimeTimestamp}
              className={styles.generateButton}>
              +7 days
            </Button>
          </div>
          {grantFormData.openingTime.value && (
            <div className={styles.openingTimePreview}>
              openingTime:{' '}
              {new Date(parseInt(grantFormData.openingTime.value) * 1000).toLocaleString()}
            </div>
          )}
          {grantFormData.openingTime.message && (
            <div className={styles.error}>{grantFormData.openingTime.message}</div>
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

        {approvalHash && (
          <div className={styles.success}>
            Approval transaction: {approvalHash}
            {isApprovalConfirming && <span> - Confirming...</span>}
            {isApprovalConfirmed && <span> - Approved!</span>}
          </div>
        )}

        {grantHash && (
          <div className={styles.success}>
            Grant transaction: {grantHash}
            {isGrantConfirming && <span> - Confirming...</span>}
            {isGrantConfirmed && <span> - Confirmed!</span>}
          </div>
        )}

        <div className={styles.actions}>
          <Button type="secondary" onClick={clearForm} disabled={isSubmitting || isApproving}>
            Clear
          </Button>

          {/* Show approve button if approval is needed */}
          {needsApproval() && (
            <Button
              type="primary"
              onClick={handleApprove}
              disabled={
                !isConnected || isApproving || isApprovalWritePending || isApprovalConfirming
              }
              isPending={isApprovalWritePending || isApprovalConfirming || isApproving}
              className={styles.approveButton}>
              {isApprovalWritePending
                ? 'Approving...'
                : isApprovalConfirming
                  ? 'Confirming Approval...'
                  : 'Approve Token'}
            </Button>
          )}
          {!needsApproval() && (
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={
                !isConnected || !isFormValid() || isSubmitting || needsApproval() || isApproving
              }
              isPending={isGrantWritePending || isGrantConfirming || isSubmitting}
              className={styles.submitButton}>
              {!isConnected
                ? 'Connect Wallet'
                : needsApproval()
                  ? 'Approve Token First'
                  : isGrantWritePending
                    ? 'Submitting...'
                    : isGrantConfirming
                      ? 'Confirming...'
                      : 'Create Grant'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default GrantForm

'use client'

import { CalendarDateTime } from '@internationalized/date'

import { FC } from 'react'

import clsx from 'clsx'

import { useGrant } from '@/src/hooks/useGrant'
import { useGrantFormStore } from '@/src/stores/grants/useGrantFormStore'

import Button from '../Button'
import Card from '../Card'
import DateTimePicker from '../DateTimePicker'
import Input from '../Input'
import styles from './GrantForm.module.scss'

interface GrantFormProps {
  className?: string
}

export const GrantForm: FC<GrantFormProps> = ({ className }) => {
  const { grantFormData, updateForm, clearForm, isFormValid } = useGrantFormStore()

  const {
    createGrantFromForm,
    approve,
    status,
    isConnected,
    needsApproval,
    formattedAllowance,
    grantHash,
    approvalHash,
    isGrantConfirmed,
    isApprovalConfirmed,
    error,
    reset,
  } = useGrant()

  const handleApprove = async () => {
    if (!grantFormData.collateralToken.value || !grantFormData.amount.value) return

    try {
      await approve(
        grantFormData.collateralToken.value as `0x${string}`,
        grantFormData.amount.value
      )
    } catch (error) {
      console.error('Error approving token:', error)
    }
  }

  const handleSubmit = async () => {
    if (!isConnected || status === 'creating' || status === 'approving') return

    try {
      await createGrantFromForm()
    } catch (error) {
      console.error('Error creating grant:', error)
    }
  }

  const handleClear = () => {
    clearForm()
    reset()
  }

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
            value={grantFormData.condition.value}
            onValueChange={(value) => updateForm({ name: 'question', input: value })}
            className={styles.input}
          />
          {grantFormData.condition.message && (
            <div className={styles.error}>{grantFormData.condition.message}</div>
          )}
        </div>

        <div className={styles.section}>
          <Input
            title="Reward Token"
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
            title="Reward Amount"
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
          {formattedAllowance && grantFormData.collateralToken.value && (
            <div className={styles.allowanceInfo}>
              Current allowance: {formattedAllowance} tokens
              {needsApproval() && <span className={styles.approvalNeeded}> - Approval needed</span>}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <Input
            title="Grant Recipient Address"
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
            {/*
           <Input
              title="Grant Opening Time (Unix Timestamp)"
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
            </Button> */}

            <DateTimePicker
              title="Grant Opening Time (UTC)"
              type="datetime"
              value={
                grantFormData.openingTime.value
                  ? new CalendarDateTime(
                      new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCFullYear(),
                      new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCMonth() + 1,
                      new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCDate(),
                      new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCHours(),
                      new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCMinutes(),
                      new Date(parseInt(grantFormData.openingTime.value) * 1000).getUTCSeconds()
                    )
                  : undefined
              }
              onValueChange={(value: Date | null) => {
                updateForm({
                  name: 'openingTime',
                  input: value ? Math.floor(value.getTime() / 1000).toString() : '',
                })
              }}
              presets={[
                {
                  caption: '+7 days',
                  onClick: () => {
                    const oneWeekFromNow = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
                    updateForm({ name: 'openingTime', input: oneWeekFromNow.toString() })
                  },
                },
              ]}
            />
          </div>
          {grantFormData.openingTime.message && (
            <div className={styles.error}>{grantFormData.openingTime.message}</div>
          )}
        </div>

        <div className={styles.section}>
          <Input
            title="Grant Minimum Bond"
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

        {error && <div className={styles.error}>Error: {error}</div>}

        {approvalHash && (
          <div className={styles.success}>
            Approval transaction: {approvalHash}
            {status === 'approving' && <span> - Confirming...</span>}
            {isApprovalConfirmed && <span> - Approved!</span>}
          </div>
        )}

        {grantHash && (
          <div className={styles.success}>
            Grant transaction: {grantHash}
            {status === 'creating' && <span> - Confirming...</span>}
            {isGrantConfirmed && <span> - Confirmed!</span>}
          </div>
        )}

        <div className={styles.actions}>
          <Button type="secondary" onClick={handleClear} disabled={status !== 'idle'}>
            Clear
          </Button>

          {/* Show approve button if approval is needed */}
          {needsApproval() && (
            <Button
              type="primary"
              onClick={handleApprove}
              disabled={!isConnected || status === 'approving'}
              isPending={status === 'approving'}
              className={styles.approveButton}>
              {status === 'approving' ? 'Approving...' : 'Approve Token'}
            </Button>
          )}
          {!needsApproval() && (
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!isConnected || !isFormValid() || status === 'creating' || needsApproval()}
              isPending={status === 'creating'}
              className={styles.submitButton}>
              {!isConnected
                ? 'Connect Wallet'
                : needsApproval()
                  ? 'Approve Token First'
                  : status === 'creating'
                    ? 'Creating Grant...'
                    : 'Create Grant'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  )
}

export default GrantForm

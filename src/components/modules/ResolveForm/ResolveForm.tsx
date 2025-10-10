'use client'

import { FC, useState, useEffect } from 'react'

import clsx from 'clsx'

import { config } from '@/src/app/(providers)/wagmiConfig'
import { waitForTransactionReceipt } from '@wagmi/core'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'
import { Grants } from '@/src/app/grants/explore/latest/_modules/tokenTable/data'

import { Button } from '../Button/Button'

const GRANT_MANAGER_ADDRESS = '0x0Ea58737FA363Fcd31e84DA2eCa54e55F0701309' as const

interface ResolveFormProps {
  grant: Grants
  className?: string
}

export const ResolveForm: FC<ResolveFormProps> = ({ grant, className }) => {
  const { address, isConnected, chainId } = useAccount()
  const [isResolving, setIsResolving] = useState(false)

  // Contract write for answer submission
  const {
    writeContractAsync: writeResolveContractAsync,
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
      setIsResolving(false)
    }
  }, [isAnswerConfirmed])

  const handleResolve = async () => {
    if (!isConnected || isResolving) return

    try {
      setIsResolving(true)

      // Parse the values from the form
      const grantId = grant.grantId as `0x${string}`

      const hash = await writeResolveContractAsync({
        address: GRANT_MANAGER_ADDRESS,
        abi: simpleGrantManagerAbi,
        functionName: 'resolveGrant',
        args: [grantId],
      })

      const { status } = await waitForTransactionReceipt(config, {
        hash: hash as `0x${string}`,
        chainId: chainId as number,
      })

      if (status === 'reverted') {
        throw new Error('Failed to create grant')
      }

      if (status !== 'success') {
        throw new Error('Failed to create grant')
      }

      window.location.href = `/grants/explore/latest`
    } catch (error) {
      console.error('Error submitting answer:', error)
      setIsResolving(false)
    }
  }

  const error = answerWriteError || answerReceiptError

  return (
    <div className={clsx('w-full rounded-xl bg-[#17181C] px-6 py-4', className)}>
      {error && (
        <div className="bg-[#ff4063]/10 border border-[#ff4063]/20 rounded p-2">
          <div className="text-[#ff4063] text-xs">
            Error: {error.message || 'Transaction failed'}
          </div>
        </div>
      )}

      <Button
        buttonType="button"
        type="action"
        onClick={handleResolve}
        disabled={!isConnected || isResolving}
        className={clsx(
          'w-full px-4 py-2 rounded text-sm font-semibold transition-all duration-200',
          !isConnected || isResolving || isAnswerWritePending || isAnswerConfirming
            ? 'bg-[#2C2F3A] text-[#757A8B] cursor-not-allowed'
            : 'bg-[#01EB5A] text-[#17181C] hover:bg-[#01EB5A]/90'
        )}>
        {!isConnected
          ? 'Connect Wallet'
          : isAnswerWritePending
            ? 'Resolving...'
            : isAnswerConfirming
              ? 'Confirming...'
              : 'Resolve Grant'}
      </Button>
    </div>
  )
}

export default ResolveForm

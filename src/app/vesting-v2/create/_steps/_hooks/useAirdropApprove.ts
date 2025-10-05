import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useState } from 'react'

import { Address, erc20Abi, isAddress } from 'viem'

import { config } from '@/src/app/(providers)/wagmiConfig'
import { readContracts, waitForTransactionReceipt } from '@wagmi/core'
import { useWriteContract } from 'wagmi'

import { vestingManagerAbi } from '@/src/interfaces/web3/abis/vestingManager'

import {
  computeAmountWithFeeBI,
  getAmountAndDatePerStepWithFeeBI,
  getStepsUnixTimestamps,
} from '../../../_utils/utils'
import { useAirdropStore } from './useAirdropStore'
import { useVestingFeesExemption } from './useVestingFeesExemption'

export function useAirdropApprove({
  wallet,
  chainId,
  vestingContract,
  openModal,
  enabled = true,
}: {
  wallet: string
  chainId: number
  vestingContract: string
  openModal: () => void
  enabled?: boolean
}) {
  const store = useAirdropStore((s) => ({
    tokenAddress: s.tokenAddress,
    startDate: s.startDate,
    endDate: s.endDate,
    steps: s.steps,
    emissionType: s.emissionType,
    activeRecipients: s.activeRecipients,
  }))

  const { feeExemptionData } = useVestingFeesExemption(
    vestingContract as Address,
    chainId,
    wallet as Address,
    store.tokenAddress as Address
  )

  const writeIncreaseAllowance = useWriteContract()

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [waitStatus, setWaitStatus] = useState<'pending' | 'success' | 'error' | 'idle'>('idle')
  const queryClient = useQueryClient()

  const status = errorMsg
    ? 'error'
    : waitStatus !== 'idle'
      ? waitStatus
      : writeIncreaseAllowance.status

  async function approve() {
    try {
      setErrorMsg(null)
      setWaitStatus('pending')
      if (store.activeRecipients.length === 0) {
        throw new Error('Please add at least one recipient')
      }

      if (!store.tokenAddress || !isAddress(store.tokenAddress)) {
        throw new Error('Please select token address')
      }

      if (!store.startDate) {
        throw new Error('Please select start date')
      }

      // For unlockInSteps, we need additional validations
      if (store.emissionType.value === 'unlockInSteps') {
        if (!store.endDate) {
          throw new Error('Please select end date')
        }
        if (!store.steps) {
          throw new Error('Please specify number of steps')
        }
      }

      // For unlockInSteps, we need additional validations
      if (store.emissionType.value === 'linear') {
        if (!store.endDate) {
          throw new Error('Please select end date')
        }
      }

      writeIncreaseAllowance.reset()

      const [decimals, allowance, feePercentage] = await readContracts(config, {
        contracts: [
          {
            address: store.tokenAddress as Address,
            abi: erc20Abi,
            functionName: 'decimals',
            chainId,
          },
          {
            address: store.tokenAddress as Address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [wallet as Address, vestingContract as Address],
            chainId,
          },
          {
            address: vestingContract as Address,
            abi: vestingManagerAbi,
            functionName: 'feePercentage',
            chainId,
          },
        ],
      })

      if (decimals.error || allowance.error || feePercentage.error) {
        throw new Error(
          decimals.error
            ? 'Failed to get decimals'
            : allowance.error
              ? 'Failed to get allowance'
              : 'Failed to get fee percentage'
        )
      }

      const tokenDecimals = decimals.result
      const tokenAllowance = allowance.result
      let feePercentageValue = feePercentage.result

      if (feeExemptionData?.[0]?.result || feeExemptionData?.[1]?.result) {
        feePercentageValue = 0n
      }

      const totalAmount = store.activeRecipients.reduce((acc, recipient) => {
        if (recipient.isCompleted) return acc
        if (
          store.emissionType.value === 'unlockInSteps' &&
          typeof store.steps === 'number' &&
          store.startDate &&
          store.endDate
        ) {
          const amountPerStep = recipient.amount / store.steps

          const amountPerStepBI = BigInt(Math.floor(amountPerStep * 10 ** tokenDecimals))

          const amountWithFeeBI = computeAmountWithFeeBI(
            BigInt(Math.floor(recipient.amount * 10 ** tokenDecimals)),
            Number(feePercentageValue) / 10000,
            tokenDecimals
          )
          const datesUnix = getStepsUnixTimestamps(store.startDate, store.endDate, store.steps)
          const tranches = getAmountAndDatePerStepWithFeeBI(
            amountPerStepBI,
            datesUnix,
            amountWithFeeBI
          )
          const total = acc + (tranches.at(-1)?.amount ?? 0n)
          return total
        }

        const amountWithFeeBI = computeAmountWithFeeBI(
          BigInt(Math.floor(recipient.amount * 10 ** tokenDecimals)),
          Number(feePercentageValue) / 10000,
          tokenDecimals
        )
        return amountWithFeeBI + acc
      }, BigInt(0))

      const needsApproval = tokenAllowance < totalAmount

      // Approve tokens if needed
      if (needsApproval) {
        try {
          openModal()
          const approveTransaction = await writeIncreaseAllowance.writeContractAsync({
            address: store.tokenAddress as Address,
            abi: erc20Abi,
            functionName: 'approve',
            args: [vestingContract as Address, totalAmount],
            chainId,
          })

          const { status } = await waitForTransactionReceipt(config, {
            hash: approveTransaction,
            chainId,
          })

          if (status === 'reverted') {
            throw new Error('Failed to approve tokens')
          }

          await new Promise((resolve) => setTimeout(resolve, 3000))

          setWaitStatus('success')

          await queryClient.refetchQueries({
            queryKey: [
              'airdropApprove',
              store.activeRecipients.map((r) => `${r.address}-${r.amount}`).join('_'),
              vestingContract,
              chainId,
              store.startDate,
              store.endDate,
              store.steps,
              store.emissionType,
              store.tokenAddress,
            ],
          })
        } catch (error) {
          throw new Error('Failed to approve tokens')
        }
      }
    } catch (error) {
      toast.error(
        `Failed to process vesting: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      setErrorMsg(
        `Failed to process vesting: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      setWaitStatus('error')
    }
  }

  async function needsApprove() {
    const [decimals, allowance, feePercentage] = await readContracts(config, {
      contracts: [
        {
          address: store.tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'decimals',
          chainId,
        },
        {
          address: store.tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [wallet as Address, vestingContract as Address],
          chainId,
        },
        {
          address: vestingContract as Address,
          abi: vestingManagerAbi,
          functionName: 'feePercentage',
          chainId,
        },
      ],
    })

    if (decimals.error || allowance.error || feePercentage.error) {
      throw new Error(
        decimals.error
          ? 'Failed to get decimals'
          : allowance.error
            ? 'Failed to get allowance'
            : 'Failed to get fee percentage'
      )
    }

    const tokenDecimals = decimals.result
    const tokenAllowance = allowance.result
    let feePercentageValue = feePercentage.result

    if (feeExemptionData?.[0]?.result || feeExemptionData?.[1]?.result) {
      feePercentageValue = 0n
    }

    const totalAmount = store.activeRecipients.reduce((acc, recipient) => {
      if (recipient.isCompleted) return acc
      if (
        store.emissionType.value === 'unlockInSteps' &&
        typeof store.steps === 'number' &&
        store.startDate &&
        store.endDate
      ) {
        const amountPerStep = recipient.amount / store.steps

        const amountPerStepBI = BigInt(Math.floor(amountPerStep * 10 ** tokenDecimals))

        const amountWithFeeBI = computeAmountWithFeeBI(
          BigInt(Math.floor(recipient.amount * 10 ** tokenDecimals)),
          Number(feePercentageValue) / 10000,
          tokenDecimals
        )
        const datesUnix = getStepsUnixTimestamps(store.startDate, store.endDate, store.steps)
        const tranches = getAmountAndDatePerStepWithFeeBI(
          amountPerStepBI,
          datesUnix,
          amountWithFeeBI
        )
        const total = acc + (tranches.at(-1)?.amount ?? 0n)
        return total
      }

      const amountWithFeeBI = computeAmountWithFeeBI(
        BigInt(Math.floor(recipient.amount * 10 ** tokenDecimals)),
        Number(feePercentageValue) / 10000,
        tokenDecimals
      )
      return amountWithFeeBI + acc
    }, BigInt(0))

    const needsApproval = tokenAllowance < totalAmount

    return needsApproval
  }

  const airdropApproveQuery = useQuery({
    queryKey: [
      'airdropApprove',
      store.activeRecipients.map((r) => `${r.address}-${r.amount}`).join('_'),
      vestingContract,
      chainId,
      store.startDate,
      store.endDate,
      store.steps,
      store.emissionType,
      store.tokenAddress,
    ],
    enabled,
    queryFn: async () => {
      return needsApprove()
    },
  })

  return {
    approve,
    needsApprove,
    writeIncreaseAllowance,
    error: errorMsg,
    status,
    airdropApproveQuery,
    onClose: () => {
      writeIncreaseAllowance.reset()
      setErrorMsg(null)
      setWaitStatus('idle')
    },
  }
}

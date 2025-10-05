import { toast } from 'react-toastify'

import { useState } from 'react'

import { Address, encodeFunctionData, erc20Abi, getAddress, isAddress } from 'viem'

import { config } from '@/src/app/(providers)/wagmiConfig'
import {
  estimateGas,
  readContracts,
  simulateContract,
  waitForTransactionReceipt,
} from '@wagmi/core'
import { useWriteContract } from 'wagmi'

import { vestingManagerAbi } from '@/src/interfaces/web3/abis/vestingManager'
import { EquationType } from '@/src/interfaces/web3/vesting-v2/contracts'
import {
  fluxesPagedCachedTag,
  tokensPagedCachedTag,
  vestingsOfTokenPagedCachedTag,
  walletStatsCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'

import { useRegisterVesting } from '../../../_hooks/useRegisterVesting'
import { useSign } from '../../../_hooks/useSign'
import {
  computeAmountWithFeeBI,
  getAmountAndDatePerStepWithFeeBI,
  getStepsUnixTimestamps,
  createBatches,
} from '../../../_utils/utils'
import {
  AnyRecipient,
  EmissionTypeValue,
  FluxSettings,
  MintSettings,
  Recipient,
  StepsRecipient,
  useAirdropStore,
} from './useAirdropStore'
import { useVestingFeesExemption } from './useVestingFeesExemption'

export interface SimulationOptions {
  vestingContract: Address
  tokenAddress: Address
  tokenDecimals: number
  fluxSettings: FluxSettings
  mintSettings: MintSettings
  chainId: number
  startDate: Date | null
  endDate: Date | null
  steps: number | null
}

// Group recipients by amount for efficient batch processing
function groupRecipientsByAmounts(recipients: AnyRecipient[]): {
  amount: number
  recipients: AnyRecipient[]
}[] {
  const groupedRecipients: { [key: string]: AnyRecipient[] } = {}
  recipients.forEach((recipient) => {
    const key = recipient.amount.toString()
    if (!groupedRecipients[key]) {
      groupedRecipients[key] = []
    }
    groupedRecipients[key].push(recipient)
  })

  return Object.keys(groupedRecipients).map((key) => ({
    amount: groupedRecipients[key][0].amount,
    recipients: groupedRecipients[key],
  }))
}

type StateOverride = {
  address: `0x${string}`
  stateDiff: {
    slot: `0x${string}`
    value: `0x${string}`
  }[]
}[]

type RecipientHandlers = {
  [key in EmissionTypeValue | 'linearBulk']: (
    recipients: AnyRecipient[],
    options: SimulationOptions,
    feePercentageValue: number,
    flatFee: bigint,
    stateOverride?: StateOverride
  ) => Promise<any>
}

export const recipientHandlers: RecipientHandlers = {
  scheduled: async (
    recipients: Recipient[],
    options: SimulationOptions,
    feePercentageValue: number,
    flatFee: bigint,
    stateOverride?: StateOverride
  ) => {
    const {
      vestingContract,
      tokenAddress,
      tokenDecimals,
      fluxSettings,
      mintSettings,
      chainId,
      startDate,
    } = options

    if (!startDate) {
      toast.error('Please select start date')
      return null
    }

    // Since we send them grouped by amount, the first one will be correct (or any of them)
    const amount = recipients[0].amount

    const amountBI = BigInt(Math.floor(amount * 10 ** tokenDecimals))

    const amountWithFee = computeAmountWithFeeBI(
      amountBI,
      feePercentageValue / 10000,
      tokenDecimals
    )

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createAirdropVesting',
      args: [
        tokenAddress,
        [
          {
            amount: BigInt(0),
            time: BigInt((startDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.STEPWISE,
          },
          {
            amount: amountWithFee,
            time: BigInt((startDate.getTime() / 1000 + 1).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
        ],
        recipients.map((e) => getAddress(e.address)),
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
      stateOverride,
    })
  },

  unlockInSteps: async (
    recipients: StepsRecipient[],
    options: SimulationOptions,
    feePercentageValue: number,
    flatFee: bigint,
    stateOverride?: StateOverride
  ) => {
    const {
      vestingContract,
      tokenAddress,
      tokenDecimals,
      fluxSettings,
      mintSettings,
      chainId,
      startDate,
      endDate,
      steps,
    } = options

    if (!startDate || !endDate || !steps) {
      toast.error('Please select start and end date, and steps')
      return null
    }

    // Since we send them grouped by amount, the first one will be correct (or any of them)
    const amountPerStep = recipients[0].amount / steps

    const amountPerStepBI = BigInt(Math.floor(amountPerStep * 10 ** tokenDecimals))

    const amountWithFeeBI = computeAmountWithFeeBI(
      BigInt(recipients[0].amount * 10 ** tokenDecimals),
      Number(feePercentageValue) / 10000,
      tokenDecimals
    )
    const datesUnix = getStepsUnixTimestamps(startDate, endDate, steps)
    const tranches = getAmountAndDatePerStepWithFeeBI(amountPerStepBI, datesUnix, amountWithFeeBI)

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createAirdropVesting',
      args: [
        tokenAddress,
        tranches.map((step) => ({
          amount: step.amount,
          time: BigInt(step.date),
          eqType: EquationType.STEPWISE,
        })),
        recipients.map((e) => getAddress(e.address)),
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
      stateOverride,
    })
  },

  linear: async (
    recipients: Recipient[],
    options: SimulationOptions,
    feePercentageValue: number,
    flatFee: bigint,
    stateOverride?: StateOverride
  ) => {
    const {
      vestingContract,
      tokenAddress,
      tokenDecimals,
      fluxSettings,
      mintSettings,
      chainId,
      startDate,
      endDate,
    } = options

    if (!startDate || !endDate) {
      toast.error('Please select start and end date')
      return null
    }

    // Since we send them grouped by amount, the first one will be correct (or any of them)
    const amount = recipients[0].amount

    const amountWithFee = computeAmountWithFeeBI(
      BigInt(Math.floor(amount * 10 ** tokenDecimals)),
      feePercentageValue / 10000,
      tokenDecimals
    )

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createAirdropVesting',
      args: [
        tokenAddress,
        [
          {
            amount: BigInt(0),
            time: BigInt((startDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
          {
            amount: amountWithFee,
            time: BigInt((endDate.getTime() / 1000 + 1).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
        ],
        recipients.map((e) => getAddress(e.address)),
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
      stateOverride,
    })
  },

  linearBulk: async (
    recipients: Recipient[],
    options: SimulationOptions,
    feePercentageValue: number,
    flatFee: bigint,
    stateOverride?: StateOverride
  ) => {
    const {
      vestingContract,
      tokenAddress,
      tokenDecimals,
      fluxSettings,
      mintSettings,
      chainId,
      startDate,
      endDate,
    } = options

    if (!startDate || !endDate) {
      toast.error('Please select start and end date')
      return null
    }

    const t = recipients.map((e) => getAddress(tokenAddress))

    const a = recipients.map((e) => [
      {
        amount: 0n,
        time: BigInt((startDate.getTime() / 1000).toFixed(0)),
        eqType: EquationType.LINEAR,
      },
      {
        amount: computeAmountWithFeeBI(
          BigInt(Math.floor(e.amount * 10 ** tokenDecimals)),
          feePercentageValue / 10000,
          tokenDecimals
        ),
        time: BigInt((endDate.getTime() / 1000).toFixed(0)),
        eqType: EquationType.LINEAR,
      },
    ])

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createBulkVestingForBeneficiaries',
      args: [
        t,
        a,
        recipients.map((e) => getAddress(e.address)),
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
      stateOverride,
    })
  },
}

export function useAirdrop({
  wallet,
  chainId,
  vestingContract,
  openModal,
}: {
  wallet: string
  chainId: number
  vestingContract: string
  openModal: () => void
}) {
  const store = useAirdropStore((state) => ({
    tokenAddress: state.tokenAddress,
    coverUrl: state.coverUrl,
    logoUrl: state.logoUrl,
    startDate: state.startDate,
    endDate: state.endDate,
    steps: state.steps,
    fluxSettings: state.fluxSettings,
    mintSettings: state.mintSettings,
    emissionType: state.emissionType,
    distributionType: state.distributionType,

    setRecipients: state.setRecipients,

    activeRecipients: state.activeRecipients,
    maxRecipients: state.maxRecipients,

    setScheduledRecipients: state.setScheduledRecipients,
    setStepsRecipients: state.setStepsRecipients,
    setLinearRecipients: state.setLinearRecipients,
  }))

  const { feeExemptionData } = useVestingFeesExemption(
    vestingContract as Address,
    chainId,
    wallet as Address,
    store.tokenAddress as Address
  )

  const writeCreateVesting = useWriteContract()
  const writeIncreaseAllowance = useWriteContract()
  const registerVesting = useRegisterVesting()
  const { signRegisterVesting } = useSign()

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [waitStatus, setWaitStatus] = useState<'pending' | 'success' | 'error' | 'idle'>('idle')

  const status: 'error' | 'pending' | 'success' | 'idle' | 'increaseAllowancePending' = errorMsg
    ? 'error'
    : waitStatus !== 'idle' && waitStatus !== 'pending'
      ? waitStatus
      : writeIncreaseAllowance.status === 'pending'
        ? 'increaseAllowancePending'
        : writeIncreaseAllowance.status === 'error'
          ? 'error'
          : writeIncreaseAllowance.status === 'success'
            ? 'pending'
            : registerVesting.status === 'pending' || registerVesting.status === 'idle'
              ? 'pending'
              : registerVesting.status === 'error'
                ? 'error'
                : writeCreateVesting.status

  // Use the activeRecipients directly from the store
  const pendingActiveFluxes = store.activeRecipients.filter((recipient) => !recipient.isCompleted)

  const [totalFluxesToProcess, setTotalFluxesToProcess] = useState(pendingActiveFluxes.length)

  /**
   * Process a simulated vesting transaction and register it if needed
   */
  async function handleSimulateVesting(
    simulateCreateVesting: any,
    isAllowed: boolean,
    vestingContract: string,
    shouldReset = false
  ) {
    if (!simulateCreateVesting || !Array.isArray(simulateCreateVesting.result)) return

    const data = encodeFunctionData(simulateCreateVesting.request)

    const _gas = await estimateGas(config, {
      to: vestingContract as Address,
      chainId,
      data,
    })

    const gas = (_gas * BigInt(13)) / BigInt(10)

    const hash = await writeCreateVesting.writeContractAsync({
      ...simulateCreateVesting.request,
      gas,
    })

    if (shouldReset) {
      writeCreateVesting.reset()
      registerVesting.reset()
    }

    const { status } = await waitForTransactionReceipt(config, {
      hash,
      chainId,
    })

    if (status === 'reverted') {
      throw new Error('Failed to create vesting')
    }

    if (status !== 'success') {
      throw new Error('Transaction failed')
    }

    // Extract vesting IDs from the simulation result
    const airdropIds = Array.isArray(simulateCreateVesting.result)
      ? simulateCreateVesting.result.map((e: BigInt) => Number(e))
      : [Number(simulateCreateVesting.result)]

    const signature = await signRegisterVesting({
      chainId,
      vestingIds: airdropIds,
    })

    if (!signature) {
      throw new Error('Failed to get signature')
    }

    await registerVesting.mutateAsync({
      vestingIds: airdropIds,
      wallet,
      chainId,
      isAllowed,
      signature,
      coverPicture: store.coverUrl,
      profilePicture: store.logoUrl,
    })
  }

  async function checkout() {
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

      setTotalFluxesToProcess(pendingActiveFluxes.length)
      writeCreateVesting.reset()
      writeIncreaseAllowance.reset()
      registerVesting.reset()

      openModal()

      const [decimals, allowance, feePercentage, flatFee] = await readContracts(config, {
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
          {
            abi: vestingManagerAbi,
            address: vestingContract as Address,
            functionName: 'flatFee',
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

      if (flatFee.error) {
        throw new Error('Failed to get flat fee')
      }

      const tokenDecimals = decimals.result
      const tokenAllowance = allowance.result
      let feePercentageValue = feePercentage.result
      let flatFeeValue = flatFee.result

      const simulationOptions: SimulationOptions = {
        vestingContract: vestingContract as Address,
        tokenAddress: store.tokenAddress as Address,
        tokenDecimals,
        fluxSettings: store.fluxSettings,
        mintSettings: store.mintSettings,
        chainId,
        startDate: store.startDate,
        endDate: store.endDate,
        steps: store.steps,
      }

      const isAllowed =
        store.mintSettings.isMintAllowed && store.mintSettings.isMintForRecipientsAllowed
      let currentEmissionType: 'scheduled' | 'unlockInSteps' | 'linear' | 'linearBulk' =
        store.emissionType.value
      if (store.distributionType.title === 'Custom' && currentEmissionType === 'linear') {
        currentEmissionType = 'linearBulk'
      }

      if (feeExemptionData?.[0]?.result || feeExemptionData?.[1]?.result) {
        flatFeeValue = 0n
        if (currentEmissionType == 'linearBulk' && feeExemptionData?.[0]?.result) {
          flatFeeValue = 0n
        }
        if (currentEmissionType == 'linearBulk' && !feeExemptionData?.[0]?.result) {
          flatFeeValue = flatFee.result
        }
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
        } catch (error) {
          throw new Error('Failed to approve tokens')
        }
      }

      const recipientHandler = recipientHandlers[currentEmissionType]

      if (!recipientHandler) {
        throw new Error(`No handler found for emission type: ${currentEmissionType}`)
      }

      // Handle grouped vs individual processing based on distribution type
      if (store.distributionType.title === 'Custom') {
        // Group recipients by amount for efficient processing
        const recipients = store.activeRecipients.filter((r) => !r.isCompleted)

        if (currentEmissionType === 'linearBulk') {
          let batches: AnyRecipient[][]
          batches = await createBatches(
            recipients,
            flatFeeValue,
            vestingContract as Address,
            chainId,
            simulationOptions,
            feePercentageValue,
            recipientHandler
          )

          for (let i = 0; i < batches.length; i++) {
            const batch = batches[i]
            try {
              writeCreateVesting.reset()
              registerVesting.reset()
              const simulateCreateVesting = await recipientHandler(
                batch,
                simulationOptions,
                Number(feePercentageValue),
                flatFeeValue
              )
              await handleSimulateVesting(
                simulateCreateVesting,
                isAllowed,
                vestingContract,
                i !== batches.length - 1
              )

              store.setLinearRecipients((prev) =>
                prev.map((r) =>
                  batch.some((br) => br.address === r.address) ? { ...r, isCompleted: true } : r
                )
              )
            } catch (error) {
              toast.error(
                `Failed to process airdrop: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`
              )
              throw error
            }
          }
        } else {
          let groupedRecipients = groupRecipientsByAmounts(recipients)

          for (const group of groupedRecipients) {
            let batches: AnyRecipient[][]
            batches = await createBatches(
              group.recipients,
              flatFeeValue,
              vestingContract as Address,
              chainId,
              simulationOptions,
              feePercentageValue,
              recipientHandler
            )

            for (let i = 0; i < batches.length; i++) {
              const batch = batches[i]
              try {
                writeCreateVesting.reset()
                registerVesting.reset()
                const simulateCreateVesting = await recipientHandler(
                  batch,
                  simulationOptions,
                  Number(feePercentageValue),
                  flatFeeValue
                )
                await handleSimulateVesting(
                  simulateCreateVesting,
                  isAllowed,
                  vestingContract,
                  i !== batches.length - 1
                )

                // Mark batch recipients as completed
                if (currentEmissionType === 'scheduled') {
                  store.setScheduledRecipients((prev) =>
                    prev.map((r) =>
                      batch.some((br) => br.address === r.address) ? { ...r, isCompleted: true } : r
                    )
                  )
                } else if (currentEmissionType === 'unlockInSteps') {
                  store.setStepsRecipients((prev) =>
                    prev.map((r) =>
                      batch.some((br) => br.address === r.address) ? { ...r, isCompleted: true } : r
                    )
                  )
                } else if (
                  currentEmissionType === 'linear' ||
                  currentEmissionType === 'linearBulk'
                ) {
                  store.setLinearRecipients((prev) =>
                    prev.map((r) =>
                      batch.some((br) => br.address === r.address) ? { ...r, isCompleted: true } : r
                    )
                  )
                }
              } catch (error) {
                toast.error(
                  `Failed to process airdrop: ${
                    error instanceof Error ? error.message : 'Unknown error'
                  }`
                )
                throw error
              }
            }
          }
        }
      } else {
        // Uniform distribution - all recipients get the same amount
        const recipients = store.activeRecipients.filter((r) => !r.isCompleted)
        let batches: AnyRecipient[][]
        batches = await createBatches(
          recipients,
          flatFeeValue,
          vestingContract as Address,
          chainId,
          simulationOptions,
          feePercentageValue,
          recipientHandler
        )

        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i]
          try {
            writeCreateVesting.reset()
            registerVesting.reset()
            const simulateCreateVesting = await recipientHandler(
              batch,
              simulationOptions,
              Number(feePercentageValue),
              flatFeeValue
            )
            await handleSimulateVesting(
              simulateCreateVesting,
              isAllowed,
              vestingContract,
              i !== batches.length - 1
            )

            // Mark batch recipients as completed
            if (currentEmissionType === 'scheduled') {
              store.setScheduledRecipients((prev) =>
                prev.map((r) =>
                  batch.some((br) => br.address === r.address) ? { ...r, isCompleted: true } : r
                )
              )
            } else if (currentEmissionType === 'unlockInSteps') {
              store.setStepsRecipients((prev) =>
                prev.map((r) =>
                  batch.some((br) => br.address === r.address) ? { ...r, isCompleted: true } : r
                )
              )
            } else if (currentEmissionType === 'linear' || currentEmissionType === 'linearBulk') {
              store.setLinearRecipients((prev) =>
                prev.map((r) =>
                  batch.some((br) => br.address === r.address) ? { ...r, isCompleted: true } : r
                )
              )
            }
          } catch (error) {
            toast.error(
              `Failed to process airdrop: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            )
            throw error
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 3000))
      setWaitStatus('success')
      customRevalidateTag(fluxesPagedCachedTag(wallet, chainId))
      customRevalidateTag(walletStatsCachedTag(wallet))
      customRevalidateTag(tokensPagedCachedTag(chainId))
      customRevalidateTag(vestingsOfTokenPagedCachedTag(store.tokenAddress))
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

  return {
    checkout,
    writeCreateVesting,
    writeIncreaseAllowance,
    maxFluxes: store.maxRecipients,
    totalFluxesToProcess,
    pendingActiveFluxes,
    registerVesting,
    error: errorMsg,
    status,
    onClose: () => {
      writeCreateVesting.reset()
      writeIncreaseAllowance.reset()
      registerVesting.reset()
      setErrorMsg(null)
      setWaitStatus('idle')
    },
  }
}

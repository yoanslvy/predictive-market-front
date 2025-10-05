import { toast } from 'react-toastify'

import { useState } from 'react'

import { Address, erc20Abi, isAddress } from 'viem'

import { config } from '@/src/app/(providers)/wagmiConfig'
import { readContracts, simulateContract, waitForTransactionReceipt } from '@wagmi/core'
import { useWriteContract } from 'wagmi'

import { vestingManagerAbi } from '@/src/interfaces/web3/abis/vestingManager'
import { EquationType } from '@/src/interfaces/web3/vesting-v2/contracts'
import {
  fluxesPagedCachedTag,
  walletStatsCachedTag,
  tokensPagedCachedTag,
  vestingsOfTokenPagedCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'

import { useRegisterVesting } from '../../../_hooks/useRegisterVesting'
import { useSign } from '../../../_hooks/useSign'
import {
  computeAmountWithFeeBI,
  getAmountAndDatePerMonthWithFeeBI,
  getAmountAndDatePerStepWithFeeBI,
  getStepsUnixTimestamps,
} from '../../../_utils/utils'
import { useVestingFeesExemption } from './useVestingFeesExemption'
import {
  CliffExponentialFlux,
  CliffFlux,
  EmissionTypeValue,
  ExponentialFlux,
  FluxSettings,
  LinearFlux,
  MintSettings,
  MonthlyUnlocksFlux,
  StepsFlux,
  TimelockFlux,
  UnlockCliffFlux,
  useVestingStore,
} from './useVestingStore'

interface SimulationOptions {
  vestingContract: Address
  tokenAddress: Address
  tokenDecimals: number
  fluxSettings: FluxSettings
  mintSettings: MintSettings
  chainId: number
}

type FluxHandlers = {
  [key in EmissionTypeValue]: (
    flux: any,
    options: SimulationOptions,
    feePercentageValue: number,
    flatFeeValue: bigint
  ) => Promise<any>
}

const fluxHandlers: FluxHandlers = {
  linear: async (flux: LinearFlux, options, feePercentageValue, flatFee) => {
    const { address, amount, startDate, endDate } = flux
    const { vestingContract, tokenAddress, tokenDecimals, fluxSettings, mintSettings, chainId } =
      options
    if (!startDate || !endDate) {
      toast.error('Please select start and end date')
      return null
    }

    const amountWithFee = computeAmountWithFeeBI(
      BigInt(Math.floor(amount * 10 ** tokenDecimals)),
      feePercentageValue / 10000,
      tokenDecimals
    )

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createVesting',
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
            time: BigInt((endDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
        ],
        address as Address,
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
    })
  },

  monthlyUnlocks: async (flux: MonthlyUnlocksFlux, options, feePercentageValue, flatFee) => {
    const { address, allowTopUps, amount, months, startDate } = flux
    const { vestingContract, tokenAddress, tokenDecimals, fluxSettings, mintSettings, chainId } =
      options

    if (!startDate || !months) {
      toast.error('Please select start and months')
      return null
    }

    const amountPerMonth = amount / months

    const amountPerMonthBI = BigInt(Math.floor(amountPerMonth * 10 ** tokenDecimals))

    const amountWithFeeBI = computeAmountWithFeeBI(
      BigInt(amount * 10 ** tokenDecimals),
      Number(feePercentageValue) / 10000,
      tokenDecimals
    )
    const tranches = getAmountAndDatePerMonthWithFeeBI(
      amountPerMonthBI,
      months,
      startDate,
      amountWithFeeBI
    )

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createVesting',
      args: [
        tokenAddress,
        tranches.map((month) => ({
          amount: month.amount,
          time: BigInt(month.date),
          eqType: EquationType.STEPWISE,
        })),
        address as Address,
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        !!allowTopUps,
      ],
      chainId,
      value: flatFee,
    })
  },

  cliff: async (flux: CliffFlux, options, feePercentageValue, flatFee) => {
    const { address, amount, endDate, cliffAmount, cliffDate } = flux
    const { vestingContract, tokenAddress, tokenDecimals, fluxSettings, mintSettings, chainId } =
      options

    if (!endDate || !cliffDate) {
      toast.error('Please select cliff and end dates')
      return null
    }

    const amountWithFee = computeAmountWithFeeBI(
      BigInt(Math.floor(amount * 10 ** tokenDecimals)),
      feePercentageValue / 10000,
      tokenDecimals
    )

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createVesting',
      args: [
        tokenAddress,
        [
          {
            amount: BigInt(Math.floor(cliffAmount * 10 ** tokenDecimals)),
            time: BigInt((cliffDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
          {
            amount: amountWithFee,
            time: BigInt((endDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
        ],
        address as Address,
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
    })
  },

  unlockCliff: async (flux: UnlockCliffFlux, options, feePercentageValue, flatFee) => {
    const { address, amount, startDate, endDate, initialUnlockedAmount, cliffAmount, cliffDate } =
      flux
    const { vestingContract, tokenAddress, tokenDecimals, fluxSettings, mintSettings, chainId } =
      options

    if (!startDate || !endDate || initialUnlockedAmount == null) {
      toast.error('Please select start and end date, and initial unlocked amount')
      return null
    }

    const amountWithFee = computeAmountWithFeeBI(
      BigInt(Math.floor(amount * 10 ** tokenDecimals)),
      feePercentageValue / 10000,
      tokenDecimals
    )

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createVesting',
      args: [
        tokenAddress,
        [
          {
            amount: BigInt(Math.floor(initialUnlockedAmount * 10 ** tokenDecimals)),
            time: BigInt((startDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.STEPWISE,
          },
          {
            amount: BigInt(Math.floor(initialUnlockedAmount * 10 ** tokenDecimals)),
            time: BigInt((cliffDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.STEPWISE,
          },
          {
            amount: BigInt(Math.floor((cliffAmount + initialUnlockedAmount) * 10 ** tokenDecimals)),
            time: BigInt((cliffDate.getTime() / 1000 + 1).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
          {
            amount: amountWithFee,
            time: BigInt((endDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
        ],
        address as Address,
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
    })
  },

  timelock: async (flux: TimelockFlux, options, feePercentageValue, flatFee) => {
    const { address, amount, unlockDate } = flux
    const { vestingContract, tokenAddress, tokenDecimals, fluxSettings, mintSettings, chainId } =
      options

    if (!unlockDate) {
      toast.error('Please select unlock date')
      return null
    }

    const amountWithFee = computeAmountWithFeeBI(
      BigInt(Math.floor(amount * 10 ** tokenDecimals)),
      feePercentageValue / 10000,
      tokenDecimals
    )

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createVesting',
      args: [
        tokenAddress,
        [
          {
            amount: BigInt(Math.floor(amount * 10 ** tokenDecimals)),
            time: BigInt((unlockDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.STEPWISE,
          },
          {
            amount: amountWithFee,
            time: BigInt((unlockDate.getTime() / 1000 + 1).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
        ],
        address as Address,
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
    })
  },

  unlockInSteps: async (flux: StepsFlux, options, feePercentageValue, flatFee) => {
    const { address, allowTopUps, amount, startDate, steps, endDate } = flux
    const { vestingContract, tokenAddress, tokenDecimals, fluxSettings, mintSettings, chainId } =
      options

    if (!startDate || !endDate || !steps) {
      toast.error('Please select start and end date, and number of steps')
      return null
    }

    const datesUnix = getStepsUnixTimestamps(startDate, endDate, steps)

    const amountPerStep = amount / steps

    const amountPerStepBI = BigInt(Math.floor(amountPerStep * 10 ** tokenDecimals))

    const amountWithFeeBI = computeAmountWithFeeBI(
      BigInt(amount * 10 ** tokenDecimals),
      Number(feePercentageValue) / 10000,
      tokenDecimals
    )
    const tranches = getAmountAndDatePerStepWithFeeBI(amountPerStepBI, datesUnix, amountWithFeeBI)

    // INTERVAL MEANS THE AMOUNT IS RELEASED IMMEDIATELY AT THE DEFINED DATE
    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createVesting',
      args: [
        tokenAddress,
        tranches.map((step) => ({
          amount: step.amount,
          time: BigInt(step.date),
          eqType: EquationType.STEPWISE,
        })),
        address as Address,
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        !!allowTopUps,
      ],
      chainId,
      value: flatFee,
    })
  },

  exponential: async (flux: ExponentialFlux, options, feePercentageValue, flatFee) => {
    const { address, amount, startDate, endDate } = flux
    const { vestingContract, tokenAddress, tokenDecimals, fluxSettings, mintSettings, chainId } =
      options

    if (!startDate || !endDate) {
      toast.error('Please select start and end date')
      return null
    }
    const amountWithFee = computeAmountWithFeeBI(
      BigInt(Math.floor(amount * 10 ** tokenDecimals)),
      feePercentageValue / 10000,
      tokenDecimals
    )

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createVesting',
      args: [
        tokenAddress,
        [
          {
            amount: BigInt(0),
            time: BigInt((new Date(startDate).getTime() / 1000).toFixed(0)),
            eqType: EquationType.EXPONENTIAL,
          },
          {
            amount: amountWithFee,
            time: BigInt((new Date(endDate).getTime() / 1000).toFixed(0)),
            eqType: EquationType.LINEAR,
          },
        ],
        address as Address,
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
    })
  },

  cliffExponential: async (flux: CliffExponentialFlux, options, feePercentageValue, flatFee) => {
    const { address, amount, startDate, endDate, initialUnlockedAmount, cliffAmount, cliffDate } =
      flux
    const { vestingContract, tokenAddress, tokenDecimals, fluxSettings, mintSettings, chainId } =
      options

    if (!startDate || !endDate || initialUnlockedAmount == null) {
      toast.error('Please select start and end date, and initial unlocked amount')
      return null
    }

    const amountWithFee = computeAmountWithFeeBI(
      BigInt(Math.floor(amount * 10 ** tokenDecimals)),
      feePercentageValue / 10000,
      tokenDecimals
    )

    return simulateContract(config, {
      address: vestingContract,
      abi: vestingManagerAbi,
      functionName: 'createVesting',
      args: [
        tokenAddress,
        [
          {
            amount: BigInt(Math.floor(initialUnlockedAmount * 10 ** tokenDecimals)),
            time: BigInt((startDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.STEPWISE,
          },
          {
            amount: BigInt(Math.floor(initialUnlockedAmount * 10 ** tokenDecimals)),
            time: BigInt((cliffDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.STEPWISE,
          },
          {
            amount: BigInt(Math.floor((cliffAmount + initialUnlockedAmount) * 10 ** tokenDecimals)),
            time: BigInt((cliffDate.getTime() / 1000 + 1).toFixed(0)),
            eqType: EquationType.EXPONENTIAL,
          },
          {
            amount: amountWithFee,
            time: BigInt((endDate.getTime() / 1000).toFixed(0)),
            eqType: EquationType.EXPONENTIAL,
          },
        ],
        address as Address,
        fluxSettings.isFluxCancellable,
        mintSettings.isMintAllowed && !mintSettings.isMintForRecipientsAllowed,
        fluxSettings.isFluxTransferrable,
        false,
      ],
      chainId,
      value: flatFee,
    })
  },
}

export function useVesting({
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
  const store = useVestingStore((state) => ({
    tokenAddress: state.tokenAddress,
    coverUrl: state.coverUrl,
    logoUrl: state.logoUrl,
    fluxSettings: state.fluxSettings,
    mintSettings: state.mintSettings,
    emissionType: state.emissionType,

    setFluxes: state.setFluxes,

    activeFluxes: state.activeFluxes,
    maxFluxes: state.maxFluxes,
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

  const pendingActiveFluxes = store.activeFluxes.filter((flux) => !flux.isCompleted)

  const [totalFluxesToProcess, setTotalFluxesToProcess] = useState(pendingActiveFluxes.length)

  /**
   * Process a simulated vesting transaction and register it if needed
   */
  async function handleSimulateVesting(simulateCreateVesting: any, isAllowed: boolean) {
    if (!simulateCreateVesting || typeof simulateCreateVesting.result !== 'bigint') return
    const hash = await writeCreateVesting.writeContractAsync(simulateCreateVesting.request)
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

    const signature = await signRegisterVesting({
      chainId,
      vestingIds: [Number(simulateCreateVesting.result)],
    })

    if (!signature) {
      throw new Error('Failed to get signature')
    }

    await registerVesting.mutateAsync({
      vestingIds: [Number(simulateCreateVesting.result)],
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
      if (store.activeFluxes.length === 0) {
        throw new Error('Please add at least one flux')
      }

      if (store.activeFluxes.length !== store.maxFluxes) {
        throw new Error('Please fill all fluxes')
      }

      if (!store.tokenAddress || !isAddress(store.tokenAddress)) {
        throw new Error('Please select token address')
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

      if (feeExemptionData?.[0]?.result || feeExemptionData?.[1]?.result) {
        flatFeeValue = 0n
        feePercentageValue = 0n
      }

      const totalAmount = store.activeFluxes.reduce((acc, e) => {
        if (e.isCompleted) return acc
        if ('steps' in e && typeof e.steps === 'number') {
          const amountPerStep = e.amount / e.steps

          const amountPerStepBI = BigInt(Math.floor(amountPerStep * 10 ** tokenDecimals))

          const amountWithFeeBI = computeAmountWithFeeBI(
            BigInt(e.amount * 10 ** tokenDecimals),
            Number(feePercentageValue) / 10000,
            tokenDecimals
          )

          const datesUnix = getStepsUnixTimestamps(e.startDate, e.endDate, e.steps)
          const tranches = getAmountAndDatePerStepWithFeeBI(
            amountPerStepBI,
            datesUnix,
            amountWithFeeBI
          )

          const total = acc + (tranches.at(-1)?.amount ?? 0n)

          return total
        }

        if ('months' in e && typeof e.months === 'number') {
          const amountPerMonth = e.amount / e.months

          const amountPerMonthBI = BigInt(Math.floor(amountPerMonth * 10 ** tokenDecimals))

          const amountWithFeeBI = computeAmountWithFeeBI(
            BigInt(e.amount * 10 ** tokenDecimals),
            Number(feePercentageValue) / 10000,
            tokenDecimals
          )
          const tranches = getAmountAndDatePerMonthWithFeeBI(
            amountPerMonthBI,
            e.months,
            e.startDate,
            amountWithFeeBI
          )

          const total = acc + (tranches.at(-1)?.amount ?? 0n)
          return total
        }

        return (
          computeAmountWithFeeBI(
            BigInt(e.amount * 10 ** tokenDecimals),
            Number(feePercentageValue) / 10000,
            tokenDecimals
          ) + acc
        )
      }, BigInt(0))

      const needsApproval = tokenAllowance < totalAmount

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

      const simulationOptions: SimulationOptions = {
        vestingContract: vestingContract as Address,
        tokenAddress: store.tokenAddress as Address,
        tokenDecimals,
        fluxSettings: store.fluxSettings,
        mintSettings: store.mintSettings,
        chainId,
      }

      const isAllowed =
        store.mintSettings.isMintAllowed && store.mintSettings.isMintForRecipientsAllowed
      const currentEmissionType = store.emissionType.value
      const fluxHandler = fluxHandlers[currentEmissionType]

      if (!fluxHandler) {
        throw new Error(`No handler found for emission type: ${currentEmissionType}`)
      }

      // Instead of using getFluxes, we'll use the activeFluxes which contains the fluxes for the current emission type
      const fluxes = store.activeFluxes

      for (let i = 0; i < fluxes.length; i++) {
        const flux = fluxes[i]
        if (flux.isCompleted) continue

        try {
          const simulateCreateVesting = await fluxHandler(
            flux,
            simulationOptions,
            Number(feePercentageValue),
            flatFeeValue
          )
          await handleSimulateVesting(simulateCreateVesting, isAllowed)

          store.setFluxes(currentEmissionType, (prev) => {
            const newFluxes = [...prev]
            newFluxes[i] = { ...newFluxes[i], isCompleted: true }
            return newFluxes
          })
        } catch (error) {
          toast.error(
            `Failed to process vesting ${i + 1}: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          )

          throw error
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
    maxFluxes: store.maxFluxes,
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

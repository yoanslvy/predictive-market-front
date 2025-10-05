import { useQuery } from '@tanstack/react-query'

import { Address } from 'viem'

import { config } from '@/src/app/(providers)/wagmiConfig'
import { readContracts } from '@wagmi/core'

import { vestingManagerAbi } from '@/src/interfaces/web3/abis/vestingManager'

import { createBatches } from '../../../_utils/utils'
import { recipientHandlers, SimulationOptions } from './useAirdrop'
import { Recipient, useAirdropStore } from './useAirdropStore'
import { useVestingFeesExemption } from './useVestingFeesExemption'

export function useAirdropBatches({
  recipients,
  vestingContract,
  chainId,
  enabled = true,
  wallet,
}: {
  recipients: Recipient[]
  vestingContract: string
  chainId: number
  enabled?: boolean
  wallet: string
}) {
  const store = useAirdropStore((s) => ({
    startDate: s.startDate,
    endDate: s.endDate,
    steps: s.steps,
    fluxSettings: s.fluxSettings,
    tokenAddress: s.tokenAddress,
    mintSettings: s.mintSettings,
    tokenDecimals: s.tokenDecimals,
    emissionType: s.emissionType,
    distributionType: s.distributionType,
  }))

  const { feeExemptionData } = useVestingFeesExemption(
    vestingContract as Address,
    chainId,
    wallet as Address,
    store.tokenAddress as Address
  )

  const airdropBatchesQuery = useQuery({
    queryKey: [
      'batches',
      recipients.map((r) => `${r.address}-${r.amount}`).join('_'),
      vestingContract,
      chainId,
      store.startDate,
      store.endDate,
      store.steps,
      store.fluxSettings,
      store.mintSettings,
      store.tokenDecimals,
      store.emissionType,
      store.tokenAddress,
    ],
    enabled,
    queryFn: async () => {
      if (!enabled) return []
      if (!store.tokenDecimals) throw new Error('Token decimals not set in store')
      const [feePercentage, flatFee] = await readContracts(config, {
        contracts: [
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

      if (flatFee.error) {
        throw new Error('Failed to get flat fee')
      }

      if (feePercentage.error) {
        throw new Error('Failed to get fee percentage')
      }

      let feePercentageValue = feePercentage.result
      let flatFeeValue = flatFee.result

      if (feeExemptionData?.[0]?.result || feeExemptionData?.[1]?.result) {
        flatFeeValue = 0n
        feePercentageValue = 0n
      }

      const simulationOptions: SimulationOptions = {
        vestingContract: vestingContract as Address,
        tokenAddress: store.tokenAddress as Address,
        tokenDecimals: store.tokenDecimals,
        fluxSettings: store.fluxSettings,
        mintSettings: store.mintSettings,
        chainId,
        startDate: store.startDate,
        endDate: store.endDate,
        steps: store.steps,
      }
      let currentEmissionType: 'scheduled' | 'unlockInSteps' | 'linear' | 'linearBulk' =
        store.emissionType.value
      if (store.distributionType.title === 'Custom' && currentEmissionType === 'linear') {
        currentEmissionType = 'linearBulk'
      }
      const recipientHandler = recipientHandlers[currentEmissionType]
      return createBatches(
        recipients,
        flatFeeValue,
        vestingContract as Address,
        chainId,
        simulationOptions,
        feePercentageValue,
        recipientHandler
      )
    },
  })
  return {
    airdropBatchesQuery,
  }
}

import type { Address } from 'viem'

import { chains } from '@/src/app/(providers)/wagmiConfig'
import { useReadContracts } from 'wagmi'

import { vestingManagerAbi } from '@/src/interfaces/web3/abis/vestingManager'

export function useVestingFees(vestingContract: Address, chainId: number) {
  const result = useReadContracts({
    contracts: [
      {
        address: vestingContract,
        abi: vestingManagerAbi,
        functionName: 'feePercentage',
        chainId,
      },
      {
        address: vestingContract,
        abi: vestingManagerAbi,
        functionName: 'flatFee',
        chainId,
      },
    ],
  })

  const nativeCurrency = chains.find((e) => e.id === chainId)?.nativeCurrency?.symbol || 'ETH'
  const nativeCurrencyDecimals =
    chains.find((e) => e.id === chainId)?.nativeCurrency?.decimals || 18

  return {
    feeData: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
    nativeCurrency,
    nativeCurrencyDecimals,
  }
}

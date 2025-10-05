import type { Address } from 'viem'

import { useReadContracts } from 'wagmi'

import { vestingManagerAbi } from '@/src/interfaces/web3/abis/vestingManager'

export function useVestingFeesExemption(
  vestingContract: Address,
  chainId: number,
  wallet: Address,
  token: Address
) {
  const result = useReadContracts({
    contracts: [
      {
        address: vestingContract,
        abi: vestingManagerAbi,
        functionName: 'feeExemptCreators',
        chainId,
        args: [wallet],
      },
      {
        address: vestingContract,
        abi: vestingManagerAbi,
        functionName: 'feeExemptTokens',
        args: [token],
        chainId,
      },
    ],
    query: {
      enabled: Boolean(vestingContract) && Boolean(wallet) && Boolean(token),
    },
  })

  return {
    feeExemptionData: result.data,
    isLoading: result.isLoading,
    isError: result.isError,
  }
}

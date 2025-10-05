import { useMutation } from '@tanstack/react-query'

type MutationArgs = {
  chainId: number
  vestingId: number
  wallet: string
  isAllowed: boolean
  signature: string
}

export function useSaveVestingAllowMint() {
  return useMutation({
    mutationFn: async ({ chainId, vestingId, wallet, isAllowed, signature }: MutationArgs) => {
      const body = {
        vestingId,
        isAllowed,
        signature,
      }
      const response = await fetch(
        `/api/vesting-v2/saveAllowMintNFT?wallet=${wallet}&chain=${chainId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
      if (!response.ok) {
        throw new Error('Failed to save vestings')
      }
      return response.json()
    },
  })
}

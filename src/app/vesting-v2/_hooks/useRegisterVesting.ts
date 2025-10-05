import { useMutation } from '@tanstack/react-query'

type MutationArgs = {
  chainId: number
  vestingIds: number[]
  wallet: string
  isAllowed: boolean
  signature: string
  coverPicture: string | null
  profilePicture: string | null
}

export function useRegisterVesting() {
  return useMutation({
    mutationFn: async ({
      chainId,
      vestingIds,
      wallet,
      isAllowed,
      signature,
      coverPicture,
      profilePicture,
    }: MutationArgs) => {
      const body = {
        vestingIds,
        isAllowed,
        coverPicture,
        profilePicture,
        chainId,
        signature,
      }
      const response = await fetch(
        `/api/vesting-v2/registerVesting?wallet=${wallet}&chain=${chainId}`,
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

import { useMutation } from '@tanstack/react-query'

type MutationArgs = {
  chainId: number
  vestingId: number
  wallet: string
  signature: string
  coverPicture: string | null
  profilePicture: string | null
}

export function useUpdateImages() {
  return useMutation({
    mutationFn: async ({
      chainId,
      vestingId,
      wallet,
      signature,
      coverPicture,
      profilePicture,
    }: MutationArgs) => {
      const body = {
        vestingId,
        signature,
        coverPicture,
        profilePicture,
      }
      const response = await fetch(
        `/api/vesting-v2/updateVestingPictures?wallet=${wallet.toLowerCase()}&chainId=${chainId}`,
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

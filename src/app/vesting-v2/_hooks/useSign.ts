import { toast } from 'react-toastify'

import { useSignTypedData } from 'wagmi'

import {
  getAddGroupMember,
  getCreateGroupMessage,
  getDomain,
  getRegisterVestingMessage,
  getRemoveGroup,
  getRemoveGroupMember,
  getSignInMessage,
  getSignUpdateAllowMintNftMessage,
  getSignUpdateGroupNameMessage,
  getSignUpdateImagesMessage,
  getTypes,
} from '../_auth/constants'

export function useSign() {
  const client = useSignTypedData()

  const domain = getDomain()
  const types = getTypes()

  async function signUpdateAllowMintNft({
    chainId,
    vestingId,
  }: {
    chainId: number
    vestingId: number
  }) {
    if (!client) {
      toast.error('Wallet not connected')
      return null
    }
    const message = getSignUpdateAllowMintNftMessage({ chainId, vestingId })
    return client
      .signTypedDataAsync({ domain, types, message, primaryType: 'Message' })
      .catch(() => {
        toast.error('User rejected signature')
        return null
      })
  }

  async function signSignIn({ wallet }: { wallet: string }) {
    if (!client) {
      toast.error('Wallet not connected')
      return null
    }
    const message = getSignInMessage({ wallet })
    return client
      .signTypedDataAsync({ domain, types, message, primaryType: 'Message' })
      .catch(() => {
        toast.error('User rejected signature')
        return null
      })
  }

  async function signRegisterVesting({
    chainId,
    vestingIds,
  }: {
    chainId: number
    vestingIds: number[]
  }) {
    if (!client) {
      toast.error('Wallet not connected')
      return null
    }
    const message = getRegisterVestingMessage({ chainId, vestingIds })
    return client
      .signTypedDataAsync({ domain, types, message, primaryType: 'Message' })
      .catch(() => {
        toast.error('User rejected signature')
        return null
      })
  }

  async function signUpdateImages({ chainId, vestingId }: { chainId: number; vestingId: number }) {
    if (!client) {
      toast.error('Wallet not connected')
      return null
    }
    const message = getSignUpdateImagesMessage({ chainId, vestingId })
    return client
      .signTypedDataAsync({ domain, types, message, primaryType: 'Message' })
      .catch(() => {
        toast.error('User rejected signature')
        return null
      })
  }

  async function signChangeGroupName({ groupId, newName }: { groupId: string; newName: string }) {
    if (!client) {
      toast.error('Wallet not connected')
      return null
    }
    const message = getSignUpdateGroupNameMessage({ groupId, newName })
    return client
      .signTypedDataAsync({ domain, types, message, primaryType: 'Message' })
      .catch(() => {
        toast.error('User rejected signature')
        return null
      })
  }

  async function signCreateGroup({ owner, name }: { owner: string; name: string }) {
    if (!client) {
      toast.error('Wallet not connected')
      return null
    }
    const message = getCreateGroupMessage({ owner: owner.toLowerCase(), name })
    return client
      .signTypedDataAsync({ domain, types, message, primaryType: 'Message' })
      .catch(() => {
        toast.error('User rejected signature')
        return null
      })
  }

  async function signAddGroupMember({ groupId }: { groupId: string }) {
    if (!client) {
      toast.error('Wallet not connected')
      return null
    }
    const message = getAddGroupMember({ groupId })
    return client
      .signTypedDataAsync({ domain, types, message, primaryType: 'Message' })
      .catch(() => {
        toast.error('User rejected signature')
        return null
      })
  }

  async function signRemoveGroupMember({ groupId }: { groupId: string }) {
    if (!client) {
      toast.error('Wallet not connected')
      return null
    }
    const message = getRemoveGroupMember({ groupId })
    return client
      .signTypedDataAsync({ domain, types, message, primaryType: 'Message' })
      .catch(() => {
        toast.error('User rejected signature')
        return null
      })
  }

  async function signRemoveGroup({ groupId }: { groupId: string }) {
    if (!client) {
      toast.error('Wallet not connected')
      return null
    }
    const message = getRemoveGroup({ groupId })
    return client
      .signTypedDataAsync({ domain, types, message, primaryType: 'Message' })
      .catch(() => {
        toast.error('User rejected signature')
        return null
      })
  }

  return {
    signUpdateAllowMintNft,
    signRegisterVesting,
    signUpdateImages,
    signChangeGroupName,
    signSignIn,
    signCreateGroup,
    signAddGroupMember,
    signRemoveGroup,
    signRemoveGroupMember,
  }
}

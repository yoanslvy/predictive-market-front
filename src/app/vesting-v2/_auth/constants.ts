export function getDomain() {
  return {
    name: 'Unicrypt',
  }
}

export function getTypes() {
  return {
    Message: [{ name: 'content', type: 'string' }],
  }
}

export function getSignUpdateAllowMintNftMessage({
  chainId,
  vestingId,
}: {
  chainId: number
  vestingId: number
}) {
  return {
    content: `updateVestingApiParams-chainId:${chainId}-vestingId:${vestingId}`,
  }
}

export function getSignUpdateImagesMessage({
  chainId,
  vestingId,
}: {
  chainId: number
  vestingId: number
}) {
  return {
    content: `updateVestingApiParams-chainId:${chainId}-vestingId:${vestingId}`,
  }
}

export function getSignUpdateGroupNameMessage({
  groupId,
  newName,
}: {
  groupId: string
  newName: string
}) {
  return {
    content: `updateGroupName-groupId:${groupId}-newName:${newName}`,
  }
}

export function getRegisterVestingMessage({
  chainId,
  vestingIds,
}: {
  chainId: number
  vestingIds: number[]
}) {
  return {
    content: `registerVesting-chainId:${chainId}-vestingIds:${vestingIds.join(',')}`,
  }
}

export function getSignInMessage({ wallet }: { wallet: string }) {
  return {
    content: `Sign in to UNCX Network - ${wallet.toLowerCase()}`,
  }
}

export function getCreateGroupMessage({ name, owner }: { name: string; owner: string }) {
  return {
    content: `createGroup-name:${name}-owner:${owner}`,
  }
}

export function getAddGroupMember({ groupId }: { groupId: string }) {
  return {
    content: `addGroupMember-groupId:${groupId}`,
  }
}

export function getRemoveGroupMember({ groupId }: { groupId: string }) {
  return {
    content: `removeGroupMember-groupId:${groupId}`,
  }
}

export function getRemoveGroup({ groupId }: { groupId: string }) {
  return {
    content: `removeGroup-groupId:${groupId}`,
  }
}

export const accessTokenMaxAge = 60 * 60 // 1 hour in seconds
export const refreshTokenMaxAge = 7 * 24 * 60 * 60 // 7 days in seconds

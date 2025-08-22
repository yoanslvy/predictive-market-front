'use server'


import { chainLockersV2EndpointMap } from '@utils/global'
import { getBuiltGraphSDK } from '@/.graphclient'


const sdk = getBuiltGraphSDK()


export const getUserLocks = async (chain: string, owner: string) => {
  let data = await sdk.UserLocksQuery({ owner: owner.toLowerCase(), chain: +chain }, { chainName: chainLockersV2EndpointMap[chain] })
  return JSON.parse(JSON.stringify(data));;
}
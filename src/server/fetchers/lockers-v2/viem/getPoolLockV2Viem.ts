import { PublicClient, getContract } from 'viem'

import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"

import lockers_V2_1_Basic from '@/src/interfaces/web3/abis/lockers_V2_1_Basic'
import lockers_V2_Basic from '@/src/interfaces/web3/abis/lockers_V2_Basic'
import { chainFactoryLockerMap, factoryAddressAerodrome, lockerAerodrome } from '@/src/utils/global'
import lockerAerodrome_V2_Basic from '@/src/interfaces/web3/abis/lockerAerodrome_V2_Basic'


// TODO: check and adjust so that v2 only works on set old contracts

export async function getLockForPool(
  chain: string,
  token: string,
  lockId: string,
  factory: string,
) {

  try {

    let publicClient: PublicClient = serverWeb3Client.getClient(chain)

    if (chain === '8453') {
      publicClient = serverWeb3Client.getBaseClient(chain) as PublicClient
    }


    let lock = await getLocks(

      publicClient,
      {
        tokenAddress: token as `0x${string}`,
        chainID: chain,
        lockId: lockId,
        factory: factory as `0x${string}`
      })

    if (lock) {
      return {
        success: true,
        result: {
          id: lock.id,
          lpToken: token,
          lockDate: lock.unlockDate,
          amount: lock.amount,
          initialAmount: lock.initialAmount,
          unlockDate: lock.unlockDate,
          lockID: lock.lockID,
          owner: lock.owner,
          countryCode: lock.countryCode,
          gauge: lock.gauge
        }

      }
    } else {
      return undefined
    }

  } catch (error: any) {
    return { success: false, error: error.message }; // Rejected error
  }
}


const getLocks = async (client: PublicClient, params: {
  chainID: string,
  tokenAddress: `0x${string}`,
  lockId: string,
  factory: `0x${string}`
}) => {

  // ABI switching
  // number of locks for a token
  let lockerV2 = chainFactoryLockerMap['lockers-v2'][params.chainID.concat('-').concat(params.factory.toLowerCase())]
  let lockerV2_2 = chainFactoryLockerMap['lockers-v2_1'][params.chainID.concat('-').concat(params.factory.toLowerCase())]
  let lockerAerodromeV2 = factoryAddressAerodrome['V2'].toLowerCase() === params.factory.toLowerCase() && lockerAerodrome['V2']


  if (lockerV2) {

    let lockerContract_V2 = getContract({
      address: chainFactoryLockerMap['lockers-v2'][params.chainID.concat('-').concat(params.factory.toLowerCase())], // as `0x${string}`
      client,
      abi: lockers_V2_Basic
    })

    let lock = await lockerContract_V2.read.tokenLocks([params.tokenAddress, BigInt(params.lockId)])


    return {
      id: (lockerV2).toLowerCase().concat(params.tokenAddress.toLowerCase()).concat(lock[4].toString()),
      lpToken: params.tokenAddress,
      lockDate: lock[0],
      amount: lock[1],
      initialAmount: lock[2],
      unlockDate: lock[3],
      lockID: lock[4],
      owner: lock[5],
      countryCode: undefined
    }

  }
  // loop get locks in parallel


  if (lockerV2_2) {
    let lockerContract_V2_1 = getContract({
      address: chainFactoryLockerMap['lockers-v2_1'][params.chainID.concat('-').concat(params.factory.toLowerCase())], // as `0x${string}`
      client,
      abi: lockers_V2_1_Basic
    })
    const lock = await lockerContract_V2_1.read.LOCKS([BigInt(params.lockId)])


    return {
      id: (lockerV2_2).toLowerCase().concat(lock[0].toLowerCase()).concat(lock[5].toString()),
      lpToken: lock[0],
      lockDate: lock[1],
      amount: lock[2],
      initialAmount: lock[3],
      unlockDate: lock[4],
      lockID: lock[5],
      owner: lock[6],
      countryCode: lock[7]
    }
  }

  if (lockerAerodromeV2) {

    let lockerContract_Aerodrome_V2 = getContract({
      address: lockerAerodromeV2 as `0x${string}`,
      client,
      abi: lockerAerodrome_V2_Basic
    })


    const locks = await lockerContract_Aerodrome_V2.read.LOCKS([BigInt(params.lockId)])

    return {
      lpToken: locks[0],
      lockDate: locks[1],
      amount: locks[2],
      initialAmount: locks[3],
      unlockDate: locks[4],
      lockID: locks[5],
      owner: locks[6],
      countryCode: locks[7],
      gauge: locks[8],
    }
  }


}

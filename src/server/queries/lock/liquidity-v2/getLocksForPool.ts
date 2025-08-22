import { PublicClient, getContract } from 'viem'


import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"

import lockers_V2_1_Basic from '@/src/interfaces/web3/abis/lockers_V2_1_Basic'
import lockers_V2_Basic from '@/src/interfaces/web3/abis/lockers_V2_Basic'
import { chainFactoryLockerMap } from '@/src/utils/global'

const Self = {

  async getLocksForPool(
    chain: string,
    token: string,
    factory: string,
    wallet?: string
  ) {

    try {

      let publicClient: PublicClient = serverWeb3Client.getClient(chain)

      if (chain === '8453') {
        publicClient = serverWeb3Client.getBaseClient(chain) as PublicClient
      }


      let locks = await getLocks(

        publicClient,
        {
          tokenAddress: token as `0x${string}`,
          chainID: chain,
          factory: factory as `0x${string}`
          // walletAddress: wallet ? `0x${wallet}` : undefined,
        })

      return {
        success: true,
        result: locks.map((lock) => {
          return {
            lpToken: token,
            lockDate: lock.unlockDate,
            amount: lock.amount,
            initialAmount: lock.initialAmount,
            unlockDate: lock.unlockDate,
            lockID: lock.lockID,
            owner: lock.owner,
            countryCode: lock.countryCode
          }
        })
      }

    } catch (error: any) {
      return { success: false, error: error.message }; // Rejected error
    }
  }
}

const getLocks = async (client: PublicClient, params: {
  chainID: string,
  tokenAddress: `0x${string}`,
  factory: `0x${string}`
  // walletAddress?: `0x${string}`
}) => {


  // ABI switching
  // number of locks for a token


  // loop get locks in parallel

  let lockerContract_V2 = getContract({
    address: chainFactoryLockerMap['lockers-v2'][params.chainID.concat('-').concat(params.factory.toLowerCase())], // as `0x${string}`
    client,
    abi: lockers_V2_Basic
  })

  let lockerContract_V2_1 = getContract({
    address: chainFactoryLockerMap['lockers-v2_1'][params.chainID.concat('-').concat(params.factory.toLowerCase())], // as `0x${string}`
    client,
    abi: lockers_V2_1_Basic
  })

  const numberOfLocks = (params.chainID == '5' || params.chainID == '42161') ?
    await lockerContract_V2_1.read.getNumLocksForToken([params.tokenAddress]) :
    await lockerContract_V2.read.getNumLocksForToken([params.tokenAddress])

  if (params.chainID == '5' || params.chainID == '42161') {

    let lockIdCalls_V2_1 = Array.from({ length: Number(numberOfLocks) }, (_, index) => {
      return lockerContract_V2_1.read.TOKEN_LOCKS([params.tokenAddress, BigInt(index)])
    })

    const lockIds_V2_1 = await Promise.all(
      lockIdCalls_V2_1,
    )


    const lockCalls_V2_1 = lockIds_V2_1.map((lockId: bigint) => {
      return lockerContract_V2_1.read.LOCKS([lockId])
    })

    const locks_V2_1 = await Promise.all(
      lockCalls_V2_1
    )

    return locks_V2_1.map((lock) => {

      return {
        lpToken: lock[0],
        lockDate: lock[1],
        amount: lock[2],
        initialAmount: lock[3],
        unlockDate: lock[4],
        lockID: lock[5],
        owner: lock[6],
        countryCode: lock[7]
      }
    })


  } else {

    let lockCall_V2 = Array.from({ length: Number(numberOfLocks) }, (_, index) => {
      return lockerContract_V2.read.tokenLocks([params.tokenAddress, BigInt(index)])
    })

    const locks_V2 = await Promise.all(
      lockCall_V2,
    )

    return locks_V2.map((lock) => {
      return {
        lpToken: undefined,
        lockDate: lock[0],
        amount: lock[1],
        initialAmount: lock[2],
        unlockDate: lock[3],
        lockID: lock[4],
        owner: lock[5],
        countryCode: undefined
      }
    })
  }



  // let lockIdCalls_V2_1 = Array.from({ length: Number(numberOfLocks) }, (_, index) => {
  //   return lockerContract.read.TOKEN_LOCKS([params.tokenAddress, BigInt(index)])
  // })






  // const lockCalls_V2 = lockIds_V2.map((lockId: bigint) => {
  //   return lockerContract_V2.read.tokenLocks //([lockId])
  // })




}

export default Self;


// function getLocksForPool(pool: string, chain: string) {

// return array of lock objects
// }

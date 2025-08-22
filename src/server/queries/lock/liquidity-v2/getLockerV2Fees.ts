import { PublicClient, getContract } from 'viem'


import erc20basic from '@/src/interfaces/web3/abis/erc20basic'
import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"

import lockersV2P1basic from '@/src/interfaces/web3/abis/lockers_V2_1_Basic'
import lockerAerodrome_V2_Basic from '@/src/interfaces/web3/abis/lockerAerodrome_V2_Basic'



export type FeeData = Awaited<ReturnType<typeof Self.getLockerV2Fees>>;

const Self = {

  async getLockerV2Fees(
    chain: string,
    locker: string
  ) {

    try {

      let publicClient: PublicClient = serverWeb3Client.getClient(chain)

      if (chain === '8453') {
        publicClient = serverWeb3Client.getBaseClient(chain) as PublicClient
      }

      let fees = await getFees(

        publicClient,
        {
          // chainID: chain,
          locker: locker
          // walletAddress: wallet ? `0x${wallet}` : undefined,
        })

      return {
        success: true,
        result: fees
      }

    } catch (error: any) {
      return { success: false, error: error.message }; // Rejected error
    }
  }
}

const getFees = async (client: PublicClient, params: {
  // chainID: string,
  locker: string
  // walletAddress?: `0x${string}`
}) => {

  let fees

  try {
    let lockerContract = getContract({
      address: params.locker as `0x${string}`, // as `0x${string}`
      client,
      abi: lockersV2P1basic
    })

    fees = await lockerContract.read.gFees()

  } catch {
    let lockerContract = getContract({
      address: params.locker as `0x${string}`, // as `0x${string}`
      client,
      abi: lockerAerodrome_V2_Basic
    })

    fees = await lockerContract.read.gFees()

  }

  return fees
}

export default Self;
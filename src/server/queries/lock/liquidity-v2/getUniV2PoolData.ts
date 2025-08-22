import { PublicClient, getContract } from 'viem'


import poolV2basic from '@/src/interfaces/web3/abis/poolV2basic'
import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"
import erc20basic from '@/src/interfaces/web3/abis/erc20basic'





const Self = {

  async getUniV2PoolDataImmutable(
    chain: string, token: string) {

    let publicClient: PublicClient = serverWeb3Client.getClient(chain)

    if (chain === '8453') {
      publicClient = serverWeb3Client.getBaseClient(chain) as PublicClient
    }


    let res = await getUniV2DataImmutable(

      publicClient,
      {
        tokenAddress: token as `0x${string}`,
        chainID: chain
      })


    if (res && res.success) {
      return {
        success: true, result: {

          pool: res.pool,
          token0: res.token0,
          token1: res.token1

        }
      };
    }


    // catch 
    if (!res.success) {
      return { success: false, error: res.error }; // Rejected error
    }
  }
}

const getUniV2DataImmutable = async (client: PublicClient, params: {
  chainID: string,
  tokenAddress: `0x${string}`,
}) => {
  try {
    let contract = getContract({
      address: params.tokenAddress, // as `0x${string}`
      client,
      abi: poolV2basic
    })


    const pool = Promise.all([
      // contract.read.name(),
      contract.read.token0(),
      contract.read.token1(),
      contract.read.factory(),
      // contract.read.symbol(),
      // contract.read.decimals(),
    ])

    let poolResult = await pool

    let token0 = getContract({
      address: poolResult[0], // as `0x${string}`
      client,
      abi: erc20basic
    })


    let token1 = getContract({
      address: poolResult[1], // as `0x${string}`
      client,
      abi: erc20basic
    })

    let token0Values = Promise.all([
      token0.read.name(),
      token0.read.symbol(),
      token0.read.decimals()
    ])


    let token1Values = Promise.all([
      token1.read.name(),
      token1.read.symbol(),
      token0.read.decimals()
    ])

    let token0Result = await token0Values
    let token1Result = await token1Values
    let result = {
      success: true,
      token0: token0Result,
      token1: token1Result,
      pool: poolResult,
      error: undefined

    }
    return result

  } catch (error: any) {
    return {
      success: false,
      token0: null,
      token1: null,
      pool: null,
      error: error.message
    }; // Rejected error
  }

}

export default Self;





// contract.read.totalSupply(),
// params.walletAddress ? contract.read.balanceOf([params.walletAddress]) : undefined,
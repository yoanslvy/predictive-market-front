import { PublicClient, getContract } from 'viem'


import erc20basic from '@/src/interfaces/web3/abis/erc20basic'
import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"

import GetErc20Data from "@server/queries/erc20/getErc20Data"


// Legacy wrapper
const Self = {

  async getErc20DataUserViem(
    chain: string, token: string, wallet?: string) {


    let result = await GetErc20Data.getErc20Data(chain, token, wallet!)

    if (result.success) {

      return {
        success: true, result: {

          name: result.result!.name,
          symbol: result.result!.symbol,
          decimals: result.result!.decimals,
          totalSupply: result.result!.totalSupply,
          balance: result.result!.balance!
        },

      };
    } else {
      return { success: false, error: result.error!.message }; // Rejected error
    }
  }

}

const getErcData = (client: PublicClient, params: {
  chainID: string,
  tokenAddress: `0x${string}`,
  walletAddress?: `0x${string}`
}) => {
  let contract = getContract({
    address: params.tokenAddress, // as `0x${string}`
    client,
    abi: erc20basic
  })


  const values = Promise.all([
    contract.read.name(),
    contract.read.symbol(),
    contract.read.decimals(),
    contract.read.totalSupply(),
    params.walletAddress ? contract.read.balanceOf([params.walletAddress]) : undefined,
  ])
  return values
}

export default Self;
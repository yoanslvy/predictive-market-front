import { PublicClient, getContract } from 'viem'


import erc20basic from '@/src/interfaces/web3/abis/erc20basic'
import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"



const Self = {

  async getErc20Allowance(
    chain: string, token: string, wallet: string, spenderContract: string) {

    try {

      let client: PublicClient = serverWeb3Client.getClient(chain)

      if (chain === '8453') {
        client = serverWeb3Client.getBaseClient(chain) as PublicClient
      }


      let res = await getAllowance(

        client,
        {
          tokenAddress: token as `0x${string}`,
          walletAddress: wallet as `0x${string}`,
          spenderContract: spenderContract as `0x${string}`,
          chainID: chain
        })

      return {
        success: true, result: {

          allowedAmount: res[0]
        }
      };

    } catch (error: any) {
      return { success: false, error: error.message }; // Rejected error
    }
  }
}

const getAllowance = (client: PublicClient, params: {
  chainID: string,
  tokenAddress: `0x${string}`,
  walletAddress: `0x${string}`,
  spenderContract: `0x${string}`
}) => {
  let contract = getContract({
    address: params.tokenAddress, // as `0x${string}`
    client,
    abi: erc20basic
  })

  const values = Promise.all([contract.read.allowance([params.walletAddress, params.spenderContract])])

  return values
}

export default Self;
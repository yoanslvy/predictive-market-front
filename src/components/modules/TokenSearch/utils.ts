import { isAddress } from 'viem'

import GetErc20Balance from '@server/queries/erc20/getErc20Balance'
import GetERC20DataViem from '@server/queries/erc20/getErc20Data'

import { TokenData } from './TokenSearch'
// import { getPoolByTokensDataViem } from '@/src/server/fetchers/lockers-v2/viem/getPoolByTokensV2'

export const getTokenData = async (
  chainId: string,
  wallet: string,
  address: string,
): Promise<TokenData | null> => {


  

  // let pool = (amm && token0 && token1) ? await getPoolByTokensDataViem(chainId, amm, token0, token1) : undefined

  
  
  // let currentPool = (pool && pool.result && pool.result.pool?.id) ? pool.result?.pool?.id : poolId
  
  // if (!currentPool) {
  //   return null
  // }
  // console.log(currentPool, 'currentPool');
  
  const [tokenData] = await Promise.all([
    GetERC20DataViem.getErc20Data(chainId, address, wallet),
    // GetErc20Balance.getErc20Balance(chainId, address, wallet),
  ])
  

    

    if (tokenData.result) {

      return {
        id: address,
        address: address,
        balance: tokenData.result?.balance || 0n,
        symbol: tokenData.result?.symbol || '',
        name: tokenData.result?.name || '',
        decimals: BigInt(tokenData.result.decimals) || 0n,
      }

    } else {
      return null
    }

}

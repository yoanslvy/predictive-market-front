import { isAddress } from 'viem'

import GetErc20Balance from '@server/queries/erc20/getErc20Balance'
import GetUniV2PoolDataViem from '@server/queries/lock/liquidity-v2/getUniV2PoolData'

import { PoolData } from './PoolSearch'
import { getPoolByTokensDataViem } from '@/src/server/fetchers/lockers-v2/viem/getPoolByTokensV2'

export const getPoolData = async (
  chainId: string,
  wallet: string,
  poolId?: string,

  amm?: string,
  token0?: string,
  token1?: string

): Promise<PoolData | null> => {


  

  let pool = (amm && token0 && token1) ? await getPoolByTokensDataViem(chainId, amm, token0, token1) : undefined

  
  
  let currentPool = (pool && pool.result && pool.result.pool?.id) ? pool.result?.pool?.id : poolId
  
  if (!currentPool) {
    return null
  }
  // console.log(currentPool, 'currentPool');
  
  const [poolData, balanceData] = await Promise.allSettled([
    GetUniV2PoolDataViem.getUniV2PoolDataImmutable(chainId, currentPool),
    GetErc20Balance.getErc20Balance(chainId, currentPool, wallet),
  ])

  if (poolData.status === 'fulfilled' && balanceData.status === 'fulfilled') {
    const poolValue = poolData.value?.success ? poolData.value?.result : null
    const balanceValue = balanceData.value?.success ? balanceData.value?.result : null

    const isPoolData = poolValue?.token0 && poolValue.token1 && poolValue.pool

    if (!isPoolData) {
      return null
    }

    return {
      id: currentPool,
      token0_symbol: poolValue.token0?.[1] || '',
      token1_symbol: poolValue.token1?.[1] || '',
      token0: poolValue?.pool?.[0] || '',
      token1: poolValue?.pool?.[1] || '',
      factoryId: poolValue?.pool?.[2] || '',
      balance: balanceValue?.balance || 0n,
    }
  }

  return null
}

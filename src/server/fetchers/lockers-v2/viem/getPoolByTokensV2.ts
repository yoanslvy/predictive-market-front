import { PublicClient, getContract } from 'viem'


import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"


import { unstable_cache } from 'next/cache'
import poolV2factory from '@/src/interfaces/web3/abis/poolV2factory'




export async function getPoolByTokensDataViem(chain: string, amm: string, token0: string, token1: string) {

  let publicClient: PublicClient = serverWeb3Client.getClient(chain)

  if (chain === '8453') {
    publicClient = serverWeb3Client.getBaseClient(chain) as PublicClient
  }


  let res = await getUniV2DataViem(

    publicClient,
    {
      // tokenAddress: token as `0x${string}`,
      chainID: chain,
      amm: amm as `0x${string}`,
      token0: token0 as `0x${string}`,
      token1: token1 as `0x${string}`,
    })


  if (res && res.success) {
    return {
      success: true, result: {
        pool: res.pool,
      }
    };
  }


  // catch 
  if (!res.success) {
    return { success: false, error: res.error }; // Rejected error
  }
}

const getUniV2DataViem = async (client: PublicClient, params: {
  chainID: string,
  amm: `0x${string}`,
  token0: `0x${string}`,
  token1: `0x${string}`,
}) => {
  try {


    let contract = getContract({
      address: params.amm, // as `0x${string}`
      client,
      abi: poolV2factory
    })

    const poolData = await Promise.all([
      contract.read.getPair([params.token0, params.token1])
    ])


    let result = {
      success: true,
      pool: {
        id: poolData.toString(),
      },
      error: undefined

    }
    return result

  } catch (error: any) {
    return {

      success: false,
      pool: null,
      error: error.message
    }; // Rejected error
  }

}


// cached forever - immutable data

export async function getPoolByTokensV2Cached(chain: string, amm: string, token0: string, token1: string, revalidation: number) {
  // Define a function to fetch data which will be passed to unstable_cache.
  const fetchData = async (chain: string, amm: string, token0: string, token1: string) =>
  // : Promise<LockedPoolDataQueryQuery>

  {
    return getPoolByTokensDataViem(chain, amm, token0, token1);
  };

  // Call unstable_cache with the fetchData function and parameters.
  // The returned function from unstable_cache will be used to get the data.
  const cachedPoolData = unstable_cache(
    fetchData,
    // Cache key includes arguments passed to a function
    // [chain, entriesPerPage, page],
    ['getPoolByTokensV2Cached'],
    {
      revalidate: revalidation,
      // unique tag to revalidate a particular page 
      tags: [`getPoolByTokensV2Cached?chain=${chain}&amm=${amm}&token0=${token0}&token1=${token1}`]
    }
  );

  // Use the cachedPoolData to get the token data.
  // const PoolData = await BigIntSerializer.parse(cachedPoolData(chain, id));
  const poolData = await cachedPoolData(chain, amm, token0, token1);
  return poolData;
}

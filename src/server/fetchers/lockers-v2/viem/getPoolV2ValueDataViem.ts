import { PublicClient, getContract } from 'viem'


import poolV2basic from '@/src/interfaces/web3/abis/poolV2basic'
import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"
import BigIntSerializer from "@interfaces/web3/univ3/bigIntSerializer"


import { unstable_cache } from 'next/cache'




export async function getUniV2PoolDataViem(chain: string, token: string) {


  let publicClient: PublicClient = serverWeb3Client.getClient(chain)

  if (chain === '8453') {
    publicClient = serverWeb3Client.getBaseClient(chain) as PublicClient
  }


  let res = await getUniV2DataViem(

    publicClient,
    {
      tokenAddress: token as `0x${string}`,
      chainID: chain
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
  tokenAddress: `0x${string}`,
}) => {
  try {
    let contract = getContract({
      address: params.tokenAddress, // as `0x${string}`
      client,
      abi: poolV2basic
    })


    const pool = await Promise.all([
      contract.read.totalSupply(),
      contract.read.getReserves()
    ])

    let result = {
      success: true,
      pool: {
        totalSupply: pool[0].toString(),
        reserves: {
          reserve0: pool[1][0].toString(),
          reserve1: pool[1][1].toString()
        },
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

export async function getPoolV2ValueDataViemCached(chain: string, id: string, revalidation: number) {
  // Define a function to fetch data which will be passed to unstable_cache.
  const fetchData = async (chain: string, id: string) =>
  // : Promise<LockedPoolDataQueryQuery>

  {
    return getUniV2PoolDataViem(chain, id);
  };

  // Call unstable_cache with the fetchData function and parameters.
  // The returned function from unstable_cache will be used to get the data.
  const cachedPoolData = unstable_cache(
    fetchData,
    // Cache key includes arguments passed to a function
    // [chain, entriesPerPage, page],
    ['getPoolV2ValueDataViemCached'],
    {
      revalidate: revalidation,
      // unique tag to revalidate a particular page 
      tags: [`getPoolV2ValueDataViemCached?chain=${chain}&id=${id}`]
    }
  );

  // Use the cachedPoolData to get the token data.
  // const PoolData = await BigIntSerializer.parse(cachedPoolData(chain, id));
  const PoolData = await cachedPoolData(chain, id);
  return PoolData;
}

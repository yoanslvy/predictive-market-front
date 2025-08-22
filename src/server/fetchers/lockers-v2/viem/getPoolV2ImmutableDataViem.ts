import { PublicClient, getContract } from 'viem'


import poolV2basic from '@/src/interfaces/web3/abis/poolV2basic'
import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"
import erc20basic from '@/src/interfaces/web3/abis/erc20basic'


import { unstable_cache } from 'next/cache'





export async function getUniV2PoolDataImmutable(chain: string, token: string) {

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


  if (res && res.success && res.pool) {
    return {
      success: true, result: {

        pool: {
          factory: res.pool.factory,
          token0: res.token0,
          token1: res.token1
        },


      }
    };
  }


  // catch 
  if (!res.success) {
    return { success: false, error: res.error }; // Rejected error
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
      contract.read.token0(),
      contract.read.token1(),
      contract.read.factory(),
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

    let tokenValues = await Promise.all([
      token0.read.name(),
      token0.read.symbol(),
      token0.read.decimals(),
      token1.read.name(),
      token1.read.symbol(),
      token1.read.decimals()
    ])


    let result = {
      success: true,
      token0: {
        id: poolResult[0],
        name: tokenValues[0],
        symbol: tokenValues[1],
        decimals: tokenValues[2],
      },
      token1: {
        id: poolResult[1],
        name: tokenValues[3],
        symbol: tokenValues[4],
        decimals: tokenValues[5],
      },
      pool: {
        factory: poolResult[2],
      },
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




// cached forever - immutable data

export async function getPoolV2ViemImmutableCached(chain: string, id: string)
// :
//   Promise<LockedPoolDataQueryQuery> 
{
  // Define a function to fetch data which will be passed to unstable_cache.
  const fetchData = async (chain: string, id: string) =>
  // : Promise<LockedPoolDataQueryQuery>

  {
    return getUniV2PoolDataImmutable(chain, id);
  };

  // Call unstable_cache with the fetchData function and parameters.
  // The returned function from unstable_cache will be used to get the data.
  const cachedPoolData = unstable_cache(
    fetchData,
    // Cache key includes arguments passed to a function
    // [chain, entriesPerPage, page],
    ['getPoolV2ImmutableViemCached'],
    {
      revalidate: 120,
      // unique tag to revalidate a particular page 
      tags: [`getPoolV2ImmutableViemCached?chain=${chain}&id=${id}`]
    }
  );

  // Use the cachedPoolData to get the token data.
  const PoolData = await cachedPoolData(chain, id);
  return PoolData;
}

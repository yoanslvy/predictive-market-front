import { getBuiltGraphSDK, PoolDataV2QueryQuery } from '@/.graphclient'
import { chainLockersV2EndpointMap } from '@/src/utils/global'
import { unstable_cache } from 'next/cache'

const sdk = getBuiltGraphSDK()

export async function poolLocksV2GraphQL(chain: string, pool: string) {

  let data = await sdk.PoolDataV2Query(
    { id: pool, chain: +chain },
    { chainName: chainLockersV2EndpointMap[chain] }
  )

  return data
}

export async function poolLocksV2GraphQLCached(chain: string, pool: string, revalidation: number):
  Promise<PoolDataV2QueryQuery> {
  // Define a function to fetch data which will be passed to unstable_cache.
  const fetchData = async (chain: string, pool: string): Promise<PoolDataV2QueryQuery> => {
    return poolLocksV2GraphQL(chain, pool);
  };

  // Call unstable_cache with the fetchData function and parameters.
  // The returned function from unstable_cache will be used to get the data.
  const cachedTokenData = unstable_cache(
    fetchData,
    // Cache key includes arguments passed to a function
    // [chain, entriesPerPage, page],
    ['poolLocksV2GraphQLCached'],
    {
      revalidate: revalidation,
      // unique tag to revalidate a particular page 
      tags: [`poolLocksV2GraphQLCached?chain=${chain}&pool=${pool}`]
    }
  );

  // Use the cachedTokenData to get the token data.
  const tokenData: PoolDataV2QueryQuery = await cachedTokenData(chain, pool);
  return tokenData;
}
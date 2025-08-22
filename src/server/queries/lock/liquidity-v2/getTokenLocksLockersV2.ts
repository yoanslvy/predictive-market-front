

import { chainLockersV2EndpointMap } from '@/src/utils/global'
import { TokenByIdLockersV2QueryQuery, getBuiltGraphSDK } from '@/.graphclient'
import { unstable_cache } from 'next/cache'

const sdk = getBuiltGraphSDK()

export async function getTokenLocksLockersV2(chain: string, token: string) {


  let data = await sdk.TokenByIdLockersV2Query(
    { tokenId: `${chain}-${token.toLowerCase()}` },
    { chainName: chainLockersV2EndpointMap[chain] }
  )


  return data

}

export async function getTokenLocksLockersV2Cached(chain: string, token: string, revalidation: number):
  Promise<TokenByIdLockersV2QueryQuery> {
  // Define a function to fetch data which will be passed to unstable_cache.
  const fetchData = async (chain: string, token: string): Promise<TokenByIdLockersV2QueryQuery> => {
    return getTokenLocksLockersV2(chain, token);
  };

  // Call unstable_cache with the fetchData function and parameters.
  // The returned function from unstable_cache will be used to get the data.
  const cachedTokenData = unstable_cache(
    fetchData,
    // Cache key includes arguments passed to a function
    // [chain, entriesPerPage, page],
    ['getTokenLocksLockersV2Cached'],
    {
      revalidate: revalidation,
      // unique tag to revalidate a particular page 
      tags: [`getTokenLocksLockersV2Cached?chain=${chain}&token=${token}`]
    }
  );

  // Use the cachedTokenData to get the token data.
  const tokenData: TokenByIdLockersV2QueryQuery = await cachedTokenData(chain, token);
  return tokenData;
}
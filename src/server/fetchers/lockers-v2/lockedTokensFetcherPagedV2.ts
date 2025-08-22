import { getBuiltGraphSDK, LockedTokensPaginatedV2QueryQuery } from '@/.graphclient'
import { chainLockersV2EndpointMap } from '@/src/utils/global'
import { unstable_cache } from 'next/cache'

const sdk = getBuiltGraphSDK()


export async function lockedTokensFetcherPagedV2(chain: string, range: string, page: string, minLocked: string) {

  let offset = (Number(page) - 1) * Number(range)
  let data = await sdk.LockedTokensPaginatedV2Query(
    { chainId: +chain, first: Number(range), offset: offset, minAmountUSD: Number(minLocked) },
    { chainName: chainLockersV2EndpointMap[chain] }
  )

  return data
}

export async function lockedTokensFetcherV2Cached(chain: string, entriesPerPage: string, page: string, minLocked: string, revalidation: number):
  Promise<LockedTokensPaginatedV2QueryQuery> {
  // Define a function to fetch data which will be passed to unstable_cache.
  const fetchData = async (chain: string, entriesPerPage: string, page: string, minLocked: string): Promise<LockedTokensPaginatedV2QueryQuery> => {
    return lockedTokensFetcherPagedV2(chain, entriesPerPage, page, minLocked);
  };

  // Call unstable_cache with the fetchData function and parameters.
  // The returned function from unstable_cache will be used to get the data.
  const cachedTokenData = unstable_cache(
    fetchData,
    // Cache key includes arguments passed to a function
    // [chain, entriesPerPage, page],
    ['tokenPoolPagedTvlFetcherV2Cached'],
    {
      revalidate: revalidation,
      // unique tag to revalidate a particular page 
      tags: [`tokenPoolPagedTvlFetcherV2Cached?chain=${chain}&page=${page}`]
    }

  );

  // Use the cachedTokenData to get the token data.
  const tokenData: LockedTokensPaginatedV2QueryQuery = await cachedTokenData(chain, entriesPerPage, page, minLocked);
  return tokenData;
}
import { getBuiltGraphSDK, LockedPoolsPaginatedV2QueryQuery } from '@/.graphclient'
import { chainLockersV2EndpointMap } from '@/src/utils/global'
import { unstable_cache } from 'next/cache'

const sdk = getBuiltGraphSDK()
const currentTimestampInSeconds = Math.floor(Date.now() / 1000);


export async function lockedPoolsFetcherPagedV2(chain: string, range: string, page: string, minLocked: string) {

  let offset = (Number(page) - 1) * Number(range)


  let data = await sdk.LockedPoolsPaginatedV2Query(
    { minAmountUSD: Number(minLocked), chainId: +chain, currentTimestamp: currentTimestampInSeconds, first: Number(range), offset: offset },
    { chainName: chainLockersV2EndpointMap[chain] }
  )

  return data
}

export async function lockedPoolsFetcherV2Cached(chain: string, entriesPerPage: string, page: string, minLocked: string, revalidation: number):
  Promise<LockedPoolsPaginatedV2QueryQuery> {
  // Define a function to fetch data which will be passed to unstable_cache.
  const fetchData = async (chain: string, entriesPerPage: string, page: string, minLocked: string): Promise<LockedPoolsPaginatedV2QueryQuery> => {
    return lockedPoolsFetcherPagedV2(chain, entriesPerPage, page, minLocked);
  };

  // Call unstable_cache with the fetchData function and parameters.
  // The returned function from unstable_cache will be used to get the data.
  const cachedTokenData = unstable_cache(
    fetchData,
    // Cache key includes arguments passed to a function
    // [chain, entriesPerPage, page],
    ['lockedPoolsFetcherV2Cached'],
    {
      revalidate: revalidation,
      // unique tag to revalidate a particular page 
      tags: [`lockedPoolsFetcherV2Cached?chain=${chain}&page=${page}`]
    }
  );

  // Use the cachedTokenData to get the token data.
  const tokenData: LockedPoolsPaginatedV2QueryQuery = await cachedTokenData(chain, entriesPerPage, page, minLocked);
  return tokenData;
}
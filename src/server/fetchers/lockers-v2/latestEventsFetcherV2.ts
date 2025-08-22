import { getBuiltGraphSDK, LatestEventsV2QueryQuery } from '@/.graphclient'
import { chainLockersV2EndpointMap } from '@/src/utils/global'
import { unstable_cache } from 'next/cache'

const sdk = getBuiltGraphSDK()

// minLocked: string
export async function latestEventsFetcherV2(chain: string, timestamp: string) {

  let data = await sdk.LatestEventsV2Query(
    { chain: +chain, timestamp: timestamp },
    { chainName: chainLockersV2EndpointMap[chain] }
  )

  return data
}

export async function latestEventsFetcherV2Cached(chain: string, revalidation: number, timestamp: bigint):
  Promise<LatestEventsV2QueryQuery> {
  const timestampStr = timestamp?.toString()

  // Define a function to fetch data which will be passed to unstable_cache.
  const fetchData = async (chain: string, timestamp: string): Promise<LatestEventsV2QueryQuery> => {
    return latestEventsFetcherV2(chain, timestamp);
  };

  // Call unstable_cache with the fetchData function and parameters.
  // The returned function from unstable_cache will be used to get the data.
  const latestEventsData = unstable_cache(
    fetchData,
    // Cache key includes arguments passed to a function
    // [chain, entriesPerPage, page],
    ['latestEventsDataV2Cached'],
    {
      revalidate: revalidation,
      // unique tag to revalidate a particular page 
      tags: [`latestEventsDataV2Cached?chain=${chain}`]
    }
  );

  // Use the cachedTokenData to get the token data.
  const tokenData: LatestEventsV2QueryQuery = await latestEventsData(chain, timestampStr);
  return tokenData;
}
import { getBuiltGraphSDK, UserPoolsQueryQuery } from '@/.graphclient'
import { chainUniV2EndpointMap } from '@/src/utils/global'
import { unstable_cache } from 'next/cache'

const sdk = getBuiltGraphSDK()


export async function userPoolFetcherUniV2GraphQL(chain: string, user: string) {


  let data = await sdk.UserPoolsQuery(
    { user: user.toLowerCase() },
    { chainName: chainUniV2EndpointMap[chain] }
  )

  return data
}

export async function userPoolFetcherUniV2GraphQLCached(chain: string, user: string, revalidation: number):
  Promise<UserPoolsQueryQuery> {
  // Define a function to fetch data which will be passed to unstable_cache.
  const fetchData = async (chain: string, user: string): Promise<UserPoolsQueryQuery> => {
    return userPoolFetcherUniV2GraphQL(chain, user);
  };

  // Call unstable_cache with the fetchData function and parameters.
  // The returned function from unstable_cache will be used to get the data.
  const cachedTokenData = unstable_cache(
    fetchData,
    // Cache key includes arguments passed to a function
    // [chain, entriesPerPage, page],
    ['userPoolFetcherUniV2GraphQLCached'],
    {
      revalidate: revalidation,
      // unique tag to revalidate a particular page 
      tags: [`userPoolFetcherUniV2GraphQLCached?chain=${chain}&user=${user}`]
    }
  );

  // Use the cachedTokenData to get the token data.
  const tokenData: UserPoolsQueryQuery = await cachedTokenData(chain, user);
  return tokenData;
}
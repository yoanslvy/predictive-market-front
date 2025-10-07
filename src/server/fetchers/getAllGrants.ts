import { getBuiltGraphSDK, getAllGrantsQuery } from '@/.graphclient'
import { unstable_cache } from 'next/cache'

const sdk = getBuiltGraphSDK()

export async function getAllGrantsByChainFetcher(
    chain: string,
): Promise<getAllGrantsQuery> {
    const data = await sdk.getAllGrants(
        { chainId: +chain }    )

    return JSON.parse(JSON.stringify(data))
}

// Cached version of the fetcher
export async function getAllGrantsDatasByChainFetcherCached(
    {
        chain,
    }: {
        chain: string,
    }
): Promise<getAllGrantsQuery> {
    // Define the fetch function to be cached
    const fetchData = async (chain: string): Promise<getAllGrantsQuery> => {
        return getAllGrantsByChainFetcher(chain)
    }

    // Create the cached version using unstable_cache
    const getAllGrantsData = unstable_cache(
        () => fetchData(chain),
        [`getAllGrantsDatasByChainFetcherCached?chain=${chain}`],
        {
            tags: [`getAllGrantsDatasByChainFetcherCached?chain=${chain}`],
            revalidate: 10
        }
    )

    // Get the data using the cached function
    const data: getAllGrantsQuery = await getAllGrantsData()

    return data
}


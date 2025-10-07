import { getBuiltGraphSDK, getGrantByIdQuery } from '@/.graphclient'
import { unstable_cache } from 'next/cache'

const sdk = getBuiltGraphSDK()

export async function getGrantByChainFetcher(
    id: string,
    chain: string,
): Promise<getGrantByIdQuery> {
    const data = await sdk.getGrantById(
        { id: `${id}` })

    return JSON.parse(JSON.stringify(data))
}

// Cached version of the fetcher
export async function getGrantDatasByChainFetcherCached(
    {
        id,
        chain,
    }: {
        id: string,
        chain: string,
    }
): Promise<getGrantByIdQuery> {
    // Define the fetch function to be cached
    const fetchData = async (chain: string): Promise<getGrantByIdQuery> => {
        return getGrantByChainFetcher(id, chain)
    }

    // Create the cached version using unstable_cache
    const getGrantData = unstable_cache(
        () => fetchData(chain),
        [`getGrantDatasByChainFetcherCached?chain=${chain}&id=${id}`],
        {
            tags: [`getGrantDatasByChainFetcherCached?chain=${chain}&id=${id}`],
            revalidate: 10
        }
    )

    // Get the data using the cached function
    const data: getGrantByIdQuery = await getGrantData()

    return data
}


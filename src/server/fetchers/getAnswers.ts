import { getBuiltGraphSDK, getAnswersQuery } from '@/.graphclient'
import { unstable_cache } from 'next/cache'

const sdk = getBuiltGraphSDK()

export async function getAnswersByQuestionIdFetcher(
    chainId: string,
    questionId: string,
): Promise<getAnswersQuery> {
    const data = await sdk.getAnswers(
        { questionId: `${chainId}-${questionId}` })

    return JSON.parse(JSON.stringify(data))
}

// Cached version of the fetcher
export async function getAnswersByQuestionIdFetcherCached(
    {
        chainId,
        questionId,
    }: {
        chainId: string,
        questionId: string,
    }
): Promise<getAnswersQuery> {
    // Define the fetch function to be cached
    const fetchData = async (chainId: string, questionId: string): Promise<getAnswersQuery> => {
        return getAnswersByQuestionIdFetcher(chainId, questionId)
    }

    // Create the cached version using unstable_cache
    const getAnswersData = unstable_cache(
        () => fetchData(chainId, questionId),
        [`getAnswersByQuestionIdFetcherCached?chainId=${chainId}&questionId=${questionId}`],
        {
            tags: [`getAnswersByQuestionIdFetcherCached?chainId=${chainId}&questionId=${questionId}`],
            revalidate: 10
        }
    )

    // Get the data using the cached function
    const data: getAnswersQuery = await getAnswersData()

    return data
}


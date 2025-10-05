import { TokensPagedQuery } from '@/.graphclient'
import { ErrorBoundary } from 'react-error-boundary'
import 'server-only'

import Table from '@modules/Table'
import TokenAsset from '@modules/TokenAsset'
import Value from '@modules/Value'

import { emissionTypeMapper, paginate } from '@/src/app/vesting-v2/_utils/utils'
import Pagination from '@/src/components/modules/Pagination'
import Tag from '@/src/components/modules/Tag'
import { tokensPagedCached } from '@/src/server/fetchers/vesting-v2/tokensPaged'
import { vestingsCached } from '@/src/server/fetchers/vesting-v2/vestingsPaged'

import TokenTableError from './error'

const revalidationInterval = 600
const formatter = Intl.NumberFormat('en', { notation: 'compact' })

export default async function TokenTableServer({
  chain,
  filter,
  page,
  chainFilter,
  entriesPerPage,
}: {
  page: number
  filter?: string
  chain?: number
  chainFilter?: number
  entriesPerPage: number
}) {
  const allTokens = await Promise.all(
    Object.entries(!chainFilter ? { '-1': {} } : { [chainFilter]: {} }).reduce<
      Promise<TokensPagedQuery>[]
    >((acc, [key, _]) => {
      const promises = Array.from({ length: 1 }, (_, index) =>
        tokensPagedCached(
          key == '-1' ? undefined : Number(key),
          1000,
          index + 1,
          revalidationInterval
        )
      )
      acc.push(...promises)
      return acc
    }, [])
  )

  const vestedLockDataFetch = await vestingsCached(1000, 1, 60)

  const vestedLocks = vestedLockDataFetch.vestingV2_vestings
    .filter((vesting) => BigInt(vesting.amount) > BigInt(vesting.amountReleased))
    .reduce(
      (acc, item) => {
        if (acc[item.tokenVested.id]) {
          acc[item.tokenVested.id].push(item.vestingEmissionType)
        } else {
          acc[item.tokenVested.id] = [item.vestingEmissionType]
        }
        return acc
      },
      {} as Record<string, string[]>
    )

  const mergedVestingTokens = allTokens
    .reduce(
      (accumulator, { vestingV2_tokens }) => {
        const tokens = vestingV2_tokens.map((token) => ({
          ...token,
          vestingEmissionTypes: [],
        }))
        return accumulator.concat(tokens)
      },
      [] as Array<
        TokensPagedQuery['vestingV2_tokens'][number] & {
          vestingEmissionTypes: string[]
        }
      >
    )
    .map((e) => {
      e.vestingEmissionTypes = vestedLocks[e.id] || []
      return e
    })

  const allTokensMerged = mergedVestingTokens
    .sort((tokenA, tokenB) => {
      return tokenB.tvl - tokenA.tvl
    })
    .filter((token) => +token.tvl > 10)
    .filter((token) => {
      if (filter) {
        return (
          token.symbol.toLowerCase().includes(filter.toLowerCase()) ||
          token.name.toLowerCase().includes(filter.toLowerCase()) ||
          token.id.toLowerCase().includes(filter.toLowerCase())
        )
      } else {
        return true
      }
    })

  return (
    <ErrorBoundary fallback={<TokenTableError />}>
      <Table
        isLoading={false}
        rowHref={(data) => `/vesting-v2/token/chain/${data?.chainId}/address/${data?.tokenAddress}`}
        columns={[
          {
            title: 'Token',
            render: ({ data }) => (
              <TokenAsset
                chainId={data.chainId}
                address={data.tokenAddress}
                name={data.name}
                symbol={data.symbol}
              />
            ),
          },
          {
            title: 'Vesting Emission Types',
            type: 'center',
            render: ({ data }) => (
              <div>
                {[...new Set(data.vestingEmissionTypes)].map((e, idx) => {
                  if (idx === 2)
                    return (
                      <Tag size="md" type="success" className="mr-1 text-white">
                        ...
                      </Tag>
                    )
                  if (idx > 2) return null
                  return (
                    <Tag key={e} size="md" type="success" className="mr-1 text-white">
                      {emissionTypeMapper[e as keyof typeof emissionTypeMapper]}
                    </Tag>
                  )
                })}
              </div>
            ),
          },
          {
            title: 'TVL (USD)',
            type: 'number',
            render: ({ data }) => (
              <Value value={formatter.format(Number(data.tvl))} size="md" prefix="$" />
            ),
          },
        ]}
        data={paginate(allTokensMerged, page, entriesPerPage)}
      />
      <Pagination
        total={Number(allTokensMerged.length)}
        perPage={entriesPerPage}
        page={page}
        pathname={`/vesting-v2/explore/tokens`}
        query={{ page, filter, chain }}
      />
    </ErrorBoundary>
  )
}

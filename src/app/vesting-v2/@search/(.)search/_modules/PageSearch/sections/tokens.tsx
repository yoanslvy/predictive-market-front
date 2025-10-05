import { ChainId } from '@components/modules/ChainAsset/constants'
import Table, { TableColumnProps } from '@components/modules/Table/Table'
import TokenAsset from '@components/modules/TokenAsset'
import Value from '@components/modules/Value'

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

export type TokenLockData = {
  chainName: string
  id: string
  symbol: string
  name: string
  lockedUSD: bigint
}

const columns: TableColumnProps<TokenLockData>[] = [
  {
    title: 'Token',
    render: ({ data }) => (
      <TokenAsset
        chainId={data.chainName}
        address={data.id}
        name={data.name}
        symbol={data.symbol}
      />
    ),
  },
  {
    title: 'TVL',
    type: 'number',
    render: ({ data }) => (
      <Value value={formatter.format(Number(data.lockedUSD))} size="md" prefix="$" />
    ),
  },
]

const getData = (query: string | null, chainId: ChainId | null): TokenLockData[] => []

const render = (query: string | null, chainId: ChainId | null) => {
  const data = getData(query, chainId)

  if (!data?.length) {
    return null
  }

  return <Table inner columns={columns} data={data || []} />
}

export const sectionTokens = {
  title: 'Tokens',
  value: 'tokens',
  columns,
  render,
}

export default sectionTokens

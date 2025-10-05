import { ChainId } from '@components/modules/ChainAsset/constants'
import PoolAsset from '@components/modules/PoolAsset'
import Progress from '@components/modules/Progress'
import Table, { TableColumnProps } from '@components/modules/Table/Table'
import Tag from '@components/modules/Tag'
import Value from '@components/modules/Value'
import { TokenLockData } from './tokens'

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

export type PoolLockData = {
  mainToken: TokenLockData
  baseToken: TokenLockData
  lockedPercent: number
  chainName: ChainId
  lockedCoreUSD: number
}

const columns: TableColumnProps<PoolLockData>[] = [
  {
    title: 'Pool',
    render: ({ data }) => (
      <>
        <PoolAsset
          chainId={data.chainName}
          tokens={[
            { address: data.mainToken.id, symbol: data.mainToken.symbol },
            { address: data.baseToken.id, symbol: data.baseToken.symbol },
          ]}
        />
      </>
    ),
  },
  {
    title: 'Version',
    render: () => <Tag type="info">V2</Tag>,
  },
  {
    title: 'Locked %',
    type: 'number',
    render: ({ data }) => (
      <Progress
        value={data.lockedPercent}
        max={100}
        min={0}
        low={30}
        optimum={90}
        high={80}
        block
      />
    ),
  },
  {
    render: ({ data }) => (
      <Value value={Number(data.lockedPercent).toFixed()} suffix="%" size="sm" />
    ),
  },
  {
    title: 'TVL',
    type: 'number',
    render: ({ data }) => (
      <Value value={formatter.format(Number(data.lockedCoreUSD) * 2)} prefix="$" size="md" />
    ),
  },
]

const getData = (query: string | null, chainId: ChainId | null): PoolLockData[] => []

const render = (query: string | null, chainId: ChainId | null) => {
  const data = getData(query, chainId)

  if (!data?.length) {
    return null
  }

  return <Table inner columns={columns} data={data || []} />
}

export const sectionPools = {
  title: 'Pools',
  value: 'pools',
  columns,
  render,
}

export default sectionPools

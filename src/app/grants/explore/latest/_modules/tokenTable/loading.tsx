'server-only'

import Table from '@modules/Table'
import Tag from '@modules/Tag'
import TokenAsset from '@modules/TokenAsset'
import Value from '@modules/Value'

import PoolAsset from '@/src/components/modules/PoolAsset'

import { LockExploreType } from '../../../_types/types'

export default async function PoolTableLoading({
  paramsSearch,
}: {
  paramsSearch: LockExploreType
}) {
  const { view } = paramsSearch

  if (view === 'pools') {
    return (
      <Table
        rowHref=""
        isLoading={true}
        columns={[
          {
            title: 'Pool',
            render: () => (
              <>
                <PoolAsset
                  chainId={0}
                  tokens={[
                    { address: '', symbol: '' },
                    { address: '', symbol: '' },
                  ]}

                />
                
                <Value value={'Token0 / Token1'} prefix="" size="md" />

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
            render: () => (
              <>
                <progress /> 
              </>
            ),
          },
          {
            render: ({ data }) => (
              <Value value={100} suffix="%" size="sm" />
            ),
          },
          {
            title: 'TVL',
            type: 'number',
            render: () => <Value value={100} prefix="$" size="md" />,
          },
        ]}
        data={Array.from({ length: 25 }, (_, index) => index)}
      />
    )
  }

  return (
    <Table
      rowHref=""
      isLoading={true}
      columns={[
        {
          title: 'Token',
          render: () => <TokenAsset chainId={0} address="" name="" symbol="" />,
        },
        {
          title: 'TVL',
          type: 'number',
          render: () => <Value value={100} size="md" prefix="$" />,
        },
      ]}
      data={Array.from({ length: 25 }, (_, index) => index)}
    />
  )
}

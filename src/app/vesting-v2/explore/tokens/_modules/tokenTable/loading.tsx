import 'server-only'

import Table from '@modules/Table'
import Tag from '@modules/Tag'
import TokenAsset from '@modules/TokenAsset'
import Value from '@modules/Value'

export default async function PoolTableLoading() {
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
          title: 'Vesting Emission Types',
          render: () => (
            <div>
              <Tag size="md" type="success" className="mr-1 text-white">
                ...
              </Tag>
            </div>
          ),
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

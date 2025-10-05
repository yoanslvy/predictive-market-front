'server-only'

import Table from '@modules/Table'
import Tag from '@modules/Tag'
import TokenAsset from '@modules/TokenAsset'
import Value from '@modules/Value'


export default async function PoolTableLoading() {


  return (
    <>
      <Table
        rowHref=""
        inner
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
        data={Array.from({ length: 10 }, (_, index) => index)}
      />
      <div className='mb-[36px]'>

      </div>
    </>
  )
}

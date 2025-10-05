'server-only'

import { Skeleton } from '@mantine/core'

import Table from '@modules/Table'
import TokenAsset from '@modules/TokenAsset'

export default async function FluxTxTableLoading() {
  return (
    <Table
      rowHref=""
      isLoading={true}
      columns={[
        {
          title: '#',
          type: 'number',
          render: ({ data }) => <Skeleton height={20} width={20} radius="xl" />,
        },
        {
          title: 'Type',
          render: ({ data }) => (
            <div className="flex items-center gap-x-[0.5rem]">
              <Skeleton height={20} width={20} radius="xl" />
            </div>
          ),
        },
        {
          title: 'Date',
          render: ({ data }) => <Skeleton height={20} width={100} radius="xl" />,
        },
        {
          title: 'Amount',
          render: ({ data }) => <Skeleton height={20} width={100} radius="xl" />,
        },
        {
          title: 'Pre-value',
          render: ({ data }) => <Skeleton height={20} width={100} radius="xl" />,
        },
        {
          title: 'Post-value',
          render: ({ data }) => <Skeleton height={20} width={100} radius="xl" />,
        },
        {
          title: 'Token',
          render: ({ data }) => (
            <TokenAsset
              chainId={1}
              address=""
              name=""
              symbol=""
              className="flex items-center gap-x-[0.5rem]"
            />
          ),
        },
        {
          title: 'Explorer',
          render: ({ data }) => <Skeleton height={20} width={100} radius="xl" />,
        },
      ]}
      data={Array.from({ length: 25 }, (_, index) => index)}
    />
  )
}

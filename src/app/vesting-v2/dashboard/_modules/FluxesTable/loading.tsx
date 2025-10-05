'server-only'

import { Skeleton } from '@mantine/core'

import Table from '@modules/Table'

export default async function FluxesTableLoading() {
  return (
    <Table
      isLoading={true}
      columns={[
        {
          title: '#',
          type: 'number',
          render: ({ data }) => <Skeleton height={20} width={20} radius="xl" />,
        },
        {
          title: 'From',
          render: ({ data }) => <Skeleton height={20} width={100} radius="xl" />,
        },
        {
          title: 'To',
          render: ({ data }) => <Skeleton height={20} width={100} radius="xl" />,
        },
        {
          title: 'Type',
          render: ({ data }) => <Skeleton height={20} width={80} radius="xl" />,
        },
        {
          title: 'Duration',
          render: ({ data }) => <Skeleton height={20} width={80} radius="xl" />,
        },
        {
          title: 'Status',
          render: ({ data }) => <Skeleton height={20} width={80} radius="xl" />,
        },
        {
          title: <p className="text-center">Total Payout</p>,
          type: 'number',
          render: ({ data }) => <Skeleton height={20} width={80} radius="xl" />,
        },
        {
          title: 'Token',
          render: ({ data }) => <Skeleton height={20} width={80} radius="xl" />,
        },
        {
          title: 'Claimable Amount',
          type: 'number',
          render: ({ data }) => <Skeleton height={20} width={80} radius="xl" />,
        },
      ]}
      data={Array.from({ length: 25 }, (_, index) => index)}
    />
  )
}

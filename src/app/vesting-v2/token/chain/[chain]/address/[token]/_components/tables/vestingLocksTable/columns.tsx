import { timeDifference } from '@utils/global'

import { TableColumnProps } from '@modules/Table/Table'
import Tag from '@modules/Tag'

import { emissionTypeMapper } from '@/src/app/vesting-v2/_utils/utils'

export type VestedLock = {
  id: string
  shares: string
  symbol: string
  endEmission: string
  type: string
  owner: string
  beneficiary: string
}

export const columns: TableColumnProps<VestedLock>[] = [
  {
    title: 'ID',
    render: ({ data }) => data.id.split('-')[1],
  },
  {
    title: 'Amount',
    type: 'number',
    render: ({ data }) =>
      `${Number(data.shares).toLocaleString('en', { notation: 'compact' })} ${data.symbol}`,
  },

  {
    title: 'Final Emission',
    render: ({ data }) => timeDifference(Number(data.endEmission) * 1000),
  },

  {
    title: 'Type',
    type: 'center',
    render: ({ data }) => (
      <Tag
        type="warning"
        caption={emissionTypeMapper[data.type as keyof typeof emissionTypeMapper] || 'Unknown'}
      />
    ),
  },
  {
    title: 'From',
    type: 'center',
    render: ({ data }) => data.owner,
  },
  {
    title: 'To',
    type: 'center',
    render: ({ data }) => data.beneficiary,
  },
]

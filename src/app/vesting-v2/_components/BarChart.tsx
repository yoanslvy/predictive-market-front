'use client'

import dayjs from 'dayjs'
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'

import { dateFormatter } from '../_utils/utils'

const CustomTooltip = ({
  active = false,
  payload,
  label,
  tokenName,
}: {
  active?: boolean
  payload?: { value?: ValueType }[]
  label?: string
  tokenName: string
}) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg bg-[#17181C] px-4 py-2">
        <p className="label">{label}</p>
        <p className="desc">
          {payload[0]?.value} {tokenName}
        </p>
      </div>
    )
  }

  return null
}

export function BarChart({
  data,
  tokenName,
}: {
  data: { name: Date; pv?: number }[]
  tokenName: string
}) {
  const actualBarIdx = data.findIndex((item) => {
    const d = dayjs(item.name)
    return d.isSame(dayjs(), 'day')
  })

  const mappedData = data.map((item, idx) => {
    return {
      name: dateFormatter(item.name),
      pv: item.pv,
    }
  })

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart width={740} height={250} data={mappedData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          content={(e) => (
            <CustomTooltip
              active={e.active}
              payload={e.payload}
              label={e.label as string}
              tokenName={tokenName}
            />
          )}
        />
        <CartesianGrid stroke="#33353F80" strokeDasharray={'4'} />
        <Bar type="monotone" dataKey="pv" fill="#2FFA8114" radius={[5, 5, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              cursor="pointer"
              fill={index === actualBarIdx ? '#2FFA81' : '#2FFA8114'}
              key={`cell-${index}`}
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  )
}

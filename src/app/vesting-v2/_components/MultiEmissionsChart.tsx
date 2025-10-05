'use client'

import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import type { Payload } from 'recharts/types/component/DefaultTooltipContent'

import { useMemo, useState } from 'react'

import { cn } from '@/src/src/utils'

import styles from '../../../components/modules/Chart/Chart.module.scss'
import { dateFormatter, emissionTypeMapper, formatAmount } from '../_utils/utils'
import {
  generateEmissionData,
  ChartTimeRange,
  ChartTimeRangeSelector,
  EmissionType,
} from './EmissionsChart'

export interface VestingSeriesConfig {
  color?: string
  emissionType: EmissionType
  data: {
    time: string
    amountBD: number
  }[]
  fullData: Array<
    { name: string; timestamp: number; pv: number; key: string } & { [key: string]: number }
  >
  key: string
}

const DEFAULT_COLORS = [
  '#2FFA81',
  '#FF6B6B',
  '#FFB347',
  '#45B',
  '#4C4',
  '#FFEAA7',
  '#DDA0DD',
  '#87CEEB',
]

const MultiSeriesCustomTooltip = ({
  active,
  payload,
  label,
  tokenSymbol,
  series,
}: {
  active?: boolean
  payload?: Payload<ValueType, NameType>[]
  label?: string
  tokenSymbol: string
  series: { key: string; color?: string }[]
}) => {
  if (active && payload?.length) {
    const seriesData: {
      [seriesId: string]: { name: string; value: number; color: string }
    } = {}

    payload.forEach((item) => {
      if (item.dataKey && typeof item.value === 'number') {
        const seriesInfo = series.find((s) => s.key + '_pv' === item.dataKey)

        if (seriesInfo) {
          seriesData[seriesInfo.key] = {
            name: item.dataKey
              ? emissionTypeMapper[
                  String(item.dataKey).split('@')[2].replaceAll('_pv', '') as EmissionType
                ]
              : '',
            value: item.value,
            color: seriesInfo.color ?? DEFAULT_COLORS[0],
          }
        }
      }
    })

    return (
      <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
        <p className="mb-2 text-sm font-medium text-white">{label}</p>
        {Object.entries(seriesData).map(([seriesId, data]) => (
          <div key={seriesId} className="flex items-center mb-1">
            <div className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: data.color }} />
            <p className="text-sm text-white">
              <span className="text-gray-300">{data.name}:</span>{' '}
              <span className="font-medium text-green-400">{formatAmount(data.value)}</span>
              <span className="ml-1 text-gray-400">{tokenSymbol}</span>
            </p>
          </div>
        ))}
      </div>
    )
  }

  return null
}

function mergeMultipleSeriesData(series: VestingSeriesConfig[], timeRange: ChartTimeRange) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = today.getTime()
  const endTimestamp = todayTimestamp + timeRange.months * 30.44 * 24 * 60 * 60 * 1000

  return series.map((serie, i) => {
    const seriesData = generateEmissionData(
      serie.data.map((e) => ({
        name: new Date(Number(e.time) * 1000),
        pv: e.amountBD,
      })),
      serie.emissionType,
      todayTimestamp,
      endTimestamp,
      timeRange
    ).map((e) => {
      const dynamicKey = `${serie.key}_pv`
      return {
        ...e,
        key: serie.key,
        [dynamicKey]: e.pv,
      }
    })

    serie.fullData = seriesData as VestingSeriesConfig['fullData']
    serie.color = DEFAULT_COLORS[i % DEFAULT_COLORS.length]
    return serie
  })
}

const formatXAxisTick = (timestamp: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return dateFormatter(date, true, false)
}

function mergeSeriesData(series: VestingSeriesConfig[]) {
  type MergedPoint = { timestamp: number } & { [key: string]: number }
  const merged: { [timestamp: number]: MergedPoint } = {}

  for (const s of series) {
    for (const point of s.fullData) {
      const ts = point.timestamp
      if (!merged[ts]) {
        merged[ts] = { timestamp: ts }
      }
      merged[ts][`${s.key}_pv`] = point[`${s.key}_pv`]
    }
  }

  return Object.values(merged).sort((a, b) => a.timestamp - b.timestamp)
}

export function MultiEmissionsChart({
  series,
  tokenSymbol,
  omitResponsiveContainer = false,
}: {
  series: VestingSeriesConfig[]
  tokenSymbol: string
  omitResponsiveContainer?: boolean
}) {
  const [timeRange, setTimeRange] = useState({ months: 12, points: 365 })

  const memoizedSeries = useMemo(
    () => mergeMultipleSeriesData(series, timeRange),
    [series, timeRange]
  )
  const memoizedMergedData = useMemo(() => mergeSeriesData(memoizedSeries), [memoizedSeries])

  const ChartComp = (
    <ComposedChart width={730} height={260} data={memoizedMergedData}>
      <XAxis
        dataKey="timestamp"
        type="number"
        scale="linear"
        domain={['dataMin', 'dataMax']}
        tickFormatter={formatXAxisTick}
      />
      <YAxis />

      <CartesianGrid stroke="#33353F80" strokeDasharray={'4'} />

      {series.map((a) => {
        const lineType = ['MONTHLY_UNLOCKS', 'UNLOCK_IN_STEPS', 'SCHEDULED', 'TIME_LOCK'].includes(
          a.emissionType
        )
          ? 'stepAfter'
          : 'monotone'

        return (
          <Line
            key={`${a.key}_pv`}
            type={lineType}
            dataKey={`${a.key}_pv`}
            stroke={a.color as string}
            strokeWidth={'2px'}
            dot={false}
            activeDot={{
              r: 6,
              fill: a.color as string,
              stroke: a.color as string,
              style: { boxShadow: `0px 0px 0px 4px ${a.color as string}` },
            }}
            connectNulls={true}
          />
        )
      })}

      <Tooltip
        content={(e) => {
          return (
            <MultiSeriesCustomTooltip
              active={e.active}
              payload={e.payload}
              label={e.label ? formatXAxisTick(e.label as number) : ''}
              tokenSymbol={tokenSymbol}
              series={series}
            />
          )
        }}
      />
    </ComposedChart>
  )

  if (omitResponsiveContainer) {
    return (
      <>
        <ChartTimeRangeSelector currentRange={timeRange} onRangeChange={setTimeRange} />
        <div className={cn(styles.container)}>
          <div className={styles.body} style={{ height: 260, flexBasis: 260 }}>
            <ResponsiveContainer className={styles.chart}>{ChartComp}</ResponsiveContainer>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ChartTimeRangeSelector currentRange={timeRange} onRangeChange={setTimeRange} />
      <ResponsiveContainer width="100%" height="100%">
        {ChartComp}
      </ResponsiveContainer>
    </>
  )
}

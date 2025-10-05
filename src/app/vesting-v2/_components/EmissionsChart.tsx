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
import { CurveType } from 'recharts/types/shape/Curve'

import { useMemo, useState } from 'react'

import { dateFormatter, formatAmount } from '../_utils/utils'

export interface DataPoint {
  name: string
  timestamp: number
  pv: number
}

export type EmissionType =
  | 'UNLOCK_CLIFF'
  | 'CLIFF'
  | 'EXPONENTIAL'
  | 'CLIFF_EXPONENTIAL'
  | 'MONTHLY_UNLOCKS'
  | 'UNLOCK_IN_STEPS'
  | 'TIME_LOCK'
  | 'SCHEDULED'
  | 'LINEAR'

export interface ChartTimeRange {
  months: number
  points: number
}

export const TIME_RANGES: ChartTimeRange[] = [
  { months: 12, points: 365 },
  { months: 24, points: 730 },
  { months: 36, points: 1095 },
]

export const DEFAULT_TIME_RANGE = TIME_RANGES[0]
function findValueAtTimestamp(
  data: { name: Date; pv?: number }[],
  targetTimestamp: number
): number | undefined {
  const dataWithTimestamps = data
    .map((item) => ({
      ...item,
      timestamp: item.name.getTime(),
    }))
    .sort((a, b) => a.timestamp - b.timestamp)

  const exactMatch = dataWithTimestamps.find(
    (item) => Math.abs(item.timestamp - targetTimestamp) < 24 * 60 * 60 * 1000
  )

  if (exactMatch && exactMatch.pv !== undefined) {
    return exactMatch.pv
  }

  let beforePoint = null
  let afterPoint = null

  for (let i = 0; i < dataWithTimestamps.length; i++) {
    const point = dataWithTimestamps[i]
    if (point.timestamp <= targetTimestamp && point.pv !== undefined) {
      beforePoint = point
    }
    if (point.timestamp >= targetTimestamp && point.pv !== undefined && !afterPoint) {
      afterPoint = point
      break
    }
  }

  if (beforePoint && afterPoint && beforePoint.timestamp !== afterPoint.timestamp) {
    const ratio =
      (targetTimestamp - beforePoint.timestamp) / (afterPoint.timestamp - beforePoint.timestamp)
    return beforePoint.pv! + (afterPoint.pv! - beforePoint.pv!) * ratio
  }

  if (beforePoint) return beforePoint.pv
  if (afterPoint) return afterPoint.pv

  return undefined
}

function generateLinearData(
  originalData: { name: Date; pv?: number }[],
  lowDate: number,
  highDate: number,
  numPoints: number
): DataPoint[] {
  const dateRange = highDate - lowDate
  const pointSpacing = dateRange / numPoints
  const dataPoints: DataPoint[] = []

  const dataWithTimestamps = originalData
    .map((item) => ({
      ...item,
      timestamp: item.name.getTime(),
    }))
    .filter((item) => item.pv !== undefined)
    .sort((a, b) => a.timestamp - b.timestamp)

  const startValue = findValueAtTimestamp(originalData, lowDate) ?? 0

  const vestingStartTimestamp =
    dataWithTimestamps.length > 0 ? dataWithTimestamps[0].timestamp : lowDate
  const vestingEndTimestamp =
    dataWithTimestamps.length > 0
      ? dataWithTimestamps[dataWithTimestamps.length - 1].timestamp
      : lowDate
  const finalValue =
    dataWithTimestamps.length > 0
      ? dataWithTimestamps[dataWithTimestamps.length - 1].pv!
      : startValue

  for (let i = 0; i <= numPoints; i++) {
    const timestamp = lowDate + i * pointSpacing
    let value: number

    if (timestamp <= vestingStartTimestamp) {
      value = startValue
    } else if (timestamp <= vestingEndTimestamp) {
      const progress =
        (timestamp - vestingStartTimestamp) / (vestingEndTimestamp - vestingStartTimestamp)
      value = startValue + (finalValue - startValue) * progress
    } else {
      value = finalValue
    }

    dataPoints.push({
      name: dateFormatter(new Date(timestamp)),
      timestamp,
      pv: value,
    })
  }

  return dataPoints
}

function generateExponentialData(
  originalData: { name: Date; pv?: number }[],
  lowDate: number,
  highDate: number,
  numPoints: number,
  curveFactor: number = 3
): DataPoint[] {
  const dateRange = highDate - lowDate
  const pointSpacing = dateRange / numPoints
  const dataPoints: DataPoint[] = []

  const dataWithTimestamps = originalData
    .map((item) => ({
      ...item,
      timestamp: item.name.getTime(),
    }))
    .filter((item) => item.pv !== undefined)
    .sort((a, b) => a.timestamp - b.timestamp)

  const startValue = findValueAtTimestamp(originalData, lowDate) ?? 0

  const vestingStartTimestamp =
    dataWithTimestamps.length > 0 ? dataWithTimestamps[0].timestamp : lowDate
  const vestingEndTimestamp =
    dataWithTimestamps.length > 0
      ? dataWithTimestamps[dataWithTimestamps.length - 1].timestamp
      : lowDate
  const finalValue =
    dataWithTimestamps.length > 0
      ? dataWithTimestamps[dataWithTimestamps.length - 1].pv!
      : startValue

  for (let i = 0; i <= numPoints; i++) {
    const timestamp = lowDate + i * pointSpacing
    let value: number

    if (timestamp <= vestingStartTimestamp) {
      value = startValue
    } else if (timestamp <= vestingEndTimestamp) {
      const t = (timestamp - vestingStartTimestamp) / (vestingEndTimestamp - vestingStartTimestamp)
      const curvedT = 1 - Math.pow(1 - t, 1 / curveFactor)
      value = startValue + (finalValue - startValue) * curvedT
    } else {
      value = finalValue
    }

    dataPoints.push({
      name: dateFormatter(new Date(timestamp)),
      timestamp,
      pv: value,
    })
  }

  return dataPoints
}

function generateStepData(
  originalData: { name: Date; pv?: number }[],
  lowDate: number,
  highDate: number,
  numPoints: number
): DataPoint[] {
  const dateRange = highDate - lowDate
  const pointSpacing = dateRange / numPoints
  const dataPoints: DataPoint[] = []

  const dataWithTimestamps = originalData
    .map((item) => ({
      ...item,
      timestamp: item.name.getTime(),
    }))
    .filter((item) => item.pv !== undefined)
    .sort((a, b) => a.timestamp - b.timestamp)

  for (let i = 0; i <= numPoints; i++) {
    const timestamp = lowDate + i * pointSpacing

    let currentValue = 0
    for (const step of dataWithTimestamps) {
      if (step.timestamp <= timestamp) {
        currentValue = step.pv!
      } else {
        break
      }
    }

    dataPoints.push({
      name: dateFormatter(new Date(timestamp)),
      timestamp,
      pv: currentValue,
    })
  }

  dataWithTimestamps.forEach((step, stepIndex) => {
    if (step.timestamp >= lowDate && step.timestamp <= highDate) {
      const prevValue = stepIndex > 0 ? dataWithTimestamps[stepIndex - 1].pv! : 0

      dataPoints.push({
        name: dateFormatter(new Date(step.timestamp - 1)),
        timestamp: step.timestamp - 1,
        pv: prevValue,
      })

      dataPoints.push({
        name: dateFormatter(new Date(step.timestamp)),
        timestamp: step.timestamp,
        pv: step.pv!,
      })
    }
  })

  return dataPoints
    .sort((a, b) => a.timestamp - b.timestamp)
    .filter((point, index, array) => {
      if (index === 0) return true
      return point.timestamp - array[index - 1].timestamp > 60 * 60 * 1000
    })
}

function generateCliffData(
  originalData: { name: Date; pv?: number }[],
  lowDate: number,
  highDate: number,
  numPoints: number
): DataPoint[] {
  const dateRange = highDate - lowDate
  const pointSpacing = dateRange / numPoints
  const dataPoints: DataPoint[] = []

  const dataWithTimestamps = originalData
    .map((item) => ({
      ...item,
      timestamp: item.name.getTime(),
    }))
    .filter((item) => item.pv !== undefined)
    .sort((a, b) => a.timestamp - b.timestamp)

  if (dataWithTimestamps.length >= 2) {
    const [cliffPoint, endPoint] = dataWithTimestamps

    for (let i = 0; i <= numPoints; i++) {
      const timestamp = lowDate + i * pointSpacing
      let value = 0

      if (timestamp < cliffPoint.timestamp) {
        // Before cliff: no vesting
        value = 0
      } else if (timestamp >= cliffPoint.timestamp && timestamp <= endPoint.timestamp) {
        // After cliff: linear vesting from cliff point to end
        const linearProgress =
          (timestamp - cliffPoint.timestamp) / (endPoint.timestamp - cliffPoint.timestamp)
        value = cliffPoint.pv! + (endPoint.pv! - cliffPoint.pv!) * linearProgress
      } else {
        // After end: fully vested
        value = endPoint.pv!
      }

      dataPoints.push({
        name: dateFormatter(new Date(timestamp)),
        timestamp,
        pv: value,
      })
    }

    // Add explicit points for the cliff to ensure vertical line
    dataPoints.push({
      name: dateFormatter(new Date(cliffPoint.timestamp - 1)),
      timestamp: cliffPoint.timestamp - 1,
      pv: 0,
    })
    
    dataPoints.push({
      name: dateFormatter(new Date(cliffPoint.timestamp)),
      timestamp: cliffPoint.timestamp,
      pv: cliffPoint.pv!,
    })
  } else {
    return generateLinearData(originalData, lowDate, highDate, numPoints)
  }

  return dataPoints.sort((a, b) => a.timestamp - b.timestamp)
}

function generateCliffExponentialData(
  originalData: { name: Date; pv?: number }[],
  lowDate: number,
  highDate: number,
  numPoints: number,
  curveFactor: number = 3
): DataPoint[] {
  const dateRange = highDate - lowDate
  const pointSpacing = dateRange / numPoints
  const dataPoints: DataPoint[] = []

  const dataWithTimestamps = originalData
    .map((item) => ({
      ...item,
      timestamp: item.name.getTime(),
    }))
    .filter((item) => item.pv !== undefined)
    .sort((a, b) => a.timestamp - b.timestamp)

  if (dataWithTimestamps.length >= 3) {
    const [cliffPoint, expStart, expEnd] = dataWithTimestamps

    for (let i = 0; i <= numPoints; i++) {
      const timestamp = lowDate + i * pointSpacing
      let value = 0

      if (timestamp < cliffPoint.timestamp) {
        value = 0
      } else if (timestamp >= cliffPoint.timestamp && timestamp < expStart.timestamp) {
        value = cliffPoint.pv!
      } else if (timestamp >= expStart.timestamp && timestamp <= expEnd.timestamp) {
        const expProgress =
          (timestamp - expStart.timestamp) / (expEnd.timestamp - expStart.timestamp)
        const curvedProgress = Math.pow(expProgress, curveFactor)
        value = expStart.pv! + (expEnd.pv! - expStart.pv!) * curvedProgress
      } else {
        value = expEnd.pv!
      }

      dataPoints.push({
        name: dateFormatter(new Date(timestamp)),
        timestamp,
        pv: value,
      })
    }
  } else {
    return generateExponentialData(originalData, lowDate, highDate, numPoints, curveFactor)
  }

  return dataPoints
}

// Main data generation function that routes to specific emission type handlers
export function generateEmissionData(
  originalData: { name: Date; pv?: number }[],
  emissionType: EmissionType,
  lowDate: number,
  highDate: number,
  timeRange: ChartTimeRange = DEFAULT_TIME_RANGE
): DataPoint[] {
  switch (emissionType) {
    case 'LINEAR':
      return generateLinearData(originalData, lowDate, highDate, timeRange.points)

    case 'EXPONENTIAL':
      return generateExponentialData(originalData, lowDate, highDate, timeRange.points)

    case 'MONTHLY_UNLOCKS':
    case 'UNLOCK_IN_STEPS':
    case 'SCHEDULED':
    case 'TIME_LOCK':
      return generateStepData(originalData, lowDate, highDate, timeRange.points)

    case 'UNLOCK_CLIFF':
    case 'CLIFF':
      return generateCliffData(originalData, lowDate, highDate, timeRange.points)

    case 'CLIFF_EXPONENTIAL':
      return generateCliffExponentialData(originalData, lowDate, highDate, timeRange.points)

    default:
      return generateLinearData(originalData, lowDate, highDate, timeRange.points)
  }
}

const CustomTooltip = ({
  active,
  payload,
  label,
  tokenName,
}: {
  active?: boolean
  payload?: any[]
  label?: string
  tokenName: string
}) => {
  if (active && payload && payload.length) {
    const value = payload[0].value as number
    return (
      <div className="p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
        <p className="mb-1 text-sm font-medium text-white">{label}</p>
        <p className="text-sm text-green-400">
          <span className="font-medium">{formatAmount(value)}</span>
          <span className="ml-1 text-gray-400">{tokenName}</span>
        </p>
      </div>
    )
  }

  return null
}

export function ChartTimeRangeSelector({
  currentRange,
  onRangeChange,
}: {
  currentRange: ChartTimeRange
  onRangeChange: (range: ChartTimeRange) => void
}) {
  const timeRanges = [
    { months: 1, points: 30, label: '1M' },
    { months: 6, points: 183, label: '6M' },
    { months: 12, points: 365, label: '1Y' },
    { months: 24, points: 730, label: '2Y' },
  ]

  return (
    <div className="flex gap-2 mb-4 ml-[3em]">
      {timeRanges.map((range) => (
        <button
          key={range.months}
          onClick={() => onRangeChange(range)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            currentRange.months === range.months
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}>
          {range.label}
        </button>
      ))}
    </div>
  )
}

export function EmissionsChart({
  data,
  tokenName,
  emissionType,
  omitResponsiveContainer = false,
  timeRange: initialTimeRange = DEFAULT_TIME_RANGE,
  showTimeRangeSelector = true,
}: {
  data: { name: Date; pv?: number }[]
  tokenName: string
  emissionType: EmissionType
  omitResponsiveContainer?: boolean
  timeRange?: ChartTimeRange
  showTimeRangeSelector?: boolean
}) {
  const [timeRange, setTimeRange] = useState(initialTimeRange)

  const processedData = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()

    const endTimestamp = todayTimestamp + timeRange.months * 30.44 * 24 * 60 * 60 * 1000

    return generateEmissionData(data, emissionType, todayTimestamp, endTimestamp, timeRange)
  }, [data, emissionType, timeRange])

  const lineType: CurveType =
    emissionType === 'MONTHLY_UNLOCKS' ||
    emissionType === 'UNLOCK_IN_STEPS' ||
    emissionType === 'SCHEDULED' ||
    emissionType === 'TIME_LOCK'
      ? 'stepAfter'
      : 'monotone'

  const formatXAxisTick = (timestamp: number) => {
    const date = new Date(timestamp)
    return dateFormatter(date, true, false)
  }

  const ChartComp = (
    <ComposedChart width={730} height={260} data={processedData}>
      <XAxis
        dataKey="timestamp"
        type="number"
        scale="linear"
        domain={['dataMin', 'dataMax']}
        tickFormatter={formatXAxisTick}
      />
      <YAxis />
      <Tooltip
        content={(e) => (
          <CustomTooltip
            active={e.active}
            payload={e.payload}
            label={e.label ? formatXAxisTick(e.label as number) : ''}
            tokenName={tokenName}
          />
        )}
      />
      <CartesianGrid stroke="#33353F80" strokeDasharray={'4'} />
      <Line
        type={lineType}
        dataKey="pv"
        stroke="#2FFA81"
        strokeWidth={'2px'}
        dot={false}
        activeDot={{
          r: 6,
          fill: '#2FFA81',
          stroke: '#2FFA81',
          style: {
            boxShadow: '0px 0px 0px 4px #2FFA81',
          },
        }}
      />
    </ComposedChart>
  )

  if (omitResponsiveContainer) {
    return (
      <>
        {showTimeRangeSelector && (
          <ChartTimeRangeSelector currentRange={timeRange} onRangeChange={setTimeRange} />
        )}
        {ChartComp}
      </>
    )
  }
  return (
    <>
      {showTimeRangeSelector && (
        <ChartTimeRangeSelector currentRange={timeRange} onRangeChange={setTimeRange} />
      )}
      <div className="h-[220px] pt-[10px]">
        <ResponsiveContainer width="100%" height="100%" className={'ml-[-10px]'}>
          {ChartComp}
        </ResponsiveContainer>
      </div>
    </>
  )
}

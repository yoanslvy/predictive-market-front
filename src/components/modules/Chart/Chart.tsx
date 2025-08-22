'use client'

import clsx from 'clsx'
import { get } from 'lodash-es'
import { FC, Fragment, ReactNode } from 'react'
import {
  Area,
  Bar,
  Brush,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from 'recharts'
import { CurveType } from 'recharts/types/shape/Curve'
import uniqolor from 'uniqolor'

import Heading from '../Heading'
import Message from '../Message'
import Tools from '../Tools'
import Value from '../Value'
import styles from './Chart.module.scss'
import ChartTooltip from './ChartTooltip'

type ChartType = 'area' | 'line' | 'bar' | 'scatter'
type ChartYAxis = 'left' | 'right'

export type ChartSeries = {
  type?: ChartType
  key: string
  name?: string
  curveType?: CurveType
  color?: string
  fill?: string
  stroke?: string
  formatter?: (value: any) => string
  yAxis?: ChartYAxis
  icon?: ReactNode
  prefix?: string
  suffix?: string
  stackId?: string
  isInZoom?: boolean
}

type ChartData = Record<string, unknown>

type ChartOptions = {
  tooltip?: {
    titleFormatter?: (value: any) => string
  }
  axis?: {
    y?: YAxisProps
    x?: XAxisProps
  }
  layout?: 'vertical' | 'horizontal' | 'centric' | 'radial'
  zoom?: boolean
  isAnimated?: boolean
}

type ChartProps = {
  className?: string
  title?: ReactNode
  subtitle?: ReactNode
  data?: ChartData[]
  series?: ChartSeries | ChartSeries[]
  options?: ChartOptions
  isLoading?: boolean
  isZoom?: boolean
  height?: number | string
  tools?: ReactNode
  footer?: ReactNode
}

const getYAxisSeriesWidth = (data: ChartData[], series: ChartSeries[], options?: ChartOptions) => {
  return series.reduce((acc, curr) => {
    return Math.max(
      acc,
      ...data.map((item) => {
        const value = get(item, curr.key)
        const valueNumber = Math.round(!isNaN(+`${value}`) ? +`${value}` : 0)
        const res = `${options?.axis?.y?.tickFormatter?.(valueNumber, 0) ?? valueNumber}`
        return res.length
      })
    )
  }, 0)
}

const getYAxisData = (
  data: ChartData[],
  series: ChartSeries[],
  options?: ChartOptions
): Record<ChartYAxis, { hasAxis: boolean; width: number }> => {
  const yLeftSeries = series.filter((set) => set.yAxis === 'left')
  const yRightSeries = series.filter((set) => set.yAxis === 'right')

  const result = {
    left: {
      series: yLeftSeries,
      hasAxis: yLeftSeries.length > 0,
      width: options?.axis?.y?.width ?? getYAxisSeriesWidth(data, yLeftSeries, options),
    },
    right: {
      series: yRightSeries,
      hasAxis: yRightSeries.length > 0,
      width: options?.axis?.y?.width ?? getYAxisSeriesWidth(data, yRightSeries, options),
    },
  }

  return result
}

export const Chart: FC<ChartProps> = ({
  title,
  subtitle,
  data,
  series,
  options,
  className,
  isLoading,
  height,
  isZoom = true,
  tools,
  footer,
}) => {
  const seriesArr = series ? (Array.isArray(series) ? series : [series]) : []

  const yAxisData = data ? getYAxisData(data, seriesArr, options) : null

  const isEmptyBrush = !isZoom || !seriesArr.find((set) => set.isInZoom)

  const yAxisCommonProps = {
    fontFamily: 'inherit',
    fontSize: 10,
    tickLine: false,
    axisLine: false,
    ...options?.axis?.y,
  }

  return (
    <div className={clsx(styles.container, className)}>
      {(title || subtitle || tools) && (
        <div className={styles.header}>
          <Heading size="sm" className={styles.heading}>
            <span className={styles.title}>{title}</span>{' '}
            {!!subtitle && <span className={styles.subtitle}>({subtitle})</span>}
          </Heading>

          {!!tools && <Tools className={styles.tools}>{tools}</Tools>}
        </div>
      )}

      <div className={styles.body} style={{ height, flexBasis: height }}>
        {isLoading && <Message type="info" title="Loading data..." />}

        {!!series && !!data && (
          <ResponsiveContainer className={styles.chart}>
            <ComposedChart
              data={data}
              margin={{ left: 0, right: 15, top: 0, bottom: 0 }}
              layout={options?.layout || 'horizontal'}>
              <XAxis
                type="category"
                fontFamily="inherit"
                fontSize={10}
                height={24}
                tickLine={false}
                axisLine={false}
                {...options?.axis?.x}
              />

              {yAxisData?.left.hasAxis && (
                <YAxis
                  width={10 * yAxisData?.left.width || 0}
                  {...yAxisCommonProps}
                  orientation="left"
                />
              )}

              {yAxisData?.right.hasAxis && (
                <YAxis
                  width={10 * yAxisData?.right.width || 0}
                  {...yAxisCommonProps}
                  orientation="right"
                />
              )}

              {seriesRendered(seriesArr, false)}

              <Tooltip
                content={
                  <CommonChartTooltip
                    xFormatter={options?.tooltip?.titleFormatter || options?.axis?.x?.tickFormatter}
                    yFormatter={options?.axis?.y?.tickFormatter}
                    series={seriesArr}
                  />
                }
              />

              {isZoom && (
                <Brush
                  travellerWidth={8}
                  traveller={<CommonChartTraveller />}
                  fontFamily="inherit"
                  fontSize={10}
                  height={isEmptyBrush ? 24 : 48}
                  dataKey={options?.axis?.x?.dataKey}
                  type={options?.axis?.x?.type}
                  className={styles.zoom}
                  tickFormatter={options?.axis?.x?.tickFormatter}>
                  <ComposedChart data={data} layout={options?.layout || 'horizontal'}>
                    {!isEmptyBrush && seriesRendered(seriesArr, true)}
                  </ComposedChart>
                </Brush>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {!!footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}

const CommonChartTraveller: FC<{
  x?: number
  y?: number
  width?: number
  height?: number
}> = ({ x = 0, y = 0, width = 8, height = 16 }) => {
  const rx = width / 2
  return (
    <>
      <g stroke="rgba(var(--color-primary)/1)" fill="rgba(var(--color-primary)/1)">
        <circle cx={x + rx} cy={y + rx} r={rx} />
        <circle cx={x + rx} cy={y + height - rx} r={rx} />

        <rect x={x} width={width} y={y + rx} height={height - width} />

        <rect x={x} width={rx} y={y} height={height} className="start" />
        <rect x={x + rx} width={rx} y={y} height={height} className="end" />
      </g>

      <rect
        width="2"
        x={x + rx - 1}
        y={y + height / 4}
        height={height / 2}
        fill="var(--color-bg-100)"
        rx="1"
      />
    </>
  )
}

const CommonChartTooltip: FC<{
  active?: boolean
  label?: unknown
  payload?: {
    value?: unknown
    stroke?: string
    name?: string
  }[]
  xFormatter?: (value: unknown, index: number) => string
  yFormatter?: (value: unknown, index: number) => string
  series: ChartSeries[]
}> = ({ active, payload, label, xFormatter, yFormatter, series }) => {
  if (active && payload?.length) {
    const tooltipTitle = xFormatter?.(label, 0) || label

    return (
      <ChartTooltip
        title={`${tooltipTitle}`}
        entries={payload.map((item, idx) => {
          const resultValue =
            series[idx]?.formatter?.(item.value) || yFormatter?.(item.value, idx) || item.value

          return {
            title: item.name,
            value: (
              <Value
                className={styles.value}
                value={`${resultValue}`}
                size="xs"
                prefix={series[idx]?.prefix}
                suffix={series[idx]?.suffix}
              />
            ),
            color: item.stroke,
            icon: series[idx]?.icon,
          }
        })}
      />
    )
  }

  return null
}

const seriesRendered = (series: ChartSeries[], isInBrush?: boolean) => {
  return (
    <>
      {series.map((set, idx) => {
        if (isInBrush && !set.isInZoom) {
          return null
        }

        const type = set.type || 'area'
        const key = `${type}-${set.key}`

        const color = set.color ?? uniqolor(key).color

        const commonProps = {
          dataKey: set.key,
          fill: set.fill ?? color,
          stroke: set.stroke ?? color,
          strokeWidth: 2,
          name: set.name,
          stackId: set?.stackId,
        }

        switch (type) {
          case 'line': {
            return (
              <Line key={key} type={set.curveType || 'monotone'} dot={false} {...commonProps} />
            )
          }

          case 'area': {
            const fill = set.fill ?? set.color

            return (
              <Fragment key={key}>
                {!!fill && (
                  <defs>
                    <linearGradient id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={fill} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={fill} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                )}
                <Area
                  type={set.curveType || 'monotone'}
                  {...commonProps}
                  fill={fill ? `url(#fill-${key})` : 'transparent'}
                />
              </Fragment>
            )
          }

          case 'scatter': {
            return <Scatter key={key} {...commonProps} />
          }

          case 'bar': {
            const fill = set.fill ?? set.color

            return <Bar key={key} {...commonProps} strokeWidth={0} />
          }

          default:
            return null
        }
      })}
    </>
  )
}

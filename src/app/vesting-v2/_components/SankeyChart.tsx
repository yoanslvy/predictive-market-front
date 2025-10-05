'use client'

import { ResponsiveContainer, Sankey, Tooltip } from 'recharts'

import { cn } from '@/src/src/utils'

import { formatAmount } from '../_utils/utils'

const CustomNode = (props: any) => {
  const { x, y, width, height, payload } = props
  const { name } = payload

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#2FFA81"
        fillOpacity={0.8}
        stroke="#1DB954"
        strokeWidth={2}
        rx={6}
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill="white"
        fontWeight="600"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
        {name}
      </text>
    </g>
  )
}

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props

  if (active && payload && payload.length > 0) {
    const data = payload[0]

    if (data.payload && typeof data.payload.value === 'number') {
      return (
        <div className="p-4 border border-gray-600 shadow-2xl bg-gray-900/95 backdrop-blur-sm rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <p className="text-sm font-semibold text-white">Flow</p>
          </div>
          <p className="text-sm font-medium text-blue-400">
            Amount: {data.payload.value.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-gray-300">Vesting flow between wallets</p>
        </div>
      )
    }

    if (data.name || (data.payload && data.payload.name)) {
      const nodeValue = data.value || data.payload?.value
      const sourceAddress = data.payload?.payload?.source?.name || data.payload?.source?.name
      const targetAddress = data.payload?.payload?.target?.name || data.payload?.target?.name

      return (
        <div className="p-4 border border-gray-600 shadow-2xl bg-gray-900/95 backdrop-blur-sm rounded-xl min-w-[280px]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <p className="text-sm font-semibold text-white">Vesting Flow</p>
          </div>

          {sourceAddress && (
            <div className="p-2 mb-3 rounded-lg bg-gray-800/60">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p className="text-xs font-medium text-gray-300">From</p>
              </div>
              <p className="font-mono text-sm text-blue-400 break-all">{sourceAddress}</p>
            </div>
          )}

          {targetAddress && (
            <div className="p-2 mb-3 rounded-lg bg-gray-800/60">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <p className="text-xs font-medium text-gray-300">To</p>
              </div>
              <p className="font-mono text-sm text-purple-400 break-all">{targetAddress}</p>
            </div>
          )}

          {nodeValue && (
            <div className="pt-2 border-t border-gray-700">
              <p className="mb-1 text-xs text-gray-400">Amount</p>
              <p className="text-lg font-bold text-white">{formatAmount(nodeValue)}</p>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="p-4 border border-gray-600 shadow-2xl bg-gray-900/95 backdrop-blur-sm rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <p className="text-sm font-semibold text-white">Data</p>
        </div>
        <p className="text-sm text-gray-300">{JSON.stringify(data, null, 2)}</p>
      </div>
    )
  }
  return null
}

export interface SankeyDataType {
  source: string
  target: string
  value: number
  fullSource: string
  fullTarget: string
  tokenSymbol: string
}

interface SankeyChartProps {
  data: SankeyDataType[]
  className?: string
}

export function SankeyChart({ data, className }: SankeyChartProps) {
  const nodes: Array<{ name: string }> = []
  const links: Array<{ source: number; target: number; value: number }> = []

  const nodeNames = new Set<string>()
  data.forEach((item) => {
    nodeNames.add(item.source)
    nodeNames.add(item.target)
  })

  const nodeArray = Array.from(nodeNames)
  nodeArray.forEach((name) => {
    nodes.push({ name })
  })

  const selfReferencingEntries: { name: string; value: number }[] = []
  const normalLinks: Array<{ source: number; target: number; value: number }> = []

  const maxValue = Math.max(...data.map((item) => item.value))

  data.forEach((item) => {
    const sourceIndex = nodeArray.indexOf(item.source)
    const targetIndex = nodeArray.indexOf(item.target)

    if (sourceIndex === targetIndex) {
      selfReferencingEntries.push({
        name: item.source,
        value: item.value,
      })
    } else {
      const thickness = Math.max(5, (item.value / maxValue) * 20)
      normalLinks.push({
        source: sourceIndex,
        target: targetIndex,
        value: item.value,
      })
    }
  })

  const sankeyData = {
    nodes,
    links: normalLinks,
  }

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${className || ''}`}>
        <p className="text-gray-500">No outgoing vesting data available</p>
      </div>
    )
  }

  if (nodes.length === 0 || (normalLinks.length === 0 && selfReferencingEntries.length === 0)) {
    return (
      <div className={`flex items-center justify-center h-64 ${className || ''}`}>
        <p className="text-gray-500">Invalid data structure for Sankey chart</p>
      </div>
    )
  }

  return (
    <div className={cn('h-[300px] w-full', className)}>
      {selfReferencingEntries.length > 0 && (
        <div className="p-4 mb-4 border border-gray-700 bg-gray-900/80 backdrop-blur-sm rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <h4 className="text-sm font-semibold text-white">Self-Vestings</h4>
          </div>
          {selfReferencingEntries.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 mb-2 rounded-lg bg-gray-800/50 last:mb-0">
              <span className="text-sm font-medium text-yellow-400">{entry.name}</span>
              <span className="font-semibold text-white">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {normalLinks.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            width={800}
            height={300}
            data={sankeyData}
            nodePadding={60}
            margin={{ left: 80, right: 80, top: 40, bottom: 40 }}
            link={{ stroke: '#2FFA81', strokeOpacity: 0.9 }}
            node={<CustomNode />}>
            <Tooltip content={<CustomTooltip />} />
          </Sankey>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Only self-referencing entries available</p>
        </div>
      )}
    </div>
  )
}

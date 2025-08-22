import { FC } from 'react'

import clsx from 'clsx'

import { ChainIdSupported, ChainsData } from '@modules/ChainAsset/constants'

import styles from './DexToolsChart.module.scss'

type DexToolsChartProps = {
  address: string
  chainId: ChainIdSupported
  className?: string
}

export const DexToolsChart: FC<DexToolsChartProps> = ({ chainId, address, className }) => {
  const chartType = 1
  const url = `https://www.dextools.io/widget-chart/en/${ChainsData[chainId]
    .dexToolsName!}/pe-light/${address}?theme=dark&chartType=${chartType}&chartResolution=30&drawingToolbars=false`

  return (
    <iframe
      id="dextools-widget"
      className={clsx(styles.container, className)}
      title="DEXTools Trading Chart"
      allowTransparency={true}
      src={url}
    />
  )
}

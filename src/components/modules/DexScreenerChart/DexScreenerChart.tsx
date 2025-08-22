import { FC } from 'react'

import clsx from 'clsx'

import { ChainIdSupported, ChainsData } from '@modules/ChainAsset/constants'

import styles from './DexScreenerChart.module.scss'

type DexScreenerChartProps = {
  address: string
  chainId: ChainIdSupported
  className?: string
}

export const DexScreenerChart: FC<DexScreenerChartProps> = ({ chainId, address, className }) => {
  const url = `https://dexscreener.com/${ChainsData[chainId].dexscreenerName}/${address}?embed=1&theme=dark&trades=0&info=0`

  return (
    <iframe
      id="dexscreener-widget"
      className={clsx(styles.container, className)}
      title="DexScreener Trading Chart"
      allowTransparency={true}
      src={url}
    />
  )
}

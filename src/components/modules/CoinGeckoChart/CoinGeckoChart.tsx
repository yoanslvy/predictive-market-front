import { FC } from 'react'

import clsx from 'clsx'

import { ChainIdSupported, ChainsData } from '@modules/ChainAsset/constants'

import styles from './CoinGeckoChart.module.scss'

type CoinGeckoChartProps = {
  address: string
  chainId: ChainIdSupported
  className?: string
}

export const CoinGeckoChart: FC<CoinGeckoChartProps> = ({ chainId, address, className }) => {
  const chartType = 1

  const url = `https://www.geckoterminal.com/${ChainsData[chainId].coingeckoName}/pools/${address}?embed=1&info=0&swaps=0&chart=1&candlesticks=1&trades=0&grayscale=0&light_chart=0`

  return (
    <iframe
      id="coingecko-widget"
      className={clsx(styles.container, className)}
      title="Coingecko Trading Chart"
      allowTransparency={true}
      src={url}
    />
  )
}

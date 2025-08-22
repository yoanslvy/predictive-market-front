
import PoolAsset from '@modules/PoolAsset'
import Tag from '@/src/components/modules/Tag'

import styles from './Card.module.scss'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  chainId: string
  href?: string
  amm?: string
  token0?: {
    address?: string
    symbol?: string
  }
  token1?: {
    address?: string
    symbol?: string
  }
  header: ReactNode
  footer: ReactNode
  isLoading?: boolean
}

export default async function Card(props: CardProps) {
  const { chainId, token0, token1, href, header, amm, footer, isLoading = false } = props

  return (
    <a href={href} className={clsx(styles.card, { [styles.loading]: isLoading })}>
      <div className={clsx(styles.cardHeader, styles.content)}>
        {header}
      </div>
      <div className={styles.cardAsset}>
        {amm ? <Tag caption={amm} type="info" view="fill" /> : <span />}
        <div>
          <PoolAsset
            chainId={chainId}
            onlyIcon
            // size='xl'
            tokens={[
              {
                address: token0!.address!,
                symbol: token0!.symbol!
              },
              {
                address: token1!.address!,
                symbol: token1!.symbol!
              }
            ]}
          />
        </div>
      </div>
      <div className={clsx(styles.cardTokens, styles.content)}>
        <span>
          <span className={styles.colorLight}>{token0!.symbol} / </span>
          <span>{token1!.symbol}</span>
        </span>
      </div>
      <div className={clsx(styles.cardFooter, styles.content)}>
        {footer}
      </div>
    </a>
  )
}
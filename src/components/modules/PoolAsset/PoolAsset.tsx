'server-only'

import { Url } from 'url'
import { clsx } from 'clsx'
import Link from 'next/link'
import { FC } from 'react'

import ChainAsset from '../ChainAsset'
import { isChainIdSupported } from '../ChainAsset/utils'
import TokenAsset from '../TokenAsset'
import { TokenAssetSize } from '../TokenAsset/TokenAsset'
import styles from './PoolAsset.module.scss'

export type PoolAssetTokenProps = {
  address: string
  symbol: string
}

type PoolAssetProps = {
  size?: TokenAssetSize
  chainId: number | string
  className?: string
  onlyIcon?: boolean
  name?: string
  href?: string | Url
  showChain?: boolean

  tokens: PoolAssetTokenProps[]
}

export const PoolAsset: FC<PoolAssetProps> = ({
  className,
  size = 'md',
  onlyIcon,
  chainId,
  name,
  href,
  tokens,
  showChain = true,
}) => {
  const isCorrectChain = isChainIdSupported(chainId)

  const content = (
    <>
      <span className={styles.combo}>
        <span className={clsx(styles.icons, { [styles.withChain]: showChain })}>
          {tokens
            .map((token, idx) => {
              return (
                <TokenAsset
                  key={`${token.address}-${idx}`}
                  chainId={chainId}
                  address={token.address}
                  symbol={token.symbol}
                  className={styles.icon}
                  size={size}
                  showChain={false}
                  onlyIcon
                />
              )
            })
            .reverse()}
        </span>
        {showChain && (
          <ChainAsset id={isCorrectChain ? chainId : 0} className={styles.chain} onlyIcon />
        )}
      </span>

      {!onlyIcon && (
        <span className={styles.title}>
          {name || tokens.map((token) => token.symbol).join('/')}
        </span>
      )}
    </>
  )

  const classProp = clsx(styles.container, styles[size], className)

  if (href) {
    return (
      <Link className={classProp} href={href}>
        {content}
      </Link>
    )
  }

  return <div className={classProp}>{content}</div>
}

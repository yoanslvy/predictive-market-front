'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Url } from 'url'

import { FC } from 'react'

import { clsx } from 'clsx'

import IconUnknown from '@images/emoji/hmm.svg'

import TokenIcon from '@src/components/images/tokenIcon'

import { isChainIdSupported } from '../ChainAsset/utils'
import styles from './TokenAsset.module.scss'

// import { getTokenIconUrl } from './utils'

export type TokenAssetSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'max'

export type TokenAssetProps = {
  size?: TokenAssetSize
  chainId: number | string
  className?: string
  onlyIcon?: boolean
  showChain?: boolean
  address: string
  symbol: string
  name?: string
  href?: string | Url
}

export const revalidate = 3600

export const TokenAsset: FC<TokenAssetProps> = ({
  className,
  size = 'md',
  onlyIcon,
  showChain = true,
  symbol,
  chainId,
  address,
  name,
  href,
}) => {
  const isCorrectChain = isChainIdSupported(chainId)

  const content = (
    <>
      <span className={styles.combo}>
        {showChain && (
          <TokenIcon
            chainId={isCorrectChain ? chainId.toString() : '1'}
            tokenAddress={address}
            classNames={{ unknown: styles.chain }}
          />
        )}
      </span>

      {!onlyIcon && <span className={styles.title}>{name || symbol}</span>}
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

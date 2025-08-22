'server-only'

import Image from 'next/image'
import Link from 'next/link'
import { Url } from 'url'

import { FC } from 'react'

import { clsx } from 'clsx'

import IconUnknown from '@images/emoji/hmm.svg'

import ChainAsset from '../ChainAsset'
import { isChainIdSupported } from '../ChainAsset/utils'
import styles from './TokenAsset.module.scss'
import { getTokenIconUrl } from './utils'

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

export const TokenAsset: FC<TokenAssetProps> = async ({
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
  const imgUrl = await getTokenIconUrl(address, chainId)

  const icon = imgUrl ? (
    <Image src={imgUrl} alt={symbol} width={160} height={160} className={styles.image} />
  ) : (
    <IconUnknown className={styles.unknown} />
  )

  const isCorrectChain = isChainIdSupported(chainId)

  const content = (
    <>
      <span className={styles.combo}>
        <span className={clsx(styles.icon, { [styles.withChain]: showChain })}>{icon}</span>
        {showChain && (
          <ChainAsset id={isCorrectChain ? chainId : 0} className={styles.chain} onlyIcon />
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

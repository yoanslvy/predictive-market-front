'server-only'

import { Url } from 'url'
import { clsx } from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

import IconUnknown from '@images/emoji/hmm.svg'

import ChainAsset from '../ChainAsset'
import { isChainIdSupported } from '../ChainAsset/utils'
import styles from './ImageAsset.module.scss'

export type TokenAssetSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

export type TokenAssetProps = {
  imgUrl:string,
  size?: TokenAssetSize
  chainId: number | string
  className?: string
  onlyIcon?: boolean
  showChain?: boolean
  symbol?: string
  name?: string
  href?: string | Url
}

export const revalidate = 3600

export const ImageAsset: FC<TokenAssetProps> =  ({
  imgUrl,
  className,
  onlyIcon,
  size = 'md',
  showChain = true,
  chainId,
  name,
  symbol,
  href,
}) => {

  const icon = imgUrl ? (
    <img src={imgUrl} alt={imgUrl} width={250} height={250} className={styles.image} />
  ) : (
    <IconUnknown className={styles.unknown} />
  )

  const isCorrectChain = isChainIdSupported(chainId)

  const content = (
    <>
      <span className={styles.combo}>
        <span className={clsx(styles.icon, { [styles.withChain]: showChain })}>{icon}</span>
        {showChain && (
          <ChainAsset id={isCorrectChain ? chainId : 0} className={styles.chain} onlyIcon  />
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

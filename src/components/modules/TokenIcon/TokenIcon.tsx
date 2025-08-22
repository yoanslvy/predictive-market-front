import Image from 'next/image'

import { FC } from 'react'

import clsx from 'clsx'

import IconUnknown from '@images/emoji/hmm.svg'

import styles from './TokenIcon.module.scss'

export type TokenIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type TokenIconProps = {
  symbol: string
  decimals?: string
  logo?: string
  className?: string
  size?: TokenIconSize
}

const TokenIconSizePx: Record<TokenIconSize, number> = {
  xs: 20,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 88,
}

export const TokenIcon: FC<TokenIconProps> = ({ symbol, logo, className, size = 'md' }) => {
  if (!logo) {
    return <IconUnknown className={clsx(styles.icon, styles[size], styles.noImage, className)} />
  }

  return (
    <img
      src={logo}
      alt={symbol}
      className={clsx(styles.icon, styles[size], className)}
      width={TokenIconSizePx[size]}
      height={TokenIconSizePx[size]}
    />
  )
}

import Image, { StaticImageData } from 'next/image'

import { FC, ReactNode } from 'react'

import { clsx } from 'clsx'

import TokenIconsChain from '@modules/TokenIconsChain'

import { TokenIconProps } from '../../TokenIcon/TokenIcon'
import styles from './PageBanner.module.scss'

export type PageBannerProps = {
  image?: string | StaticImageData
  className?: string
  tokens?: TokenIconProps[]
  children?: ReactNode
}

export const PageBanner: FC<PageBannerProps> = ({ image, className, tokens, children }) => {
  return (
    <div className={clsx(styles.container, className)}>
      {!!image && (
        <Image src={image} className={styles.illustration} alt="" width={1008} height={361} />
      )}

      {!!children && <div className={styles.body}>{children}</div>}

      <TokenIconsChain tokens={tokens} className={styles.tokens} size="xl" />
    </div>
  )
}

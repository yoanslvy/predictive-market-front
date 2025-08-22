import { FC } from 'react'

import { clsx } from 'clsx'

import styles from './ChainAsset.module.scss'
import { ChainIdSupported, ChainsData } from './constants'
import { isChainIdSupported } from './utils'

type ChainAssetProps = {
  id: ChainIdSupported | string
  className?: string
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onlyIcon?: boolean
  isShort?: boolean
}

export const ChainAsset: FC<ChainAssetProps> = ({
  id,
  className,
  size,
  onlyIcon = true,
  isShort,
}) => {
  const numberId = Number(id)
  const currentId = isChainIdSupported(numberId) ? numberId : 0

  return (
    <div className={clsx(styles.container, { [styles[size || '']]: !!size }, className)}>
      <span className={styles.icon}>{ChainsData[currentId].logo}</span>

      {!onlyIcon && (
        <span className={styles.title}>
          {ChainsData[currentId][isShort ? 'shortName' : 'displayName']}
        </span>
      )}
    </div>
  )
}

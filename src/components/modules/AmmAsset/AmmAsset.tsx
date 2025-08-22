import { clsx } from 'clsx'
import { FC } from 'react'

import styles from './AmmAsset.module.scss'
import { AmmData, AmmSupported } from './constants'

type AmmAssetProps = {
  id: AmmSupported | string
  className?: string
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onlyIcon?: boolean
  isShort?: boolean
}

export const AmmAsset: FC<AmmAssetProps> = ({
  id,
  className,
  size,
  onlyIcon = true,
  isShort,
}) => {

  return (
    <div className={clsx(styles.container, { [styles[size || '']]: !!size }, className)}>
      <span className={styles.icon}>{AmmData[id].icon}</span>

      {!onlyIcon && (
        <span className={styles.title}>
          {id}
        </span>
      )}
    </div>
  )
}

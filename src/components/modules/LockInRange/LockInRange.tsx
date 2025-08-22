import { FC } from 'react'

import styles from './LockInRange.module.scss'
import clsx from 'clsx'
import Tag from '../Tag'

interface LockInRangeProps{
  minPrice: string
  currentPrice: String
  maxPrice: string
  inRange: boolean
}

export const LockInRange: FC<LockInRangeProps> = ({ minPrice, currentPrice, maxPrice, inRange }) => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <span className={styles.subtitle}>Min. price</span>
        <span className={styles.value}>{minPrice}</span>
      </div>
      <div className={styles.item}>
        <div>
          <span className={styles.subtitle}>Current price</span>
          <Tag 
            type={inRange ? 'success' : 'danger'}
            caption={inRange ? "In range" : "Out of Range"} 
            className="ml-2" 
          />
        </div>
        <span className={styles.value}>{currentPrice}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.subtitle}>Max. price</span>
        <span className={styles.value}>{maxPrice}</span>
      </div>
    </div>
  )
}

import clsx from 'clsx'
import { FC } from 'react'

import Separated from '../Separated'
import Value from '../Value'
import { ValueProps, ValueSize } from '../Value/Value'
import styles from './Stats.module.scss'

type StatProps = ValueProps | null

export type StatsProps = {
  className?: string
  items: StatProps[]
  size?: ValueSize
}

export const Stats: FC<StatsProps> = ({ className, items, size = 'md' }) => {
  return (
    <Separated className={clsx(styles.container, className)}>
      {items.map((item, idx) => {
        if (!item) {
          return ''
        }

        return <Value key={idx} {...item} size={size} />
      })}
    </Separated>
  )
}

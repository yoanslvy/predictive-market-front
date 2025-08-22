import clsx from 'clsx'
import { createElement, FC, HTMLProps, ReactNode } from 'react'

import styles from './Progress.module.scss'

type ProgressSize = 'sm' | 'md' | 'lg'
type ProgressType = 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'info'

type ProgressProps = Omit<HTMLProps<HTMLProgressElement>, 'size'> & {
  size?: ProgressSize
  type?: ProgressType
  unit?: string
  isShowValue?: boolean
  block?: boolean
  low?: number
  optimum?: number
  high?: number
}

export const Progress: FC<ProgressProps> = ({
  className,
  size = 'md',
  type = 'primary',
  unit,
  isShowValue,
  block,
  low,
  optimum,
  high,
  ...props
}) => {
  const isMeter = !!low || !!optimum || !!high

  return (
    <div
      className={clsx(
        styles.container,
        styles[type],
        styles[size],
        { [styles.block]: block },
        className
      )}
      title={!isShowValue ? `${props.value}${unit || ''}` : undefined}>
      {createElement(
        isMeter ? 'meter' : 'progress',
        {
          ...{ className: styles.progress, ...props, low, optimum, high },
        },
        props.value
      )}

      {isShowValue && (
        <span className={styles.value}>
          {props.value}
          {unit}
        </span>
      )}
    </div>
  )
}

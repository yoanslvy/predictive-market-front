import clsx from 'clsx'
import { FC } from 'react'

import styles from './Column.module.scss'

type ColumnProps = JSX.IntrinsicElements['div']

export const Column: FC<ColumnProps> = ({ className, children, ...props }) => {
  return (
    <div {...props} className={clsx(styles.container, className)}>
      {children}
    </div>
  )
}

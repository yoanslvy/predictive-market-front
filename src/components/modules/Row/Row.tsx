import clsx from 'clsx'
import { FC } from 'react'

import styles from './Row.module.scss'

type RowProps = JSX.IntrinsicElements['div']

export const Row: FC<RowProps> = ({ className, children, ...props }) => {
  return (
    <div {...props} className={clsx(styles.container, className)}>
      {children}
    </div>
  )
}

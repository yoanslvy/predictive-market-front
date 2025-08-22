import clsx from 'clsx'
import { FC } from 'react'

import styles from './Col.module.scss'

type ColProps = JSX.IntrinsicElements['div'] & { block?: boolean }

export const Col: FC<ColProps> = ({ className, block, children, ...props }) => {
  return (
    <div {...props} className={clsx(styles.container, { [styles.block]: !!block }, className)}>
      {children}
    </div>
  )
}

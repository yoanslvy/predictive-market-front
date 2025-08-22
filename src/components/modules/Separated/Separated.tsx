import clsx from 'clsx'
import { FC, ReactNode } from 'react'

import styles from './Separated.module.scss'

export type SeparatedProps = {
  className?: string
  children?: ReactNode | ReactNode[]
  direction?: 'horizontal' | 'vertical'
}

export const Separated: FC<SeparatedProps> = ({
  className,
  children,
  direction = 'horizontal',
}) => {
  const content = Array.isArray(children)
    ? children?.map((child, idx) => {
        if (!child) {
          return <div className={styles.delimiter} key={idx} />
        }

        return (
          <div className={styles.item} key={idx}>
            {child}
          </div>
        )
      })
    : children

  return <div className={clsx(styles.container, styles[direction], className)}>{content}</div>
}

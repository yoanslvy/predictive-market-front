import { clsx } from 'clsx'
import { FC, ReactNode } from 'react'

import Heading from '../Heading'
import Tools from '../Tools'
import styles from './Frame.module.scss'

export type FrameProps = {
  title: ReactNode
  tools?: ReactNode
  footer?: ReactNode
  className?: string
  children?: ReactNode
  icon?: ReactNode
}

export const Frame: FC<FrameProps> = ({ icon, title, tools, footer, className, children }) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        {!!icon && <span className={styles.icon}>{icon}</span>}
        <Heading size="xl" className={styles.heading} title={title} />
        <Tools className={styles.tools}>{tools}</Tools>
      </div>
      <div className={styles.body}>{children}</div>
      {!!footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}

import clsx from 'clsx'
import { FC, ReactNode } from 'react'

import styles from './Tools.module.scss'

type ToolsProps = {
  className?: string
  children?: ReactNode | ReactNode
}

export const Tools: FC<ToolsProps> = ({ className, children }) => {
  if (!children) {
    return null
  }

  return <div className={clsx(styles.container, className)}>{children}</div>
}

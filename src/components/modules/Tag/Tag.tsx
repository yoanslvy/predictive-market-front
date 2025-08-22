import { clsx } from 'clsx'
import { FC, ReactNode } from 'react'

import styles from './Tag.module.scss'

type TagSize = 'sm' | 'md' | 'lg'
type TagView = 'fill' | 'outline'

export type TagType =
  | 'default'
  | 'comment'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'prompt'
  | 'clear'

type TagProps = {
  caption?: ReactNode
  className?: string
  children?: ReactNode | ReactNode[]
  type?: TagType
  view?: TagView
  size?: TagSize
}

export const Tag: FC<TagProps> = ({
  caption,
  className,
  children,
  type = 'default',
  view = 'outline',
  size = 'md',
}) => {
  return (
    <span className={clsx(styles.container, styles[type], styles[size], styles[view], className)}>
      <span className={styles.caption}>{caption || children}</span>
    </span>
  )
}

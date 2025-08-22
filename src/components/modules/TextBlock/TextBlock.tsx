import clsx from 'clsx'
import { FC, ReactNode } from 'react'

import styles from './TextBlock.module.scss'

type TextBlockSize = 'sm' | 'md' | 'lg'
type TextBlockAlign = 'start' | 'center' | 'end'
type TextBlockType = 'dark' | 'light' | 'success' | 'danger' | 'warn' | 'prompt' | 'info'

type TextBlockProps = {
  className?: string
  type?: TextBlockType
  align?: TextBlockAlign
  size?: TextBlockSize
  children?: ReactNode | ReactNode[]
}

export const TextBlock: FC<TextBlockProps> = ({
  className,
  children,
  size,
  align = 'start',
  type = 'dark',
}) => {
  return (
    <div
      className={clsx(
        styles.container,
        { [styles[size || '']]: !!size },
        styles[align],
        styles[type],
        className
      )}>
      {children}
    </div>
  )
}

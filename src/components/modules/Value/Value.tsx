import { FC, ReactNode } from 'react'

import clsx from 'clsx'

import styles from './Value.module.scss'

export type ValueSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg'

export type ValueProps = {
  title?: ReactNode
  value?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  className?: string
  children?: ReactNode
  size?: ValueSize
  isLoading?: boolean
  icon?: ReactNode
  footer?: ReactNode
  align?: string
}

export const Value: FC<ValueProps> = ({
  title,
  value,
  className,
  prefix,
  suffix,
  size = 'lg',
  isLoading,
  icon,
  footer,
  children,
  align,
}) => {
  const valueDisplay = typeof value === 'undefined' ? children : value

  return (
    <span
      className={clsx(
        styles.container,
        { [styles[size]]: !!size, [styles.loading]: isLoading },
        className
      )}>
      {!!title && (
        <span className={clsx(styles.header, styles[align || ''])}>
          <strong className={styles.title}>{title}</strong>
        </span>
      )}

      <span className={clsx(styles.body, styles[align || ''])}>
        {!!icon && <span className={styles.icon}>{icon}</span>}
        {!!prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.value}>{valueDisplay || <>0</>}</span>
        {!!suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>
      {!!footer && (
        <span className={clsx(styles.footer, styles[align || ''])}>
          <span>{footer}</span>
        </span>
      )}
    </span>
  )
}

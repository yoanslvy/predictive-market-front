import { FC, ReactNode } from 'react'

import clsx from 'clsx'

import styles from './Step.module.scss'

export type StepProps = {
  id?: string
  subtitle?: ReactNode
  content?: ReactNode
  children?: ReactNode | ReactNode[]
  isActive?: boolean
  isPassed?: boolean
  className?: string
}

export const Step: FC<StepProps> = ({
  className,
  subtitle,
  content,
  isActive,
  isPassed,
  children,
}) => {
  return (
    <div className={clsx(styles.container, { [styles.active]: isActive }, className)}>
      <div className={styles.header}>
        {!!subtitle && (
          <div
            className={clsx(
              styles.subtitle,
              isPassed ? styles.subtitlePassed : undefined,
              isActive ? styles.subtitleActive : undefined
            )}>
            {subtitle}
          </div>
        )}
      </div>
      {isActive && <div className={styles.body}>{content || children}</div>}
    </div>
  )
}

import Link from 'next/link'

import { FC, ReactNode } from 'react'

import clsx from 'clsx'

import { MenuChildresProps } from '@/src/app/stealth/explore/navigatedContent'

import styles from './MenuItem.module.scss'

export type MenuItemProps = {
  href: string | URL
  title: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  className?: string
  isActive?: boolean
  name?: string
  childrens?: MenuChildresProps[]
  onClick?: (index: number) => void
}

export const MenuItem: FC<MenuItemProps> = ({
  href,
  className,
  icon,
  title,
  subtitle,
  isActive,
}) => {
  return (
    <Link
      type="link"
      href={href}
      className={clsx(styles.container, { [styles.active]: isActive }, className)}>
      {!!icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.content}>
        <strong className={styles.title}>{title}</strong>
        {!!subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </Link>
  )
}

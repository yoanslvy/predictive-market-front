import { FC, ReactNode } from 'react'

import clsx from 'clsx'

import { MenuChildresProps } from '@/src/app/stealth/explore/navigatedContent'

import styles from './MenuItemToggle.module.scss'

export type MenuItemProps = {
  href?: string | URL
  title: ReactNode
  subtitle?: ReactNode
  icon?: ReactNode
  className?: string
  isActive?: boolean
  childrens?: MenuChildresProps[]
  name?: string
  onClick?: (openFilter?: string) => void
}

export const MenuItemToggle: FC<MenuItemProps> = ({
  className,
  title,
  isActive,
  childrens,
  name,
  onClick,
}) => {
  if (!onClick) {
    return null
  }

  return (
    <>
      <div className={clsx(styles.container, { [styles.active]: isActive }, className)}>
        <div className={clsx(styles.itemToggle)} onClick={() => onClick(name)}>
          <span>{title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.46967 7.96967C4.76256 7.67678 5.23744 7.67678 5.53033 7.96967L10 12.4393L14.4697 7.96967C14.7626 7.67678 15.2374 7.67678 15.5303 7.96967C15.8232 8.26256 15.8232 8.73744 15.5303 9.03033L10.5303 14.0303C10.2374 14.3232 9.76256 14.3232 9.46967 14.0303L4.46967 9.03033C4.17678 8.73744 4.17678 8.26256 4.46967 7.96967Z"
              fill="white"
            />
          </svg>
        </div>
        {childrens && childrens.length > 0 && isActive && (
          <div className={styles.containerChildren}>
            {childrens.map((item, index) => (
              <div
                onClick={() => item.onClick(item.key, item.value)}
                key={index}
                className={clsx(styles.children, { [styles.active]: item.isActive })}>
                {item.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

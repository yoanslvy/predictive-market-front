import { cloneElement, FC, ReactElement, ReactNode } from 'react'

import clsx from 'clsx'

import List from '../List'
import styles from './Menu.module.scss'
import { MenuItem, MenuItemProps } from './MenuItem'
import { MenuItemToggle } from './MenuItemToggle'

type MenuItemType = ReactElement<MenuItemProps>

export type MenuProps = {
  title?: ReactNode
  titleIcon?: ReactNode // Add this new prop for the SVG
  className?: string
  items?: MenuItemProps[]
  children?: MenuItemType | MenuItemType[]
  isToggle?: boolean
  onClick?: (openFilter?: string) => void
}

export const Menu: FC<MenuProps> = ({
  title,
  titleIcon, // Add the new prop here
  className,
  items = [],
  children = [],
  isToggle,
  onClick,
}) => {
  const itemsArr =
    items?.map((item, idx) => {
      if (isToggle)
        return <MenuItemToggle {...item} key={idx} className={styles.item} onClick={onClick} />
      return <MenuItem {...item} key={idx} className={styles.item} />
    }) || []
  const childrenArr = (Array.isArray(children) ? children : [children]).map((child, idx) => {
    return cloneElement(child, {
      className: clsx(styles.item, child.props.className),
      key: idx,
    })
  })

  const source = [...itemsArr, ...(childrenArr || [])]

  if (!source.length) {
    return null
  }

  return (
    <nav className={clsx(styles.container, className)}>
      {!!title && (
        <div className={styles.header}>
          {titleIcon && <span className={styles.titleIcon}>{titleIcon}</span>}
          <strong className={styles.title}>{title}</strong>
        </div>
      )}
      <List className={styles.list}>{source}</List>
    </nav>
  )
}

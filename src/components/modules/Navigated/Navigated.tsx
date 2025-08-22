import { FC, ReactNode } from 'react'

import { clsx } from 'clsx'

import Dropdown from '../Dropdown'
import { Menu, MenuProps } from '../Menu/Menu'
import { MenuItemProps } from '../Menu/MenuItem'
import styles from './Navigated.module.scss'

type NavigatedProps = {
  className?: string
  menu: MenuProps | MenuProps[]
  children?: ReactNode | ReactNode[]
}

export const Navigated: FC<NavigatedProps> = ({ className, children, menu }) => {
  const menuArr: MenuProps[] = Array.isArray(menu) ? menu : [menu]

  const content = menuArr.map((section, idx) => (
    <Menu {...section} className={clsx(styles.section, section.className)} key={idx} />
  ))

  const activeItem = menuArr
    .reduce((acc: MenuItemProps[], cur) => {
      return [...acc, ...(cur.items || [])]
    }, [])
    .find((item) => item.isActive)

  return (
    <div className={clsx(styles.container, className)}>
      <aside className={styles.aside}>
        <Dropdown
          size="xxl"
          className={styles.dropdown}
          icon={activeItem?.icon || menuArr[0].items?.[0].icon || ''}
          caption={activeItem?.title || menuArr[0].items?.[0].title || ''}>
          <div className={styles.dropdownContent}>{content}</div>
        </Dropdown>

        <div className={styles.menu}>{content}</div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}

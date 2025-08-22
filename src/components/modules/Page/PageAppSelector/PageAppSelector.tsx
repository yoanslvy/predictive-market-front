import AppMenu from '@modules/AppMenu'
import Dropdown from '@modules/Dropdown'
import clsx from 'clsx'
import { FC } from 'react'

import styles from './PageAppSelector.module.scss'

export type PageAppSelectorProps = {
  className?: string
  title: string
}

export const PageAppSelector: FC<PageAppSelectorProps> = ({ className, title }) => {
  return (
    <Dropdown
      type="link"
      size="lg"
      caption={title}
      className={clsx(styles.selector, className)}
      dropdownClassName={styles.dropdown}>
      <AppMenu className={styles.content} />
    </Dropdown>
  )
}

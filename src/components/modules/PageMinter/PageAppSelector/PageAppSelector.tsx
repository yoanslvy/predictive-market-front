import { useSearchParams } from 'next/navigation'

import { FC } from 'react'

import clsx from 'clsx'

import AppMenu from '@modules/AppMenu'
import Dropdown from '@modules/Dropdown'

import styles from './PageAppSelector.module.scss'

export type PageAppSelectorProps = {
  className?: string
  title: string
}

export const PageAppSelector: FC<PageAppSelectorProps> = ({ className, title }) => {
  const searchParams = useSearchParams()

  const searchParamsObject = Object.fromEntries(searchParams)

  return (
    <Dropdown
      type="link"
      size="lg"
      caption={title}
      className={clsx(styles.selector, className)}
      dropdownClassName={styles.dropdown}>
      <AppMenu className={styles.content} searchParams={searchParamsObject} />
    </Dropdown>
  )
}

import clsx from 'clsx'
import Link from 'next/link'
import { FC } from 'react'
import { UrlObject } from 'url'

import IconArrow from '@images/icons/arrowLeft.svg'

import styles from './Breadcrumbs.module.scss'

type BreadcrumbProps = {
  href: string | UrlObject
  caption: string
}

type BreadcrumbsProps = {
  className?: string
  items?: BreadcrumbProps[]
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ className, items }) => {
  if (!items?.length) {
    return null
  }

  return (
    <nav className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {items.map((item, idx) => {
          return (
            <li className={styles.item} key={idx}>
              <Link href={item.href} className={styles.link}>
                {items.length === 1 ? <IconArrow className={styles.icon} /> : null}
                <span className={styles.caption}>{item.caption}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

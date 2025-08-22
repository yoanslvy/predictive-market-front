import { parse, UrlObject } from 'url'

import { FC } from 'react'

import { clsx } from 'clsx'

import Button from '../Button'
import styles from './Pagination.module.scss'

type PaginationProps = {
  className?: string
  onChange?: (page: number) => void
  total?: number
  perPage?: number
  page?: number | string
  pathname: string
  query?: Record<string, string | number | null | undefined>
  hasEndings?: boolean
  skipRadius?: number
  paramName?: string
}
export const Pagination: FC<PaginationProps> = ({
  className,
  page = 1,
  perPage = 12,
  total = 0,
  pathname,
  query,
  hasEndings = true,
  skipRadius = 3,
  paramName = 'page',
}) => {
  const totalPages = Math.ceil(total / perPage)

  const getPageUrl = (page: number): UrlObject => ({
    pathname,
    query: { ...(query || {}), [paramName]: page },
  })

  const currentPage = Math.max(Number(page || 1), 1)

  return (
    <nav className={clsx(styles.container, className)}>
      {/* {hasEndings && (
        <Button
          href={getPageUrl(1)}
          size="sm"
          className={clsx(styles.link, styles.nav, {
            [styles.disabled]: page === 1,
          })}
          caption="First"
        />
      )} */}
      <ul className={styles.list}>
        {Array.from(Array(totalPages)).map((_, idx) => {
          const listPage = idx + 1

          if (
            skipRadius > 0 &&
            listPage !== 1 &&
            listPage !== totalPages &&
            (listPage <= currentPage - skipRadius || listPage >= currentPage + skipRadius)
          ) {
            if (listPage === currentPage - skipRadius || listPage === currentPage + skipRadius) {
              return (
                <li className={styles.item} key={idx}>
                  <span className={styles.skip}>&hellip;</span>
                </li>
              )
            }

            return null
          }

          return (
            <li className={styles.item} key={idx}>
              <Button
                href={getPageUrl(listPage)}
                size="sm"
                scroll={false}
                isActive={listPage === page}
                className={clsx(styles.link, {
                  [styles.active]: listPage === page,
                })}
                caption={listPage}
              />
            </li>
          )
        })}
      </ul>
      {/* {hasEndings && (
        <Button
          href={getPageUrl(totalPages)}
          size="sm"
          className={clsx(styles.link, styles.nav, {
            [styles.disabled]: page === totalPages,
          })}
          disabled={page === totalPages}
          caption="Last"
        />
      )} */}
    </nav>
  )
}

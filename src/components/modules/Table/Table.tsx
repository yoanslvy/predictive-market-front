import { UrlObject } from 'url'
import clsx from 'clsx'
import { createElement, ReactNode } from 'react'

import { useBodyRows, useHeader } from './hooks'
import styles from './Table.module.scss'

export type TableColumnProps<T, V = null> = {
  render?: (props: { data: T; placeholder?: ReactNode; idx?: number; vars?: V }) => ReactNode
  accessor?: string
  title?: ReactNode
  type?: 'number' | 'text' | 'center'
  modifier?: string
  placeholder?: ReactNode
}

export type TableRowHref<T> = (string | UrlObject) | ((data?: T) => string | UrlObject)

export type TableProps<T, V> = {
  columns: TableColumnProps<T, V>[]
  data: T[]
  className?: string
  showHeader?: boolean
  isLoading?: boolean
  loadingCount?: number
  rowClassName?: string
  inner?: boolean
  rowKey?: (rowData: T) => string | null
  rowVars?: (data?: T) => V
  rowHref?: TableRowHref<T>
  minWidth?: string
  target?: string
}

export function Table<T, V>({
  columns,
  data,
  showHeader = true,
  className,
  isLoading,
  loadingCount,
  rowClassName,
  inner,
  rowKey,
  rowVars,
  rowHref,
  minWidth,
  target
}: TableProps<T, V>) {
  const isLinkRows = typeof rowHref !== 'undefined'

  const header = useHeader<T, V>({
    columns,
    rowClassName,
    isLinkRows,
  })

  const rows = useBodyRows<T, V>({
    columns,
    data,
    rowClassName,
    isLoading,
    loadingCount,
    rowKey,
    rowVars,
    rowHref,
    isLinkRows,
    target
  })

  return (
    <div className={clsx(styles.container, { [styles.inner]: inner }, className)}>
      {createElement(
        isLinkRows ? 'div' : 'table',
        { className: clsx(styles.table, { [styles.loading]: isLoading }), style: {minWidth: `${minWidth}px`}},
        <>
          {showHeader &&
            createElement(
              isLinkRows ? 'div' : 'thead',
              {
                className: clsx(styles.thead, { [styles.loading]: isLoading }),
              },
              header
            )}

          {createElement(
            isLinkRows ? 'div' : 'tbody',
            {
              className: clsx(styles.tbody, { [styles.loading]: isLoading }),
            },
            rows
          )}
        </>
      )}
    </div>
  )
}

export default Table

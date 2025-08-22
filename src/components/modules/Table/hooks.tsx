import { format } from 'url'
import clsx from 'clsx'
import { createElement } from 'react'

import { TableColumnProps, TableRowHref } from './Table'
import styles from './Table.module.scss'
import { TableCell } from './TableCell'
import Link from 'next/link';

export const useBodyRows = <T, V>(options: {
  columns: TableColumnProps<T, V>[]
  data?: T[]
  rowClassName?: string
  rowVars?: (data?: T) => V
  rowHref?: TableRowHref<T>
  rowKey?: (rowData: T, index?: number) => string | null
  isLoading?: boolean
  loadingCount?: number
  isLinkRows?: boolean
  target?: string
}) => {
  const {
    columns,
    data,
    rowClassName,
    rowKey,
    isLoading,
    loadingCount,
    rowVars,
    rowHref,
    isLinkRows,
    target
  } = options

  const dataArr = isLoading ? Array.from(Array(loadingCount || data?.length || 10)) : data

  return dataArr?.map((dataItem, rowIdx) => {
    const vars = rowVars?.(dataItem)

    const cells = columns.map((column, cellIdx) => {
      const className = clsx(styles[column.type || 'text'], styles[column.modifier || 'default'])

      const cellDisplay = column.render
        ? column.render({
          data: dataItem || ({} as T),
          placeholder: column.placeholder,
          idx: rowIdx,
          vars,
        })
        : column.accessor
          ? dataItem?.[column.accessor] || column.placeholder
          : column.placeholder || <>&nbsp;</>

      return (
        <TableCell
          key={`${column.accessor}-${cellIdx}`}
          className={className}
          isLinkRow={isLinkRows}>
          <div className={styles.content}>{cellDisplay}</div>
        </TableCell>
      )
    })

    const href = typeof rowHref === 'function' ? format(rowHref?.(dataItem)) : rowHref

      // Render as a link row with Next.js Link component
      if (isLinkRows && href) {
        // If it's a link row and href is provided, use Link for navigation
        return (
          <Link
            href={href}
            key={rowKey?.(dataItem) || rowIdx}
            className={clsx(styles.trow, styles.tbodyrow, rowClassName)}
            target={target || undefined}
            passHref={true}
          >
            {cells}
          </Link>
        );


      } else {
        // If not a link, choose between 'div' or 'tr'
        const Tag = isLinkRows ? 'div' : 'tr';
        return createElement(
          Tag,
          {
            key: rowKey?.(dataItem) || rowIdx,
            className: clsx(styles.trow, styles.tbodyrow, rowClassName),
            target: target ? target : undefined
          },
          cells
        );
      }
    
  })
}

export const useHeader = <T, V>({
  columns,
  rowClassName,
  isLinkRows,
}: {
  columns: TableColumnProps<T, V>[]
  rowClassName?: string
  isLinkRows?: boolean
}) => {
  const cells = columns.map((column, idx) => {
    const className = clsx(styles[column.type || 'text'], styles[column.modifier || 'default'])

    return (
      <TableCell
        isHeader
        key={`${column.accessor}-${idx}`}
        className={className}
        isLinkRow={isLinkRows}>
        {column.title || null}
      </TableCell>
    )
  })

  return createElement(
    isLinkRows ? 'div' : 'tr',
    { className: clsx(styles.trow, styles.theadrow, rowClassName) },
    cells
  )
}

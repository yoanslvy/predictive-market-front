import clsx from 'clsx'
import { CSSProperties, FC } from 'react'
import uniqolor from 'uniqolor'

import styles from './StackChart.module.scss'

type StackChartItem = {
  value: number
  id: string
  type?: 'success' | 'warn' | 'danger' | 'info'
}

type StackChartProps = {
  className?: string
  direction?: 'horizontal' | 'vertical'
  items: StackChartItem[]
  max?: number
  showZeroValues?: boolean
}

export const StackChart: FC<StackChartProps> = ({
  direction = 'horizontal',
  items,
  max,
  className,
  showZeroValues = true,
}) => {
  const total = items.reduce((acc, curr) => acc + curr.value, 0)
  const maxCalc = Math.max(max || total, total)
  const maxVal = Math.max(...items.map((item) => item.value))
  let minVal = Math.min(...items.map((item) => item.value))

  if (minVal === maxVal) {
    minVal = 0
  }

  const valueLeft = maxCalc - total

  return (
    <div className={clsx(styles.container, styles[direction], className)}>
      {items.map((item, idx) => {
        if (!item.value && !showZeroValues) {
          return null
        }

        const ratio = item.value / maxCalc
        const rating = (item.value - minVal) / (maxVal - minVal)
        const color = !item.type ? uniqolor(item.id).color : undefined

        return (
          <div
            key={idx}
            className={clsx(styles.item, {
              [styles[item.type || '']]: !!item.type,
              [styles.color]: !!color,
            })}
            style={{ '--ratio': ratio, '--rating': rating, '--color': color } as CSSProperties}
          />
        )
      })}

      {!!valueLeft && (
        <div
          className={clsx(styles.item, styles.leftover)}
          style={{ '--ratio': valueLeft / maxCalc } as CSSProperties}
        />
      )}
    </div>
  )
}

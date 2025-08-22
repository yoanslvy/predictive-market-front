'use client'

import { clsx } from 'clsx'
import { FC, useEffect, useState } from 'react'
import { usePreviousDifferent } from 'rooks'

import { Button, ButtonProps, ButtonSize } from '../Button/Button'
import styles from './Tabs.module.scss'

export type TabProps = ButtonProps & { value: string }

export type TabsProps = {
  items: TabProps[]
  prefetch?: boolean,
  className?: string
  buttonClassName?: string
  type?: 'section' | 'switch'
  size?: ButtonSize
  defaultValue?: string
  value?: string
  disabled?: boolean
  onChange?: (item: TabProps) => void
}

export const Tabs: FC<TabsProps> = ({
  className,
  buttonClassName,
  type = 'section',
  size,
  items,
  prefetch,
  value,
  defaultValue,
  disabled,
  onChange,
}) => {
  const getPossibleCurrentItem = (initial?: boolean): TabProps => {
    return (
      items.find(
        (item) => item.isActive || item.value === (value || (initial ? defaultValue : undefined))
      ) || items[0]
    )
  }

  const [currentItem, setCurrentItem] = useState<TabProps>(getPossibleCurrentItem(true))
  const previousItem = usePreviousDifferent(currentItem)

  useEffect(() => {
    if (typeof value === 'undefined' || previousItem?.value === value) {
      return
    }

    setCurrentItem(getPossibleCurrentItem())
  }, [value])

  const handleItemClick = (item: TabProps): void => {
    setCurrentItem(item)
    onChange?.(item)
  }

  return (
    <nav className={clsx(styles.container, { [styles[type]]: !!type }, className)}>
      <ul className={styles.list}>
        {items.map((item, idx) => {
          const {
            value: itemValue,
            className: itemClassName,
            disabled: itemDisabled,
            ...props
          } = item

          const classProp = clsx(
            styles.tab,
            { [styles.active]: currentItem?.value === itemValue },
            buttonClassName,
            itemClassName
          )

          return (
            <li className={styles.item} key={idx}>
              <Button
                prefetch={prefetch}
                type="link"
                size={size}
                scroll={false}
                {...props}
                isActive={currentItem?.value === item.value}
                isDisabled={disabled || itemDisabled || item.isDisabled}
                className={classProp}
                onClick={(e): void => {
                  handleItemClick(item)
                }}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

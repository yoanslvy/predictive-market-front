'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { ReactNode, useEffect, useState } from 'react'

import { clsx } from 'clsx'

import { Button, ButtonSize } from '../Button/Button'
import Heading from '../Heading'
import styles from './Variants.module.scss'

export type VariantProps<T> = {
  title: ReactNode
  subtitle?: ReactNode
  value: T
  timeValue?: number
  timeType?: string
  boostPercentage?: number
}

export type VariantsProps<T> = {
  className?: string
  title?: ReactNode
  tooltip?: string
  size?: ButtonSize
  items: VariantProps<T>[]
  defaultValue?: T
  value?: T
  onChange?: (item: VariantProps<T>) => void
}

export function Variants<T>({
  className,
  title,
  tooltip,
  items,
  size,
  defaultValue,
  value,
  onChange,
}: VariantsProps<T>) {
  const [currentItem, setCurrentItem] = useState<VariantProps<T>>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 3

  useEffect(() => {
    const newCurrentItem = items.find(
      (item) => item.value === (value || defaultValue || items[0]?.value)
    )
    setCurrentItem(newCurrentItem)
  }, [value, defaultValue, items])

  const handleItemClick = (item: VariantProps<T>): void => {
    setCurrentItem(item)
    onChange?.(item)
  }

  const scrollLeft = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerView))
  }

  const scrollRight = () => {
    setCurrentIndex((prev) => Math.min(items.length - itemsPerView, prev + itemsPerView))
  }

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <div className={clsx(styles.container, className)}>
      {(title || tooltip) && (
        <div className={styles.header}>
          <Heading title={title} tooltip={tooltip} className={styles.heading} />
        </div>
      )}
      <div className={styles.carouselContainer}>
        <button
          className={clsx(styles.navButton, styles.navButtonLeft)}
          onClick={scrollLeft}
          disabled={currentIndex === 0}
          type="button">
          <ChevronLeft size={24} />
        </button>

        <div className={styles.body}>
          <ul className={styles.list}>
            {visibleItems.map((item, idx) => {
              const caption = (
                <div className={styles.caption}>
                  <strong className={styles.captionTitle}>{item.title}</strong>
                  {!!item.subtitle && (
                    <span className={styles.captionSubtitle}>{item.subtitle}</span>
                  )}
                </div>
              )

              const isActive = currentItem?.value === item.value

              return (
                <li className={styles.item} key={currentIndex + idx}>
                  <Button
                    caption={caption}
                    className={clsx(styles.button, { [styles.active]: isActive })}
                    size={size}
                    type="default"
                    isActive={isActive}
                    onClick={() => handleItemClick(item)}
                  />
                </li>
              )
            })}
          </ul>
        </div>

        <button
          className={clsx(styles.navButton, styles.navButtonRight)}
          onClick={scrollRight}
          disabled={currentIndex >= items.length - itemsPerView}
          type="button">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}

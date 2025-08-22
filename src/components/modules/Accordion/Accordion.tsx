'use client'

import { FC, ReactNode, useState } from 'react'

import { clsx } from 'clsx'

import Arrow from '@images/icons/chevronD.svg'

import styles from './Accordion.module.scss'

type AccordionProps = {
  accordions: {
    title: ReactNode
    isOpen: boolean
    childrens: ReactNode[]
  }[]
}

export const Accordion: FC<AccordionProps> = ({ accordions }) => {
  const [items, setItems] = useState(
    accordions.map((item) => {
      return { ...item, isOpen: item.isOpen }
    })
  )

  const onClick = (index: number) => {
    const newItems = items.map((item, idx) => {
      if (index === idx) return { ...item, isOpen: !item.isOpen }

      return item
    })
    setItems(newItems)
  }
  return (
    <div className={styles.container}>
      {items.map(
        (
          {
            id,
            title,
            isOpen,
            childrens,
          }: {
            id?: string | number
            isOpen: boolean
            title: ReactNode
            childrens: ReactNode[]
          },
          index: number
        ) => {
          const key = id ?? index
          return (
            <div className={styles.accordionItem} key={key}>
              <button className={styles.accordionHeader} onClick={() => onClick(index)}>
                <span>{title}</span>
                <Arrow className={clsx(styles.accordionIcon, isOpen ? styles.isOpen : undefined)} />
              </button>
              {isOpen && (
                <div className={styles.accordionCollapse}>
                  {childrens.map((children: ReactNode, childIndex: number) => (
                    <div key={`${key}-child-${childIndex}`} className={styles.accordionBody}>
                      {children}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }
      )}
    </div>
  )
}

export default Accordion

import { FC, ReactNode } from 'react'

import clsx from 'clsx'

import Heading from '../Heading'
import Tabs from '../Tabs'
import { TabsProps } from '../Tabs/Tabs'
import styles from './Section.module.scss'

export type SectionProps = {
  title?: ReactNode
  subtitle?: ReactNode
  tools?: ReactNode
  tabs?: TabsProps
  children?: ReactNode | ReactNode[]
}

export const Section: FC<SectionProps> = ({ title, subtitle, tools, tabs, children }) => {
  const tabItems =
    tabs?.items.map((tab) => ({
      ...tab,
      className: clsx(styles.tab, tab.className),
    })) || []

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Heading title={title} subtitle={subtitle} className={styles.heading} />
        {!!tabs && (
          <div className={styles.switch}>
            <Tabs
              size="sm"
              {...tabs}
              items={tabItems}
              className={clsx(styles.tabs, tabs.className)}
            />
          </div>
        )}
        <div className={styles.tools}>{tools}</div>
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  )
}

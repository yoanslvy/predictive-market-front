import { FC, ReactNode } from 'react'

import Accordion from '../Accordion'
import Heading from '../Heading'
import { Step, StepProps } from '../Steps/Step'
import styles from './Overview.module.scss'

export type OverviewAccordionType = {
  title: ReactNode
  isOpen: boolean
  childrens: ReactNode[]
}

interface OverviewProps {
  title: string
  className: string
  step?: StepProps
  icon: ReactNode
  overviewAccordions?: OverviewAccordionType[]
}

export const Overview: FC<OverviewProps> = ({
  step,
  title,
  icon,
  overviewAccordions,
  className,
}) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.description}>
          <Heading size="md" title={title} />
          <Step className={styles.hideMobile} {...step} />
        </div>
        <div className={styles.iconContainer}>
          <div className={styles[className]}>{icon}</div>
        </div>
        <Step className={styles.showMobile} {...step} />
      </div>
      {overviewAccordions && <Accordion accordions={overviewAccordions} />}
    </>
  )
}

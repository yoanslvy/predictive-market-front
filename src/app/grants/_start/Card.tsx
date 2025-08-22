import clsx from 'clsx';

import Heading from "@/src/components/modules/Heading";

import styles from './card.module.scss'
import { ReactNode } from 'react';

interface CardProps{
  title: string
  description: string
  icon?: ReactNode
  flow: 'row' | 'column'
}

export default async function Card({ title, description, icon, flow } : CardProps) {
  return (
    <div className={clsx(styles.card, styles[`flow-${flow}`])}>
      <div className={styles.heading}>
        <Heading size="md">{title}</Heading>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.icon}>
        {icon}
      </div>
    </div>
  )
}

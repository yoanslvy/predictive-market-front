'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Card from '@images/icons/grid_cards.svg'
import List from '@images/icons/grid_list.svg'
import Heading from '@/src/components/modules/Heading'
import clsx from 'clsx'

import styles from './ToggleView.module.scss'


export default function ToggleView({ title }: { title: string}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const onClick = (view: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("view", view);
    router.push(`${pathname}?${newParams.toString()}`)
  }

  const view = searchParams.get('view')

  return (
    <div className={styles.container}>
      <Heading title={title} />
      <div className={styles.toggle}>
        <div className={clsx(styles.item, (!view || view === 'card') ? styles.itemActive : undefined)} onClick={() => onClick('card')}><Card /></div>
        <div className={clsx(styles.item, view === 'table' ? styles.itemActive : undefined)} onClick={() => onClick('table')}><List /></div>
      </div>
    </div>
  )
}

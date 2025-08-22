'use client'

import { format, UrlObject } from 'url'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'

import IconCross from '@images/icons/cross.svg'
import IconPlus from '@images/icons/plus.svg'

import Button from '../Button'
import Heading from '../Heading'
import { TabProps, Tabs } from '../Tabs/Tabs'
import styles from './Toolkit.module.scss'

type ToolkitProps = {
  title?: ReactNode
  tabs?: TabProps[]
  tabValue?: string
  className?: string
  isOpen?: boolean
  children?: ReactNode | ReactNode[]
  openTo?: string | UrlObject
}

export const Toolkit: FC<ToolkitProps> = ({
  title,
  tabs,
  tabValue,
  className,
  isOpen,
  openTo,
  children,
}) => {
  const [isCurrentOpen, setIsCurrentOpen] = useState(!!isOpen)

  const router = useRouter()

  useEffect(() => {
    setIsCurrentOpen(!!isOpen)
  }, [isOpen])

  const refModal = useRef<HTMLDivElement>(null)

  const handleClickOpen = () => {
    setIsCurrentOpen(true)
  }

  const handleClickClose = () => {
    setIsCurrentOpen(false)
  }

  const handleClickOutside = async (event: Event) => {
    if (
      !event.target ||
      !refModal.current ||
      !(refModal?.current as Node)?.contains(event.target as Node)
    ) {
      setIsCurrentOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <>
      <Button
        href={openTo}
        size="xxl"
        type="primary"
        isAccent
        icon={<IconPlus className={styles.openerIcon} />}
        className={clsx(styles.opener, { [styles.open]: isCurrentOpen })}
        onClick={handleClickOpen}
      />

      <div className={clsx(styles.container, { [styles.open]: isCurrentOpen }, className)}>
        <div className={clsx(styles.modal, className)} ref={refModal}>
          <Button
            size="xs"
            icon={<IconCross className={styles.closeIcon} />}
            className={styles.close}
            onClick={handleClickClose}
          />
          {(!!title || !!tabs) && (
            <div className={styles.header}>
              {!!title && <Heading size="md">{title}</Heading>}
              {!!tabs && <Tabs type="switch" size="sm" value={tabValue || ''} items={tabs} />}
            </div>
          )}
          <div className={styles.body}>
            <div className={styles.content}>{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}

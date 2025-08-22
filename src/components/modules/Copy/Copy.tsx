'use client'

import { toast } from 'react-toastify'

import { FC, MouseEventHandler } from 'react'

import clsx from 'clsx'

import IconCopy from '@images/icons/copy.svg'

import Button from '../Button'
import { ButtonProps } from '../Button/Button'
import styles from './Copy.module.scss'

type CopyProps = Omit<ButtonProps, 'icon'> & { text: string }

export const Copy: FC<CopyProps> = ({ className, text, ...props }) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Copied to Clipboard!', {
          toastId: 'clipboard-toast',
        })
      })
      .catch(() => {
        toast.error('Text copy failed!', {
          toastId: 'clipboard-toast',
        })
      })
    props.onClick?.(e)
  }

  return (
    <Button
      {...props}
      icon={<IconCopy className={styles.icon} />}
      className={clsx(styles.button, className)}
      onClick={handleClick}
    />
  )
}

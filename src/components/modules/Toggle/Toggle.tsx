'use client'

import { ChangeEventHandler, FC, HTMLProps, ReactNode, useState } from 'react'

import clsx from 'clsx'

import Heading from '../Heading'
import styles from './Toggle.module.scss'

type ToggleProps = {
  className?: string
  value?: boolean | (boolean & readonly string[])
  defaultValue?: boolean
  caption?: ReactNode
  description?: ReactNode
  tooltip?: string
  onValueChange?: (value: boolean) => void
} & HTMLProps<HTMLInputElement>

export const Toggle: FC<ToggleProps> = ({
  className,
  value,
  defaultValue,
  caption,
  description,
  tooltip,
  onChange,
  onValueChange,
  ...props
}) => {
  // Remove the internal state
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange?.(e)
    onValueChange?.(!!e.target.checked)
  }

  const content = (
    <input
      {...props}
      checked={!!value || !!defaultValue} // Use value prop directly
      onChange={handleChange}
      type="checkbox"
      className={clsx(styles.toggle, { [className || '']: !!caption })}
    />
  )

  if (!caption) {
    return content
  }

  return (
    <label className={clsx(styles.container, className)}>
      <Heading size="sm" className={styles.header} tooltip={tooltip}>
        {caption}
      </Heading>
      <span className={styles.body}>{content}</span>
      {!!description && <span className={styles.footer}>{description}</span>}
    </label>
  )
}

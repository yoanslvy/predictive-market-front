import { UrlObject } from 'url'
import { cn } from '@cn'
import Link from 'next/link'
import React, { AnchorHTMLAttributes, forwardRef, ReactNode, Ref } from 'react'

import styles from './Button.module.scss'

export type ButtonSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type ButtonType = 'default' | 'primary' | 'secondary' | 'tertiary' | 'link' | 'action'

type ButtonCommonProps = {
  caption?: ReactNode
  icon?: ReactNode
  indicator?: ReactNode
  counter?: string
  className?: string
  isActive?: boolean
  isDisabled?: boolean
  disabled?: boolean
  scroll?: boolean
  isPending?: boolean
  isHidden?: boolean
  prefetch?: boolean
  size?: ButtonSize
  type?: ButtonType
  buttonType?: 'button' | 'submit' | 'reset'
  isAccent?: boolean
  activators?: string[]
  href?: string | UrlObject
  block?: boolean
}

export type ButtonProps = Omit<React.HTMLProps<HTMLAnchorElement>, 'href' | 'size' | 'ref'> &
  ButtonCommonProps

export const Button = forwardRef(function Button(
  {
    caption,
    icon,
    indicator,
    counter,
    className,
    isActive,
    isDisabled,
    prefetch,
    disabled,
    scroll,
    isHidden,
    isPending,
    activators,
    href,
    children,
    type = 'default',
    size = 'md',
    buttonType = 'button',
    isAccent,
    block,
    ...rest
  }: ButtonProps,
  ref
) {
  const classProp = cn(
    styles.container,
    {
      [styles[type]]: !!type,
      [styles[size]]: !!type,
      [styles.accent]: isAccent,
      [styles.active]: isActive,
      [styles.disabled]: isDisabled || isPending,
      [styles.pending]: isPending,
      [styles.hidden]: isHidden,
      [styles.block]: block,
    },
    className
  )

  const content = (
    <>
      {!!icon && <span className={styles.icon}>{icon}</span>}
      {(caption || children) && <span className={styles.caption}>{caption || children}</span>}
      {!!indicator && <span className={styles.indicator}>{indicator}</span>}
      {!!counter && <span className={styles.counter}>{counter}</span>}
    </>
  )

  const props = {
    className: classProp,
    hidden: isHidden,

    ...rest,
  }

  if (href) {
    return (
      <Link prefetch={prefetch} scroll={scroll} {...props} href={href} ref={ref as Ref<HTMLAnchorElement>}>
        {content}
      </Link>
    )
  }

  return React.createElement(
    'button',
    {
      ...props,
      disabled: isDisabled || isPending,
      type: buttonType,
      ref: ref as Ref<HTMLButtonElement>,
    },
    content
  )
})

'use client'

import { Button, type ButtonProps } from '@mantine/core'
import Link from 'next/link'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

import CustomBtn from '@/src/components/modules/Button'
import { cn } from '@/src/src/utils'

type ButtonVariant = 'default' | 'green' | 'transparent' | 'white' | 'red' | 'gray'

type CombinedButtonProps = {
  variant?: ButtonVariant
  as?: 'button' | 'link'
  href?: string
  icon?: ReactNode
  label?: string
  children?: ReactNode
  buttonType?: HTMLButtonElement['type']
  className?: string
  target?: HTMLAnchorElement['target']
  isPending?: boolean
  isDisabled?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<ButtonProps, 'variant'>

export function Btn(props: CombinedButtonProps) {
  const {
    className,
    as = 'button',
    variant = 'default',
    icon,
    label,
    children,
    href,
    disabled,
    loading,
    ...rest
  } = props

  const isDisabled = disabled || rest.isDisabled
  const isPending = loading || rest.isPending

  if (variant === 'green' && children) {
    return (
      <CustomBtn
        // @ts-ignore
        type="primary"
        // @ts-ignore
        size="md"
        isAccent
        icon={icon}
        href={href}
        isDisabled={isDisabled}
        isPending={isPending}
        {...rest}>
        {children}
      </CustomBtn>
    )
  }

  if (variant === 'green' && label) {
    return (
      <CustomBtn
        // @ts-ignore
        type="primary"
        // @ts-ignore
        size="md"
        isAccent
        icon={icon}
        label={label}
        href={href}
        isDisabled={isDisabled}
        isPending={isPending}
        {...rest}
      />
    )
  }

  const content = children ?? label

  const classNames = {
    transparent: {
      className: cn(
        'flex transition-all h-[48px] w-[115px] items-center justify-center gap-x-[0.5rem] rounded-full border border-[#2C2F3A] bg-transparent px-[16px] py-[12px] text-[16px] hover:bg-transparent',
        className
      ),
    },
    green: {
      className: cn(
        'flex transition-all h-[48px] items-center justify-center gap-x-[0.5rem] rounded-3xl bg-gradient-to-t from-[#00C54F] to-[#8CFF75] px-[16px] sm:px-[48px] py-[12px] text-[16px] text-[#131416] hover:shadow-[0_0_38px_0] hover:shadow-[color:var(--color-shadow)] ease-in-out transition-all duration-200 whitespace-nowrap',
        className
      ),
    },
    default: {
      className: cn('transition-all', className),
    },
    white: {
      className: cn(
        'h-[48px] transition-all items-center justify-center gap-x-[0.5rem] w-[240px] rounded-full bg-white text-black hover:bg-white/90 hover:text-black disabled:bg-[#F0F2FB0A] disabled:text-[#FFFFFF1F]',
        className
      ),
    },
    red: {
      className: cn(
        'h-[48px] transition-all w-[240px] rounded-full bg-red-500 text-white hover:bg-red-500/90 hover:text-white',
        className
      ),
    },
    gray: {
      className: cn(
        'flex transition-all h-[48px] w-full items-center justify-center gap-x-[16px] gap-y-[12px] rounded-full bg-[#757A8B33] hover:bg-[#757A8B53] disabled:bg-[#F0F2FB0A] disabled:text-[#FFFFFF1F]',
        className
      ),
    },
  } as const

  if (as === 'link' && href) {
    return (
      <Link href={href} passHref target={rest.target} {...classNames[variant]}>
        {icon && <span className="mr-2">{icon}</span>}
        {content}
      </Link>
    )
  }

  return (
    <Button {...rest} {...classNames[variant]} disabled={isDisabled} loading={isPending}>
      {icon && <span className="mr-2">{icon}</span>}
      {content}
    </Button>
  )
}

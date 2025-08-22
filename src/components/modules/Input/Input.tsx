'use client'

import { ChangeEventHandler, FC, InputHTMLAttributes, ReactNode, useEffect, useState } from 'react'

import { clsx } from 'clsx'

import Button from '@modules/Button'

import IconClear from '@images/icons/cross.svg'

import Heading from '../Heading'
import styles from './Input.module.scss'

type InputSize = 'sm' | 'md' | 'lg' | 'xl'

export type InputType = 'number' | 'text'

type InputProps = {
  className?: string
  classNameHeader?: string
  type?: InputType
  size?: InputSize
  isPending?: boolean
  isDisabled?: boolean
  title?: ReactNode
  name?: string

  onValueChange?: (value: string) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'title'>

export const Input: FC<InputProps> = ({
  className,
  classNameHeader,
  type = 'text',
  onChange,
  onValueChange,
  value,
  defaultValue,
  size = 'md',
  pattern,
  isPending,
  isDisabled,
  title,
  name,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState<string>(`${value || defaultValue || ''}`)

  useEffect(() => {
    if (currentValue === value) {
      return
    }

    setCurrentValue(`${value || ''}`)
  }, [value])

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newVal = e.target.value

    if (type === 'number') {
      if (!newVal) {
        setCurrentValue('')
        onValueChange?.('0')
        return
      }

      const match = `0${newVal}`.match(/^\d{1,}(\.\d{0,})?$/)

      if (!match) {
        return
      }

      const numberVal = parseFloat(newVal)
      const clearedVal = newVal.replace(/^0+/, '0')

      setCurrentValue(`${isNaN(numberVal) ? '0' : ''}${clearedVal}`)
      onValueChange?.(clearedVal)
    }

    if (pattern) {
      const patternRegExp = new RegExp(pattern)
      const match = `${newVal}`.match(patternRegExp)

      if (!match) {
        return
      }
    }

    if (type === 'text') {
      setCurrentValue(newVal)
      onValueChange?.(newVal)
    }

    onChange?.(e)
  }

  const handleInputClear = () => {
    setCurrentValue('')
    onValueChange?.('')
  }

  const isDisabledCalc = isDisabled || rest.disabled

  return (
    <label
      className={clsx(
        styles.container,
        styles[size],
        { [styles.pending]: isPending, [styles.disabled]: isDisabledCalc },
        className
      )}>
      {!!title && (
        <div className={clsx(styles.header, classNameHeader)}>
          <Heading className={styles.title} size="xxs">
            {title}
          </Heading>
        </div>
      )}
      <div className={styles.body}>
        <input
          className={clsx(styles.input, { [styles.disabled]: isDisabledCalc })}
          value={currentValue}
          type="text"
          onChange={handleInputChange}
          pattern={pattern}
          inputMode={type === 'number' ? 'numeric' : undefined}
          disabled={isDisabledCalc}
          name={name}
          {...rest}
        />
        <Button
          type="link"
          icon={<IconClear />}
          className={clsx(styles.clear, {
            [styles.active]: !!currentValue.length,
          })}
          onClick={handleInputClear}
          size="xxs"
        />
      </div>
    </label>
  )
}

import { ChangeEventHandler, FC, ReactNode, useEffect, useState } from 'react'

import clsx from 'clsx'

import { isAddress } from 'viem'

import { Button, ButtonProps } from '../Button/Button'
import Input from '../Input'
import { InputType } from '../Input/Input'
import styles from './Display.module.scss'

type DisplayProps = {
  className?: string
  header?: ReactNode | ReactNode[]
  footer?: ReactNode | ReactNode[]
  presets?: ButtonProps[]
  title?: ReactNode
  type?: InputType | 'address'
  defaultValue?: string
  value?: string
  max?: string
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onValueChange?: (value: string) => void
  unit?: ReactNode
  name?: string
}

export const Display: FC<DisplayProps> = ({
  title,
  className,
  header,
  footer,
  type = 'number',
  onChange,
  onValueChange,
  defaultValue,
  placeholder,
  value,
  max,
  unit,
  presets,
  name,
}) => {
  const [currentValue, setCurrentValue] = useState<string>(value || defaultValue || '')

  useEffect(() => {
    if (currentValue === value) return
    const newVal = `${value || ''}`
    setCurrentValue(newVal)
  }, [value])

  const handleClickMax = () => {
    if (currentValue === max) return
    const newVal = `${max || ''}`
    setCurrentValue(newVal)
  }

  useEffect(() => {
    onValueChange?.(currentValue)
  }, [currentValue])

  const sanitizeValue = (inputValue: string) => {
    if (type === 'address') {
      // For addresses, just remove spaces and keep hex characters
      return inputValue.replace(/[^0-9a-fA-Fx]/g, '')
    } else if (type === 'number') {
      // For numbers, handle decimals and minus signs
      const sanitizedValue = inputValue.replace(/[^0-9.-]/g, '')
      const parts = sanitizedValue.split('.')
      const formattedValue =
        parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : sanitizedValue
      const minusParts = formattedValue.split('-')
      return minusParts.length > 2 ? `-${minusParts[1]}` : formattedValue
    }
    return inputValue
  }

  return (
    <div className={clsx(styles.container, className)}>
      {!!(header || title) && (
        <div className={styles.header}>
          {!!title && <div className={styles.title}>{title}</div>}
          {header}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.input}>
          <Input
            value={currentValue}
            className={styles.control}
            onInput={onChange}
            onValueChange={(value) => {
              const sanitizedValue = sanitizeValue(value)
              setCurrentValue(sanitizedValue)
            }}
            placeholder={
              placeholder || (type === 'number' ? '0' : type === 'address' ? '0x...' : '')
            }
            type={type === 'address' ? 'text' : type}
            name={name}
          />
          <div className={styles.unitGroup}>
            {!!max && (
              <Button
                caption="MAX"
                size="md"
                type="link"
                className={styles.max}
                onClick={handleClickMax}
              />
            )}
            {unit && <div className={styles.unit}>{unit}</div>}
          </div>
        </div>

        {!!presets && (
          <div className={styles.presets}>
            {presets.map((preset, idx) => (
              <Button key={idx} {...preset} size="xxs" className={styles.preset} name={name} />
            ))}
          </div>
        )}
      </div>

      {!!footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}

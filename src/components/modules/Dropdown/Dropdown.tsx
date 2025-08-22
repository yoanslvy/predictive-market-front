'use client'

import clsx from 'clsx'
import { FC, ReactNode, useEffect, useRef, useState } from 'react'

import IconDropdown from '@images/icons/chevronD.svg'

import Button from '../Button'
import { ButtonProps, ButtonSize, ButtonType } from '../Button/Button'
import Input from '../Input'
import styles from './Dropdown.module.scss'
import DropdownContent, { DropdownContentProps } from './DropdownContent'

export type DropdownButtonProps = {
  type?: ButtonType
  size?: ButtonSize
  caption?: ReactNode
  prefetch?: boolean
  icon?: ReactNode
  className?: string
  isDisabled?: boolean
}

export type DropdownProps = DropdownButtonProps &
  Omit<DropdownContentProps, 'toggle'> & { dropdownClassName?: string } & {
    items?: ButtonProps[]
    onSearch?: (value: string) => void
    isPending?: boolean
  }

const Dropdown: FC<DropdownProps> = ({
  type,
  size,
  icon,
  caption,
  prefetch,
  className,
  isOpen = false,
  onClose,
  onOpen,
  content,
  children,
  isDisabled,

  items,
  onSearch,
  isPending,

  ...contentProps
}) => {
  const [isCurrentOpen, setIsCurrentOpen] = useState<boolean>(isOpen)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsCurrentOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    isCurrentOpen && onOpen?.()
    !isCurrentOpen && onClose?.()
  }, [isCurrentOpen, onOpen, onClose])

  const handleClick = () => {
    setIsCurrentOpen(!isCurrentOpen)
  }
  const handleOpen = () => {
    setIsCurrentOpen(true)
  }
  const handleClose = () => {
    setIsCurrentOpen(false)
  }

  return (
    <>
      <Button
        size={size}
        type={type}
        icon={icon}
        indicator={
          <IconDropdown
            className={clsx(styles.indicator, {
              [styles.indicatorOpen]: isCurrentOpen,
            })}
          />
        }
        isDisabled={isDisabled}
        caption={caption}
        className={clsx(styles.button, { [styles.active]: isCurrentOpen }, className)}
        onClick={handleClick}
        ref={ref}
      />

      {isCurrentOpen && (
        <DropdownContent
          {...contentProps}
          className={contentProps.dropdownClassName}
          toggle={ref.current}
          isOpen={isCurrentOpen}
          onOpen={handleOpen}
          onClose={handleClose}>
          <nav className={styles.dropdownContent}>
            {!!onSearch && (
              <Input
                placeholder="Search"
                size="sm"
                onValueChange={onSearch}
                autoFocus
                className={styles.filter}
                isPending={!!isPending}
              />
            )}

            <ul className={styles.list}>
              {items?.map((item, idx) => {
                return (
                  <li className={styles.item} key={idx}>
                    <Button
                      prefetch={prefetch}
                      size={size}
                      {...item}
                      onClick={(e) => {
                        item.onClick?.(e)
                        handleClose()
                      }}
                      type="link"
                      className={clsx(styles.link, item.className)}
                    />
                  </li>
                )
              })}
            </ul>
          </nav>

          {content || children}
        </DropdownContent>
      )}
    </>
  )
}

export default Dropdown

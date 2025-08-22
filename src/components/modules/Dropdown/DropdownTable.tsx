'use client'

import { FC, Fragment, ReactNode, useEffect, useRef, useState } from 'react'

import clsx from 'clsx'

import IconDropdown from '@images/icons/chevronD.svg'

import Button from '../Button'
import { ButtonProps, ButtonSize, ButtonType } from '../Button/Button'
import Input from '../Input'
import styles from './Dropdown.module.scss'
import DropdownContent, { DropdownContentProps } from './DropdownContent'

export interface TokenSearch {
  caption: string
  address: string
  icon: ReactNode
}

export type DropdownButtonProps = {
  type?: ButtonType
  size?: ButtonSize
  caption?: ReactNode
  prefetch?: boolean
  icon?: ReactNode
  className?: string
  isDisabled?: boolean
  defaultTokens1: TokenSearch[]
  tokens: { title: string; tokens: TokenSearch[] }[]
  onClick: (token: TokenSearch) => void
}

export type DropdownProps = DropdownButtonProps &
  Omit<DropdownContentProps, 'toggle'> & { dropdownClassName?: string } & {
    items?: ButtonProps[]
    onSearch?: (value: string) => void
    isPending?: boolean
    isGlued: boolean
  }

const DropdownTable: FC<DropdownProps> = ({
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
  defaultTokens1,
  tokens,
  items,
  onSearch,
  isPending,
  onClick,
  isGlued,
  ...contentProps
}) => {
  const [isCurrentOpen, setIsCurrentOpen] = useState<boolean>(isOpen)
  const [selectedToken, setSelectedToken] = useState<TokenSearch | null>(null)
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

  const handleTokenSelect = (token: TokenSearch) => {
    setSelectedToken(token)
    onClick?.(token)
    handleClose()
  }

  const renderButtonCaption = () => {
    if (selectedToken) {
      return (
        <div className="flex items-center gap-2 ">
          {selectedToken.icon}
          <span>{selectedToken.caption}</span>
          <span className="text-gray-500">({selectedToken.address})</span>
        </div>
      )
    }
    return caption
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
        caption={renderButtonCaption()}
        className={clsx(
          styles.button,
          { [styles.active]: isCurrentOpen },
          { [styles.glue]: isCurrentOpen && isGlued },
          className
        )}
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
          onClose={handleClose}
          isGlued={isGlued}>
          <nav className={clsx(styles.dropdownContent, { [styles.gluebb]: isGlued })}>
            <Input
              placeholder="Search name"
              className={styles.searchTokens}
              onValueChange={onSearch}
            />
            <ul className={styles.toggleTokens}>
              {defaultTokens1?.map((token: TokenSearch, idx: number) => (
                <li
                  className={styles.toggleTokensItem}
                  key={idx}
                  onClick={() => handleTokenSelect(token)}>
                  <span>
                    {token.icon} {token.caption}
                  </span>
                </li>
              ))}
            </ul>

            {tokens.map(({ title, tokens }, index) => (
              <Fragment key={index}>
                <div className={styles.labelTokens}>{title}</div>
                <ul>
                  {tokens.map((token: TokenSearch, index: number) => (
                    <li
                      className={styles.rowTokens}
                      key={index}
                      onClick={() => handleTokenSelect(token)}>
                      {token.icon}
                      <span>{token.caption}</span>
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))}
            {content || children}
          </nav>
        </DropdownContent>
      )}
    </>
  )
}

export default DropdownTable

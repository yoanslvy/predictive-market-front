// import { getRootElement } from '@cn'
'use client'

import clsx from 'clsx'
import { CSSProperties, FC, ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDimensionsRef } from 'rooks'


import styles from './Dropdown.module.scss'

export type DropdownContentProps = {
  toggle: HTMLElement | null
  className?: string
  isOpen?: boolean
  content?: ReactNode | ReactNode[]
  children?: ReactNode | ReactNode[]
  onOpen?: () => void
  onClose?: () => void
  isRight?: boolean
  isGlued?: boolean
}


// export function getRootElement() {
//   if (typeof window !== "undefined") {
//     return document?.getElementById('page') || document?.body || null
//   }
// }

const DropdownContent: FC<DropdownContentProps> = ({
  toggle,
  className,
  children,
  content,
  isOpen = false,
  onOpen,
  onClose,
  isRight,
  isGlued
}) => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);



  const [isCurrentOpen, setIsCurrentOpen] = useState<boolean>(isOpen)
  const [refDropdown, rectDropdown, dropdown] = useDimensionsRef()

  const [isDropdownUp, setIsDropdownUp] = useState(false)
  const [dropdownCoord, setDropdownCoord] = useState<{
    top?: number
    left?: number
    right?: number
    bottom?: number
  } | null>(null)

  useEffect(() => {
    setIsCurrentOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    onOpen && isCurrentOpen && onOpen()
    onClose && !isCurrentOpen && onClose()
  }, [isCurrentOpen, onOpen, onClose])

  useEffect(() => {
    if (!dropdown || !isCurrentOpen) {
      return
    }

    dropdown?.focus()
  }, [isCurrentOpen, dropdown])

  useEffect(() => {
    if (!toggle || !rectDropdown) {
      setDropdownCoord(null)
    }

    const rectButton = toggle?.getBoundingClientRect()

    const isTopLimit = (rectButton?.bottom || 0) + (rectDropdown?.height || 0) > window.innerHeight

    setIsDropdownUp(isTopLimit)

    setDropdownCoord({
      left: isRight ? (rectButton?.right || 0) - (rectDropdown?.width || 0) : rectButton?.left,
      top: !isTopLimit ? rectButton?.bottom : undefined,
      bottom: isTopLimit ? window.innerHeight - (rectButton?.top || 0) : undefined,
    })
  }, [rectDropdown, toggle, isRight])

  const handleClick = (event: Event): void => {
    const targetElement = event.target as Element
    if (!event.target || !(toggle?.contains(targetElement) || dropdown?.contains(targetElement))) {
      setIsCurrentOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)

    return (): void => {
      document.removeEventListener('mousedown', handleClick)
    }
  })

  if (!isCurrentOpen || !dropdownCoord || !(content || children)) {
    return null
  }

  return mounted ? createPortal(
    <div
      tabIndex={-1}
      ref={refDropdown}
      className={clsx(
        styles.dropdown,
        className,
        { [styles.up]: isDropdownUp },
        { [styles.down]: !isDropdownUp }
      )}
      style={
        {
          '--coord-left': dropdownCoord?.left ? `${dropdownCoord?.left}px` : undefined,
          '--coord-top': dropdownCoord?.top ? `${dropdownCoord?.top}px` : undefined,
          '--coord-bottom': dropdownCoord?.bottom ? `${dropdownCoord?.bottom}px` : undefined,
          minWidth: toggle?.getBoundingClientRect()?.width || undefined,
          marginTop: dropdownCoord?.top && isGlued ? '-40px' : undefined
        } as CSSProperties
      }>
      {children || content}
    </div>,
    document.body
  ) : null
}

export default DropdownContent

'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Modal.module.scss'
import IconClear from '@images/icons/cross.svg'

interface ModalProps {
  modalContent: React.ReactNode
  classContent?: string
  classOverlay?: string
  closeIcon?: boolean
}

export function Modal({ modalContent, classContent, classOverlay, closeIcon = true }: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const onDismiss = useCallback(() => {
    router.back()
  }, [router])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onDismiss()
  }, [onDismiss])

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
    document.addEventListener('keydown', onKeyDown)
    
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.removeEventListener('keydown', onKeyDown)
      setMounted(false)
    }
  }, [onKeyDown])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.back()
    }
  }

  if (!mounted) return null

  return createPortal(
    <div 
      className={`${styles.modalOverlay} ${classOverlay}`}
      onClick={handleOverlayClick}
      style={{ overscrollBehavior: 'contain' }}
    >
      <div 
        className={`${styles.modal} modal-content ${classContent}`}
        style={{ 
          overscrollBehavior: 'contain',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {closeIcon && (
          <div className={styles.closeIcon} onClick={() => router.back()}>
            {/* <IconClear /> */}
          </div>
        )}
        {modalContent}
      </div>
    </div>,
    document.body
  )
}

"use client";

import React, { useCallback, useRef, useEffect, ReactNode } from "react";

import styles from './Modal.module.scss'

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import IconClear from '@images/icons/cross.svg'

import clsx from "clsx";

export function Modal(props: {
  modalContent: ReactNode
  classContent?: string
  classOverlay?: string
  closeIcon?: boolean
}) {
  const { closeIcon = true } = props

  const overlay = React.useRef<HTMLInputElement>(null)
  const wrapper = React.useRef<HTMLInputElement>(null)
  const router = useRouter();
  const pathname = usePathname()

  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const isOpenModal = searchParams.get('modal')



  const onDismiss = useCallback(() => {
    let searchParamValues = Object.fromEntries(searchParams.entries())
    delete searchParamValues['modal'];

    const remainingEntries = Object.entries(searchParamValues);

    const queryString = remainingEntries.map(([key, value]) => `${key}=${value}`).join('&')
    router.replace(`${pathname}?${queryString}`);
  }, [router]);

  const onClick = useCallback(
    (e: any) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: any) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    if (!!isOpenModal) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpenModal])

  if (!isOpenModal) {
    return null
  }

  return (
    <div
      ref={overlay}
      className={clsx(styles.modalOverlay, props.classOverlay)}
      onClick={onClick}
    >
      <div ref={wrapper} className={clsx(styles.modal, props.classContent, 'modal')}>
        {closeIcon && (
          <div className={styles.closeIcon} onClick={onDismiss}>
            <IconClear />
          </div>
        )}
        {props.modalContent}
      </div>
    </div>
  );
}
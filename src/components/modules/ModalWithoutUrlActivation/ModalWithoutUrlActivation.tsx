import React, { ReactNode } from 'react';
import IconClear from '@images/icons/cross.svg';
import styles from './ModalWithoutUrlActivation.module.scss';
import clsx from "clsx";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  modalContent: ReactNode;
  classContent?: string;
  classOverlay?: string;
  closeIcon?: boolean;
}

export function ModalWithoutUrlActivation({
  visible,
  onClose,
  modalContent,
  classContent,
  classOverlay,
  closeIcon = false
}: ModalProps) {
  if (!visible) return null;

  return (
    <div
      className={clsx(styles.modalOverlay, classOverlay)}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={clsx(styles.modal, classContent, 'modal')} onClick={(e) => e.stopPropagation()}>
        {closeIcon && (
          <div className={styles.closeIcon} onClick={onClose}>
            <IconClear />
          </div>
        )}
        {modalContent}
      </div>
    </div>
  );
}

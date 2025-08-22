'use client'

import Link from 'next/link'

import { useCallback, useRef } from 'react'

import clsx from 'clsx'

import Button from '@/src/components/modules/Button'
import Card from '@/src/components/modules/Card'
import Value from '@/src/components/modules/Value'
// const title: Record<WalletStatus, string | undefined> = {
//   'Success': 'Success',
//   'Error': 'Something terrible happened!',
//   'LockConfirmationDisplay': undefined,
//   'AwaitingSignature': 'Awaiting Confirmation',
//   'AwaitingConfirmation': 'Submitting for confirmation',
// };
import { WalletStatus } from '@/src/stores/lockers-v2/useLockFormStore'

import LogoSpinner from '../../spinners/logoSpinnerAnimated'
import styles from './ModalMessage.module.scss'
import ModalMessageIcon from './ModalMessageIcon'

interface ModalMessageProps {
  status: WalletStatus
  details?: string
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
}

export function ModalMessage({
  status,
  title,
  description,
  details,
  buttonText,
  onButtonClick,
}: ModalMessageProps) {
  return (
    <Card>
      <div className={clsx(styles.container, styles[status.toLowerCase()])}>
        <ModalMessageIcon status={status} />

        <Value value={title} />
        {details && <div className={styles.details}>{details}</div>}
        <div className={styles.actionMessage}>{description}</div>
        {status === WalletStatus.Success ? (
          <>
            <Button
              caption={buttonText ? buttonText : `Close`}
              size="md"
              type="tertiary"
              block={true}
              onClick={onButtonClick}
            />
            <div className="">
              Want your project featured on
              <Link
                className="underline text-green-500 ml-1"
                target="_blank"
                href={'https://www.xtrend.wtf'}>
                X Trending 🔥
              </Link>
              ?
            </div>
            <Button
              caption={`Contact Sales`}
              size="md"
              target="_blank"
              href={'https://t.me/+ssD88kLddNA1YjA8'}
              type="action"
              block={true}
              onClick={onButtonClick}
            />
          </>
        ) : (
          status === WalletStatus.Error && (
            <>
              <Button
                caption={buttonText ? buttonText : `Close`}
                size="md"
                type="tertiary"
                block={true}
                onClick={onButtonClick}
              />
            </>
          )
        )}
      </div>
    </Card>
  )
}

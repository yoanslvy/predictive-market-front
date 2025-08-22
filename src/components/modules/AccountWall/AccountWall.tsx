'use client'

import { useDidMount } from 'rooks'

import { FC, ReactNode, useEffect, useState } from 'react'

import { clsx } from 'clsx'

import { useAccount } from 'wagmi'

import ImageAvatar from '@images/uncx/avatar.svg'

import ConnectButton from '../ConnectButton'
import WalletButton from '../WalletButton'
import styles from './AccountWall.module.scss'

type AccountWallProps = {
  className?: string
  title?: ReactNode
  children?: ReactNode | ReactNode[]
}

export const AccountWall: FC<AccountWallProps> = ({
  className,
  title = 'Connect your wallet to continue',
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<string | undefined>()

  const { address } = useAccount()

  useDidMount(() => {
    setIsMounted(true)
  })

  useEffect(() => {
    setCurrentAddress(address)
  }, [address])

  if (!isMounted) {
    return null
  }

  if (currentAddress) {
    return children
  }

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        <ImageAvatar className={styles.image} />
        <strong className={styles.title}>{title}</strong>
      </div>

      <WalletButton />
    </div>
  )
}

export default AccountWall

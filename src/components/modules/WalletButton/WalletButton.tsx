'use client'

import { useAppKit } from '@reown/appkit/react'

import { FC, useEffect, useState } from 'react'

import clsx from 'clsx'

import { useAccount } from 'wagmi'

import IconWallet from '@images/icons/wallet.svg'

import { getShortAddress } from '@/src/src/utils'

import Avatar from '../Avatar'
import ChainAsset from '../ChainAsset'
import styles from './WalletButton.module.scss'

export type WalletButtonProps = {
  className?: string
}
const isSafe = process.env.NEXT_PUBLIC_IS_SAFE === 'true'

export const WalletButton: FC<WalletButtonProps> = ({ className }) => {
  const [currentAddress, setCurrentAddress] = useState<string | undefined>()

  const { address, chain } = useAccount()
  const web3modal = !isSafe ? useAppKit() : undefined

  useEffect(() => {
    setCurrentAddress(address)
  }, [address])

  const handleOpenClick = () => {
    !isSafe && web3modal && web3modal?.open()
  }

  const icon = currentAddress ? (
    <>
      <Avatar address={currentAddress} className={styles.image} />
      <ChainAsset id={chain?.id || 0} className={styles.network} size="xxs" />
    </>
  ) : (
    <IconWallet className={styles.image} />
  )
  const caption = currentAddress ? getShortAddress(currentAddress) : 'Connect'

  return !isSafe ? (
    <button
      className={clsx(
        styles.button,
        {
          [styles.noconnect]: !currentAddress,
          [styles.connect]: !!currentAddress,
        },
        className
      )}
      onClick={handleOpenClick}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.caption}>{caption}</span>
    </button>
  ) : (
    <></>
  )
}

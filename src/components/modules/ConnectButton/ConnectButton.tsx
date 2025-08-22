'use client'

import { useAppKit } from '@reown/appkit/react'

import { FC, MouseEventHandler, useEffect, useState } from 'react'

import { useAccount } from 'wagmi'

import Button from '../Button'
import { ButtonProps } from '../Button/Button'

export const ConnectButton: FC<
  ButtonProps & { captionConnected?: string; captionNotConnected?: string }
> = ({ captionConnected, captionNotConnected, ...props }) => {
  const [currentAddress, setCurrentAddress] = useState<string | undefined>()

  const isSafe = process.env.NEXT_PUBLIC_IS_SAFE === 'true'

  const { address } = useAccount()
  const web3modal = !isSafe ? useAppKit() : undefined

  useEffect(() => {
    setCurrentAddress(address)
  }, [address])

  const handleOpenClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    // open()
    web3modal?.open()
    props.onClick?.(e)
  }

  const caption = currentAddress
    ? captionConnected || props.caption || 'Connected'
    : captionNotConnected || props.caption || 'Connect'

  return isSafe ? <Button {...props} caption={caption} onClick={handleOpenClick} /> : <></>
}

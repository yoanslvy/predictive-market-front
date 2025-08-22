'use client'

import { FC, ReactNode, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

type AccountWallCorrectProps = {
  owner: string,
  pendingOwner?: string,
  children?: ReactNode | ReactNode[]
}

export const AccountWallCorrect: FC<AccountWallCorrectProps> = ({ owner, pendingOwner, children }) => {
  const [currentAddress, setCurrentAddress] = useState<string | undefined>()

  const { address } = useAccount()

  useEffect(() => {
    setCurrentAddress(address)
  }, [address])

  if (currentAddress !== owner && (pendingOwner && (pendingOwner !== currentAddress))) {
    return null
  }

  return children
}

'use client'

import { FC, ReactNode, useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

type AccountWallWrongProps = {
  owner: string,
  pendingOwner?: string,
  children?: ReactNode | ReactNode[]
}

export const AccountWallWrong: FC<AccountWallWrongProps> = ({ owner, pendingOwner, children }) => {
  const [currentAddress, setCurrentAddress] = useState<string | undefined>()

  const { address } = useAccount()

  useEffect(() => {
    setCurrentAddress(address)
  }, [address])

  if (currentAddress === owner || (pendingOwner && (currentAddress === pendingOwner))) {
    return null
  }

  return children
}

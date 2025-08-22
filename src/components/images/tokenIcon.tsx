'use client'

import Image from 'next/image'

import React, { useState, useEffect } from 'react'

import { getAddress } from 'viem'

import IconUnknown from '@images/emoji/hmm.svg'

interface ComponentProps {
  button?: string
  unknown: string
}

export default function TokenIcon({
  tokenAddress,
  chainId,
  classNames,
}: {
  tokenAddress: string
  chainId: string
  classNames?: ComponentProps
}) {
  const checkedAddress = getAddress(tokenAddress)

  const [imageSource, setImageSource] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    const checkSource = async () => {
      try {
        const response = await fetch(`/api/tokenIcon/${chainId}/${checkedAddress}`)

        if (!response.ok) {
          setError(true)
        } else {
          setError(false)

          const { url } = (await response.json()) as { url: string }
          console.log('url', url)
          setImageSource(url)
        }
      } catch {
        setError(true)
      }
    }

    void checkSource()
  }, [imageSource])

  if (error) {
    return <IconUnknown width={45} height={45} />
  }

  return (
    <Image
      className={classNames?.button}
      width={64}
      height={64}
      alt="Token Icon"
      src={imageSource}
      priority
    />
  )
}

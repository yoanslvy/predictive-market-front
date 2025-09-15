'use client'

import Link from 'next/link'

import Etherscan from '@/src/images/apps/etherscan.svg'

interface EtherscanLinkProps {
  address: string
  shortenedAddress: string
}

export default function EtherscanLink({ address, shortenedAddress }: EtherscanLinkProps) {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href={`https://sepolia.etherscan.io/address/${address}`}
      className="flex items-center gap-x-[0.5rem]"
      onClick={(e) => e.stopPropagation()}>
      <Etherscan className="size-[1.4em]" />
      <span className="text-[#F0F2FB] underline">{shortenedAddress}</span>
    </Link>
  )
}

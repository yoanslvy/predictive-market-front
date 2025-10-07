'use client'

import { Address, formatEther, Hex } from 'viem'

import { useAccount, useReadContract } from 'wagmi'

import { conditionalTokenAbi } from '@/src/app/contract/ConditionalToken'
import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'

const TOKEN_ADDRESS = '0x8bdC504dC3A05310059c1c67E0A2667309D27B93' as const
const singleManagerAddress = '0x0Ea58737FA363Fcd31e84DA2eCa54e55F0701309'

export default function YesTokenBalance({ grantId }: { grantId: string }) {
  const { address } = useAccount()

  const { data: tokenIds } = useReadContract({
    address: singleManagerAddress as Address,
    abi: simpleGrantManagerAbi,
    functionName: 'getGrantTokenIds',
    args: [grantId as Hex],
    query: { enabled: !!address && !!grantId },
  })

  const { data: balance } = useReadContract({
    address: TOKEN_ADDRESS as Address,
    abi: conditionalTokenAbi,
    functionName: 'balanceOf',
    args: [address!, tokenIds?.[0] as bigint],
    query: { enabled: !!address && !!tokenIds && !!tokenIds[0] },
  })

  return (
    <div className="flex items-center justify-between">
      <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
        YES TOKEN BALANCE
      </span>

      <div className="text-[#01EB5A] text-sm font-mono">{balance ? formatEther(balance) : '0'}</div>
    </div>
  )
}

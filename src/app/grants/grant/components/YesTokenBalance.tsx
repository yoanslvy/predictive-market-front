'use client'

import { Address, formatEther, Hex } from 'viem'

import { useAccount, useReadContract } from 'wagmi'

import { conditionalTokenAbi } from '@/src/app/contract/ConditionalToken'
import { simpleGrantManagerAbi } from '@/src/app/contract/SimpleGrantManager'

const TOKEN_ADDRESS = '0x8bdC504dC3A05310059c1c67E0A2667309D27B93' as const
const singleManagerAddress = '0x4F07b6daCcd6dF8D52efd32F22534304Cc0e1114'

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
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-2 h-2 bg-[#00e068] rounded-full mt-2"></div>
      <div>
        <span className="text-xs font-semibold text-[#00e068] uppercase tracking-wider">
          Your Yes Token Balance
        </span>
        <p className="text-base font-mono text-[#80838f] mt-1 break-all">
          {balance ? formatEther(balance) : '0'}
        </p>
      </div>
    </div>
  )
}

'use client'

import { getGrantBestAnswer } from '@/src/app/server/getAllGrants'

export default async function CurrentAnswer({ grantId }: { grantId: string }) {
  const answer = await getGrantBestAnswer(grantId)

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0 w-2 h-2 bg-[#00e068] rounded-full mt-2"></div>
      <div>
        <span className="text-xs font-semibold text-[#00e068] uppercase tracking-wider">
          Current Answer
        </span>
        <p className="text-base font-mono text-[#80838f] mt-1 break-all">{answer}</p>
      </div>
    </div>
  )
}

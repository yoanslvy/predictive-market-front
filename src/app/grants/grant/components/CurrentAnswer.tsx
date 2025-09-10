'use client'

import { getGrantBestAnswer } from '@/src/app/server/getAllGrants'

export default async function CurrentAnswer({ grantId }: { grantId: string }) {
  const answer = await getGrantBestAnswer(grantId)

  return <p className="text-sm mt-1 font-medium">Current Answer: {answer}</p>
}

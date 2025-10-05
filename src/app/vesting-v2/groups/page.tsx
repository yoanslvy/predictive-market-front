import * as z from 'zod'

import { Suspense } from 'react'

import { VestingGroupsServer } from '../_views/VestingGroupsServer'
import { IncorrectParams } from '../create/_steps/_components/IncorrectParams'
import { AuthWrapper } from './_components/AuthWrapper'

export const metadata = {
  title: 'Explore - UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const searchParamsSchema = z.object({
  wallet: z.string(),
  chain: z.coerce.number(),
})

export type Props = {
  searchParams: z.infer<typeof searchParamsSchema>
}

export default async function GroupsPage({ searchParams }: Props) {
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams)

  if (!parsedSearchParams.success) {
    return <IncorrectParams title="No groups" />
  }

  const { wallet, chain } = parsedSearchParams.data

  return (
    <Suspense fallback={null}>
      <AuthWrapper wallet={wallet}>
        <VestingGroupsServer wallet={wallet} chainId={chain} />
      </AuthWrapper>
    </Suspense>
  )
}

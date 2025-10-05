import { redirect } from 'next/navigation'
import * as z from 'zod'

import { Suspense } from 'react'

import { BoxWrapperWithCloseBtn } from '../../_components/BoxWrapperWithCloseBtn'
import { CreateGroup } from '../../_views/CreateGroup'
import { AuthWrapper } from '../_components/AuthWrapper'

const searchParamsSchema = z.object({
  wallet: z.string(),
  chain: z.coerce.number(),
})

export type Props = {
  searchParams: z.infer<typeof searchParamsSchema>
}

export default async function CreateGroupPage({ searchParams }: Props) {
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams)

  if (!parsedSearchParams.success) {
    redirect('/vesting-v2/groups')
  }

  const { wallet, chain } = parsedSearchParams.data

  return (
    <Suspense fallback={null}>
      <AuthWrapper wallet={wallet}>
        <BoxWrapperWithCloseBtn
          href={`/vesting-v2/dashboard/fluxes?wallet=${wallet}&chain=${chain}`}>
          <CreateGroup wallet={wallet} chainId={chain} />
        </BoxWrapperWithCloseBtn>
      </AuthWrapper>
    </Suspense>
  )
}

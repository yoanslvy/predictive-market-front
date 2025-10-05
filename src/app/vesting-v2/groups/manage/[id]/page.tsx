import * as z from 'zod'

import { Suspense } from 'react'

import { IncorrectParams } from '../../../create/_steps/_components/IncorrectParams'
import { AuthWrapper } from '../../_components/AuthWrapper'
import { ManageGroupServer } from './_components/ManageGroupServer'

const paramsSchema = z.object({
  id: z.string().uuid(),
})

const searchParamsSchema = z.object({
  wallet: z.string(),
  chain: z.coerce.number(),
})

export type Props = {
  params: z.infer<typeof paramsSchema>
  searchParams: z.infer<typeof searchParamsSchema>
}

export default async function ManageGroupIdPage({ params, searchParams }: Props) {
  const parsedParams = paramsSchema.safeParse(params)
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams)

  if (!parsedParams.success || !parsedSearchParams.success) {
    return (
      <IncorrectParams
        title="Group not found"
        subtitle="Please check the group ID and try again."
      />
    )
  }

  const { id } = parsedParams.data
  const { wallet, chain } = parsedSearchParams.data

  return (
    <Suspense fallback={null}>
      <AuthWrapper wallet={wallet}>
        <ManageGroupServer id={id} wallet={wallet} chainId={chain} />
      </AuthWrapper>
    </Suspense>
  )
}

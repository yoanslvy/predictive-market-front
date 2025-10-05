import { redirect } from 'next/navigation'
import * as z from 'zod'

import { vestingByIdCached } from '@/src/server/fetchers/vesting-v2/vestingById'

import { Flux } from '../../_views/Flux'

export const metadata = {
  title: 'Explore - UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const searchParamsSchema = z.object({
  wallet: z.string().optional(),
  chain: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
})

const paramsSchema = z.object({
  id: z.string().refine((e) => e.split('-').length === 2, 'Invalid id format'),
})

type Props = {
  searchParams: z.infer<typeof searchParamsSchema>
  params: z.infer<typeof paramsSchema>
}

export default async function FluxPage({ searchParams, params }: Props) {
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams)
  const parsedParams = paramsSchema.safeParse(params)
  if (!parsedSearchParams.success || !parsedParams.success) {
    redirect('/vesting')
  }
  const fluxDetails = await vestingByIdCached(parsedParams.data.id, 1)

  return (
    <Flux
      wallet={parsedSearchParams.data?.wallet}
      fluxData={fluxDetails}
      page={parsedSearchParams.data.page}
      chainId={parsedSearchParams.data.chain}
    />
  )
}

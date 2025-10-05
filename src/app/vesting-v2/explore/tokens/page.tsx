import 'server-only'
import * as z from 'zod'

import React from 'react'

import { IncorrectParams } from '../../create/_steps/_components/IncorrectParams'
import { ExploreHeaderClient } from '../_modules/ExploreHeaderClient'
import TokenTable from './_modules/tokenTable'

export const maxDuration = 300

export const metadata = {
  title: 'Explore - UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const searchParamsSchema = z.object({
  wallet: z.string().optional(),
  chain: z.coerce.number().optional(),
  filter: z.string().optional(),
  page: z.coerce.number().optional().default(1),
  chainFilter: z.coerce.number().optional(),
})

type Props = {
  searchParams: z.infer<typeof searchParamsSchema>
}

export default async function ExplorePage({ searchParams }: Props) {
  const parsedParams = searchParamsSchema.safeParse(searchParams)

  if (!parsedParams.success) {
    return <IncorrectParams />
  }

  const { chain, filter, page, chainFilter, wallet } = parsedParams.data
  return (
    <>
      <ExploreHeaderClient
        filter={filter}
        wallet={wallet}
        chainId={chain}
        chainFilter={chainFilter}
      />
      <TokenTable chain={chain} page={page} filter={filter} chainFilter={chainFilter} />
    </>
  )
}

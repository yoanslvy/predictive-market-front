import * as z from 'zod'

import { VestingDashboardView } from '../../_views/VestingDashboardView'
import { IncorrectParams } from '../../create/_steps/_components/IncorrectParams'

export const metadata = {
  title: 'Explore - UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const searchParamsSchema = z.object({
  wallet: z.string(),
  chain: z.coerce.number(),
  page: z.coerce.number().optional(),
  filter: z.string().optional(),
  direction: z.enum(['incoming', 'outgoing', 'all']).optional().default('all'),
  onlyClaimable: z
    .enum(['true', 'false'])
    .optional()
    .default('false')
    .transform((e) => e.toLowerCase() === 'true'),
  chainFilter: z.coerce.number().optional(),
})

type Props = {
  searchParams: z.infer<typeof searchParamsSchema>
}

export default async function AirdropPage({ searchParams }: Props) {
  const parsedParams = searchParamsSchema.safeParse(searchParams)

  if (!parsedParams.success) {
    return <IncorrectParams />
  }

  const { chain, wallet, filter, page, direction, onlyClaimable, chainFilter } = parsedParams.data

  return (
    <VestingDashboardView
      table="airdrops"
      chainId={chain}
      wallet={wallet}
      page={page}
      filter={filter}
      direction={direction}
      onlyClaimable={onlyClaimable}
      chainFilter={chainFilter}
    />
  )
}

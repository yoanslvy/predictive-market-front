import 'server-only'
import * as z from 'zod'

import { isAddress } from 'viem'

import { IncorrectParams } from '@/src/app/vesting-v2/create/_steps/_components/IncorrectParams'
import { tokenCached } from '@/src/server/fetchers/vesting-v2/token'
import { vestingsOfTokenPagedCached } from '@/src/server/fetchers/vesting-v2/vestingsOfTokenPaged'

import { TokenVestingView } from '../../../../../_views/TokenVestingView'

export const metadata = {
  title: 'Explore - UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const paramsSchema = z.object({
  chain: z.coerce.number(),
  token: z.string().refine((val) => isAddress(val), {
    message: 'Token address is required',
  }),
})

const searchParamsSchema = z.object({
  view: z.enum(['vesting', 'airdrop']).default('vesting'),
  wallet: z.string().optional(),
  page: z.coerce.number().default(1),
})

type Props = {
  params: z.infer<typeof paramsSchema>
  searchParams: z.infer<typeof searchParamsSchema>
}

export default async function TokenPage({ params, searchParams }: Props) {
  const parsedParams = paramsSchema.safeParse(params)
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams)

  if (!parsedParams.success || !parsedSearchParams.success) {
    return (
      <IncorrectParams
        title="Token not found"
        subtitle="Please check the token address and try again."
      />
    )
  }

  const { chain, token } = parsedParams.data
  const { view, wallet, page } = parsedSearchParams.data

  const vestedLockData = await vestingsOfTokenPagedCached(
    token.toLowerCase(),
    1000,
    1,
    view === 'vesting',
    60
  )

  let tokenSymbol = vestedLockData.vestingV2_vestings[0]?.tokenVested.symbol || ''

  if (!tokenSymbol) {
    const tokenQueryResp = await tokenCached(token.toLowerCase(), 60)
    tokenSymbol = tokenQueryResp.vestingV2_tokens[0].symbol || ''
  }

  return (
    <TokenVestingView
      token={token}
      chain={chain}
      vestingData={vestedLockData}
      view={view}
      wallet={wallet}
      page={page}
      tokenSymbol={tokenSymbol}
    />
  )
}

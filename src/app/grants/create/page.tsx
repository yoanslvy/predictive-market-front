import { z } from 'zod'

import { GrantForm } from './components/GrantForm'

export const metadata = {
  title: 'Explore - UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const searchParamsSchema = z.object({
  wallet: z.string(),
  chain: z.coerce.number(),
})

type Props = {
  searchParams: z.infer<typeof searchParamsSchema>
}

export default function VestingCreate({ searchParams }: Props) {
  return <GrantForm wallet={searchParams.wallet} chainId={searchParams.chain} />
}

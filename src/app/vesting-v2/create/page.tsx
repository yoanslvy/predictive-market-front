import * as z from 'zod'

import { vestingV2Contracts } from '@/src/interfaces/web3/vesting-v2/contracts'

import { BoxWrapperWithCloseBtn } from '../_components/BoxWrapperWithCloseBtn'
import { IncorrectParams } from './_steps/_components/IncorrectParams'
import { AirdropForm } from './_steps/airdrops/AirdropForm'
import { VestingForm } from './_steps/vesting/VestingForm'

export const metadata = {
  title: 'Explore - UNCX Network',
  description: 'Most advanced decentralized token and liquidity locker',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const searchParamsSchema = z.object({
  wallet: z.string(),
  chain: z.coerce.number(),
  eventType: z.union([z.literal('vesting'), z.literal('airdrop')]).default('vesting'),
})

type Props = {
  searchParams: z.infer<typeof searchParamsSchema>
}

export default function VestingCreate({ searchParams }: Props) {
  const parsedParams = searchParamsSchema.safeParse(searchParams)

  if (!parsedParams.success || !parsedParams.data.eventType) {
    return (
      <BoxWrapperWithCloseBtn href={`/vesting-v2/dashboard/fluxes`}>
        <div className="min-h-[20em] flex items-center justify-center">
          <IncorrectParams title="Chain not supported" />
        </div>
      </BoxWrapperWithCloseBtn>
    )
  }

  const { wallet, chain } = parsedParams.data

  const vestingContract: string | undefined =
    vestingV2Contracts[chain as keyof typeof vestingV2Contracts]

  if (!vestingContract) {
    return (
      <BoxWrapperWithCloseBtn href={`/vesting-v2/dashboard/fluxes?wallet=${wallet}&chain=${chain}`}>
        <div className="min-h-[20em] flex items-center justify-center">
          <IncorrectParams title="Chain not supported" />
        </div>
      </BoxWrapperWithCloseBtn>
    )
  }

  const forms = {
    vesting: <VestingForm wallet={wallet} chainId={chain} vestingContract={vestingContract} />,
    airdrop: <AirdropForm wallet={wallet} chainId={chain} vestingContract={vestingContract} />,
  } as const

  return (
    <BoxWrapperWithCloseBtn href={`/vesting-v2/dashboard/fluxes?wallet=${wallet}&chain=${chain}`}>
      {forms[parsedParams.data.eventType]}
    </BoxWrapperWithCloseBtn>
  )
}

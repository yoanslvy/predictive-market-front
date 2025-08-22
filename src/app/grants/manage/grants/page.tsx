import { Suspense } from 'react'

import { isAddress } from 'viem'

import { isChainIdSupported } from '@modules/ChainAsset/utils'

import { GrantForm } from '@/src/components/modules/GrantForm'

export const dynamic = 'force-dynamic'
export const revalidate = false
export const fetchCache = 'only-no-store'

export default async function LockersV2Layout({
  searchParams,
}: {
  searchParams: {
    service?: string
    chain?: string
    wallet?: string
    locker?: string
    pool?: string
    search?: string
    type?: string
    amm?: string
    token0?: string
    token1?: string
    view?: string
  }
}) {
  const isCorrectChain = isChainIdSupported(searchParams.chain || 0)
  const isCorrectAddress = isAddress(searchParams.wallet || '')
  const isCorrectParams = isCorrectChain && isCorrectAddress
  let key = `${searchParams.service || ''}${searchParams.chain || ''}${searchParams.wallet || ''}`

  return (
    <>
      <>
        {isCorrectParams && (
          <Suspense key={key}>
            <GrantForm />
          </Suspense>
        )}
      </>
    </>
  )
}

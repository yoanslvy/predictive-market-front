import { ErrorBoundary } from 'react-error-boundary'
import 'server-only'

import React, { Suspense } from 'react'

import TokenTableServer from './data'
import TokenTableError from './error'
import TokenTableLoading from './loading'

const entriesPerPage = 25

export default async function TokenTable({
  chain,
  filter,
  page,
  chainFilter,
}: {
  page: number
  filter?: string
  chain?: number
  chainFilter?: number
}) {
  const suspenseRenderKey = [
    chain?.toString() ?? 'all',
    filter ?? 'all',
    page?.toString() ?? '1',
    chainFilter?.toString() ?? 'all',
  ].join('-')

  return (
    <>
      <ErrorBoundary fallback={<TokenTableError />}>
        <Suspense key={suspenseRenderKey} fallback={<TokenTableLoading />}>
          <TokenTableServer
            chain={chain}
            page={page}
            entriesPerPage={entriesPerPage}
            filter={filter}
            chainFilter={chainFilter}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

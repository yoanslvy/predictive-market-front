'server-only'

import { ErrorBoundary } from 'react-error-boundary'

import React, { Suspense } from 'react'

import FluxTxTableServer from './data'
import FluxTxTableError from './error'
import FluxTxTableLoading from './loading'

const entriesPerPage = 10

type Props = {
  page?: number
  wallet?: string
  chainId?: number
}

export default async function FluxTransactionsTable(props: Props) {
  return (
    <>
      <ErrorBoundary fallback={<FluxTxTableError />}>
        <Suspense fallback={<FluxTxTableLoading />}>
          <FluxTxTableServer
            entriesPerPage={entriesPerPage}
            page={props.page}
            wallet={props.wallet}
            chainId={props.chainId}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

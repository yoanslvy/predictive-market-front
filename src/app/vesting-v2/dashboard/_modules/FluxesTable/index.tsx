'server-only'

import { ErrorBoundary } from 'react-error-boundary'

import React, { Suspense } from 'react'

import { FluxDirection } from '@/src/app/vesting-v2/_views/VestingDashboardView'

import FluxesTableServer from './data'
import FluxesTableError from './error'
import FluxesTableLoading from './loading'

const entriesPerPage = 25

type Props = {
  filter?: string
  page?: number
  table: FluxDirection
  chainId: number
  wallet: string
  direction: 'incoming' | 'outgoing' | 'all'
  onlyClaimable: boolean
  chainFilter?: number
}

export default async function FluxesTable(props: Props) {
  return (
    <>
      <ErrorBoundary fallback={<FluxesTableError />}>
        <Suspense fallback={<FluxesTableLoading />}>
          <FluxesTableServer
            entriesPerPage={entriesPerPage}
            direction={props.direction}
            filter={props.filter}
            page={props.page ?? 1}
            chainId={props.chainId}
            wallet={props.wallet}
            onlyClaimable={props.onlyClaimable}
            table={props.table}
            chainFilter={props.chainFilter}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

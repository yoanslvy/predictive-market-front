'server-only'

import { ErrorBoundary } from 'react-error-boundary'

import React, { Suspense } from 'react'

import { LockExploreType } from '../../../_types/types'
import TokenTableServer from './data'
import TokenTableError from './error'
import TokenTableLoading from './loading'

const entitiesPerPage = 25

export default async function TokenTable({ props }: { props: LockExploreType }) {
  const suspenseRenderKey = [
    props.view || '',
    props.chain || '1',
    props.filter || '',
    props.page || '1',
    props.ts || '',
  ].join('-')

  return (
    <>
      <ErrorBoundary fallback={<TokenTableError />}>
        <Suspense key={suspenseRenderKey} fallback={<TokenTableLoading paramsSearch={props} />}>
          <TokenTableServer
            props={{
              chain: props.chain,
              page: props.page ? props.page : '1',
              entriesPerPage: entitiesPerPage.toString(),
              filter: props.filter,
            }}
          />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

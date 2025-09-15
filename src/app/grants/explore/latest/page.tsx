'server-only'

import React from 'react'

import { LockExploreType } from '../_types/types'
import TokenTable from './_modules/tokenTable'

export const maxDuration = 300

export default async function ExplorePage({
  params,
  searchParams,
}: {
  params: { chain: string }
  searchParams: LockExploreType
}) {
  return (
    <TokenTable
      props={{
        chain: searchParams.chain,
        filter: searchParams.filter,
        page: searchParams.page,
      }}
    />
  )
}

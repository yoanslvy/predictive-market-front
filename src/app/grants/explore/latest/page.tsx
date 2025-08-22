'server-only'

import React from 'react'
export const maxDuration = 300

import { LockExploreType } from '../_types/types'
import TokenTable from './_modules/tokenTable'

export default async function ExplorePage({ params, searchParams }: { params: { chain: string }, searchParams: LockExploreType }) {
  return (

    <TokenTable props={{
      chain: searchParams.chain,
      filter: searchParams.filter,
      locks: '',
      page: searchParams.page
    }} />
  )
}

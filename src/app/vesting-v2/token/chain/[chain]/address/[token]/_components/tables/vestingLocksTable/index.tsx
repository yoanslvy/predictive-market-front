import { VestingsOfTokenPagedQuery } from '@/.graphclient'
import 'server-only'

import React from 'react'

import Table from '@modules/Table'

import { truncate } from '@/src/utils/global'

import { columns, VestedLock } from './columns'

export async function VestingLocksTable({
  vestingLocks,
}: {
  vestingLocks: VestingsOfTokenPagedQuery['vestingV2_vestings']
}) {
  const vestingData = vestingLocks.map((lock) => {
    const result: VestedLock = {
      id: lock.id,
      shares: lock.amountBD.toString(),
      symbol: vestingLocks[0].tokenVested.symbol || '',
      owner: truncate(lock.creator.walletAddress, 12, '...'),
      beneficiary: truncate(lock.beneficiary.walletAddress, 12, '...'),
      endEmission: lock.endTime,
      type: lock.vestingEmissionType,
    }
    return result
  })

  return (
    <Table
      inner
      data={vestingData}
      columns={columns}
      rowHref={(data) => {
        return `/vesting-v2/flux/${data?.id}`
      }}
    />
  )
}

'use client'

import { GroupsOwnedByUserQuery } from '@/.graphclient'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

import { useState } from 'react'

import { Btn } from '../_components/Btn'
import { SearchInput } from '../_components/SearchInput'
import { dateFormatter } from '../_utils/utils'

function GroupCard({
  group,
  wallet,
  chainId,
}: {
  group: GroupsOwnedByUserQuery['vestingV2_groups'][number]
  wallet: string
  chainId: number
}) {
  return (
    <Link
      href={`/vesting-v2/groups/manage/${group.id}?wallet=${wallet}&chain=${chainId}`}
      className="flex h-[200px] flex-col items-start justify-between rounded-xl bg-[#15161C] px-[16px] py-[18px] transition-all hover:bg-[#26282E]">
      <div className="flex flex-col items-start gap-y-[0.8rem]">
        <p className="text-[22px] font-bold text-[#F0F2FB]">{group.name}</p>
      </div>
      <div className="flex flex-col items-start gap-y-[0.3rem]">
        <p className="text-[12px] text-[#757A8B]">Created at</p>
        <p className="text-[16px] text-[#F0F2FB]">
          {dateFormatter(new Date(Number(group.createdAt * 1000)), false, false)}
        </p>
      </div>
      <div className="flex flex-col items-start gap-y-[0.3rem]">
        <p className="text-[12px] text-[#757A8B]">Addresses</p>
        <p className="text-[16px] text-[#F0F2FB]">{group.members.length}</p>
      </div>
    </Link>
  )
}

export function MyGroups({
  groups,
  wallet,
  chainId,
}: {
  groups: GroupsOwnedByUserQuery['vestingV2_groups']
  wallet: string
  chainId: number
}) {
  const [search, setSearch] = useState<null | string>(null)
  const filteredGroups = search
    ? groups.filter((group) => group.name.toLowerCase().includes(search))
    : groups
  return (
    <>
      <div className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row sm:items-center sm:gap-0">
        <SearchInput search={search} setSearch={setSearch} />
        <div className="flex justify-between">
          <Btn
            as="link"
            href={`/vesting-v2/groups/create?wallet=${wallet}&chain=${chainId}`}
            variant="green">
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-[15px] font-bold gap-x-[0.6rem] flex items-center justify-center w-full h-full">
                <PlusIcon size={18} /> Create New Group
              </span>
            </div>
          </Btn>
        </div>
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-[2rem]">
        {filteredGroups.map((group) => (
          <GroupCard key={group.id} group={group} wallet={wallet} chainId={chainId} />
        ))}
      </div>
    </>
  )
}

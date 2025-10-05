import { PlusIcon } from 'lucide-react'
import 'server-only'

import { groupsOwnedByUserPagedCached } from '@/src/server/fetchers/vesting-v2/groupsOwnedByUser'

import { Btn } from '../_components/Btn'
import { PageHeader } from '../_components/PageHeader'
import { MyGroups } from './MyGroups'

export async function VestingGroupsServer({
  wallet,
  chainId,
}: {
  wallet: string
  chainId: number
}) {
  const { vestingV2_groups } = await groupsOwnedByUserPagedCached(wallet, 1)

  if (vestingV2_groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center page-content-no-pt">
        <p className="text-center text-[24px] font-[500] text-[#F0F2FB]">No Groups Created Yet</p>
        <p className="max-w-[360px] text-center text-[16px] font-[500] text-[#757A8B]">
          Start by organizing your addresses into groups for easier management and streamlined
          workflows. Groups can help you categorize recipients for vesting schedules or airdrops.
        </p>
        <div className="mt-[1rem] flex justify-between">
          <Btn
            as="link"
            href={`/vesting-v2/groups/create?wallet=${wallet}&chain=${chainId}`}
            variant="green">
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-[15px] font-bold gap-x-[0.6rem] flex items-center justify-center w-full h-full">
                <PlusIcon size={18} /> Create your first group
              </span>
            </div>
          </Btn>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-start page-content-no-pt">
      <PageHeader title="My Groups" />
      <MyGroups groups={vestingV2_groups} wallet={wallet} chainId={chainId} />
    </div>
  )
}

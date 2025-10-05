import { IncorrectParams } from '@/src/app/vesting-v2/create/_steps/_components/IncorrectParams'
import { groupMembershipByIdPagedCached } from '@/src/server/fetchers/vesting-v2/groupMembershipById'

import { ManageGroup } from '../../../../_views/ManageGroup'

export async function ManageGroupServer({
  id,
  wallet,
  chainId,
}: {
  id: string
  wallet: string
  chainId: number
}) {
  const { vestingV2_groupById } = await groupMembershipByIdPagedCached(id, 1)

  if (!vestingV2_groupById) {
    return (
      <IncorrectParams
        title="Group not found"
        subtitle="Please check the group ID and try again."
      />
    )
  }

  return <ManageGroup group={vestingV2_groupById} wallet={wallet} chainId={chainId} />
}

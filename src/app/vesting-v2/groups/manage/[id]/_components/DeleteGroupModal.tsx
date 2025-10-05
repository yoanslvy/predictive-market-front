'use client'

import { GroupMembershipByIdQuery } from '@/.graphclient'
import { Modal } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { useSign } from '@/src/app/vesting-v2/_hooks/useSign'
import {
  groupMembershipByIdPagedCachedTag,
  groupMembershipsPagedCachedTag,
  groupsOwnedByUserPagedCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'

import { Btn } from '../../../../_components/Btn'
import { useRefresh } from '../../../../_hooks/useRefresh'
import { Warning } from '../../../../_svg/Warning'

export function DeleteGroupModal({
  deleteModalOpened,
  closeDeleteGroupModal,
  group,
  wallet,
  chainId,
}: {
  deleteModalOpened: boolean
  closeDeleteGroupModal: () => void
  group: NonNullable<GroupMembershipByIdQuery['vestingV2_groupById']>
  wallet: string
  chainId: number
}) {
  const { isPending, refresh } = useRefresh()
  const { signRemoveGroup } = useSign()

  const router = useRouter()
  const removeGroupMutation = useMutation({
    mutationFn: async ({ groupId, signature }: { groupId: string; signature: string }) => {
      const response = await fetch(`/api/vesting-v2/removeGroup?wallet=${wallet}`, {
        method: 'POST',
        body: JSON.stringify({
          groupId,
          signature,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to delete group')
      await new Promise((resolve) => setTimeout(resolve, 3000))
      customRevalidateTag(groupMembershipByIdPagedCachedTag(groupId))
      customRevalidateTag(groupMembershipsPagedCachedTag(wallet))
      customRevalidateTag(groupsOwnedByUserPagedCachedTag(wallet))
    },
  })
  return (
    <Modal
      title={
        <div className="flex items-center gap-[1rem]">
          <Warning />
          <p>Are you sure you want to delete this group?</p>
        </div>
      }
      size="md"
      padding="sm"
      centered
      onClose={closeDeleteGroupModal}
      opened={deleteModalOpened}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 10,
      }}
      classNames={{
        body: 'bg-transparent p-4 ',
        header: 'bg-transparent',
        content: 'border border-[#2C2F3A] rounded-3xl p-[1rem] bg-[#17181C]',
        close: 'text-dim hover:text-white hover:bg-transparent',
        title: 'text-[#F0F2FB]  text-[24px]',
      }}>
      <div className="flex flex-col items-center justify-center gap-y-[1rem]">
        <p className="text-[16px] text-[#757A8B]">
          Deleting this group will not affect associated transactions, but the group and its
          structure will be permanently removed. This action is irreversible.
        </p>
        <div className="flex w-full flex-col gap-y-[1rem]">
          <div className="flex w-full items-center justify-between rounded-xl bg-[#FFFFFF05] p-[16px]">
            <div className="flex flex-col items-start gap-[1rem]">
              <p className="text-[22px] text-[#F0F2FB]">{group.name}</p>
              <div className="flex items-center gap-x-[2rem]">
                <div>
                  <p className="text-[12px] text-[#757A8B]">Addresses</p>
                  <p className="text-[16px] text-[#F0F2FB]">{group.members.length}</p>
                </div>
                <div>
                  <p className="text-[12px] text-[#757A8B]">Creation date</p>
                  <p className="text-[16px] text-[#F0F2FB]">
                    {new Date(Number(group.createdAt) * 1000).toLocaleDateString('en', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-x-[1rem]">
            <Btn onClick={closeDeleteGroupModal} variant="transparent" className="w-[50%]">
              <span className="text-center text-[16px] ">No, cancel</span>
            </Btn>
            <Btn
              loading={isPending || removeGroupMutation.isPending}
              onClick={async () => {
                try {
                  const signature = await signRemoveGroup({
                    groupId: group.id,
                  })
                  if (!signature) throw new Error('Signature not found')
                  await removeGroupMutation.mutateAsync({
                    groupId: group.id,
                    signature,
                  })
                  closeDeleteGroupModal()
                  toast.success('Group deleted successfully')
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  refresh()
                  router.push(`/vesting-v2/groups?wallet=${wallet}&chain=${chainId}`)
                } catch (err) {
                  toast.error(
                    err instanceof z.ZodError ? (
                      <div>
                        {err.issues.map((issue) => (
                          <p key={issue.message}>{issue.message}</p>
                        ))}
                      </div>
                    ) : err instanceof Error ? (
                      err.message
                    ) : (
                      'An error occurred'
                    )
                  )
                }
              }}
              variant="red"
              className="w-[50%]">
              <span className="text-center text-[16px] ">Yes, delete</span>
            </Btn>
          </div>
        </div>
      </div>
    </Modal>
  )
}

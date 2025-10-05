'use client'

import { GroupMembershipByIdQuery } from '@/.graphclient'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { useState } from 'react'

import {
  groupMembershipByIdPagedCachedTag,
  groupMembershipsPagedCachedTag,
  groupsOwnedByUserPagedCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'
import { changeGroupNameInputSchema } from '@/src/server/schemas/groups'

import { Btn } from '../../../../_components/Btn'
import { useRefresh } from '../../../../_hooks/useRefresh'
import { useSign } from '../../../../_hooks/useSign'

export function EditGroup({
  group,
  wallet,
}: {
  group: NonNullable<GroupMembershipByIdQuery['vestingV2_groupById']>
  wallet: string
}) {
  const { isPending, refresh } = useRefresh()
  const { signChangeGroupName } = useSign()
  const [newName, setNewName] = useState(group.name)
  const changeGroupNameMutation = useMutation({
    mutationFn: async ({
      groupId,
      newName,
      signature,
    }: {
      groupId: string
      newName: string
      signature: string
    }) => {
      const { ok } = await fetch(`/api/vesting-v2/changeGroupName?wallet=${wallet}`, {
        method: 'POST',
        body: JSON.stringify({
          groupId,
          newName,
          signature,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!ok) throw new Error('Failed to change group name')
      customRevalidateTag(groupMembershipByIdPagedCachedTag(groupId))
      customRevalidateTag(groupMembershipsPagedCachedTag(wallet))
      customRevalidateTag(groupsOwnedByUserPagedCachedTag(wallet))
    },
  })
  return (
    <div className="mt-[1em] w-full">
      <label className="text-[12px] text-[#757A8B]">Group name</label>
      <div className="flex gap-x-[1rem] rounded-lg border border-[#2C2F3A] bg-[#202228] px-[16px] py-[12px] text-[16px] text-white">
        <input
          defaultValue={group.name ?? ''}
          onChange={(e) => {
            setNewName(e.target.value)
          }}
          className="m-0 w-full border-transparent bg-transparent p-0 text-[20px] text-white"
          placeholder={'Group name'}
        />
        <Btn
          variant="green"
          loading={isPending || changeGroupNameMutation.isPending}
          onClick={async () => {
            try {
              changeGroupNameInputSchema.parse({
                groupId: group.id,
                newName,
              })
              if (newName === group.name) {
                throw new Error('Group name is the same as the current one')
              }
              const signature = await signChangeGroupName({
                groupId: group.id,
                newName,
              })
              if (!signature) throw new Error('Signature not found')
              await changeGroupNameMutation.mutateAsync({
                groupId: group.id,
                newName,
                signature,
              })
              toast.success('Group name changed successfully')
              refresh()
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
          }}>
          <span className="text-white text-[15px]">Save</span>
        </Btn>
      </div>
    </div>
  )
}

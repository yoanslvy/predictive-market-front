'use client'

import { GroupMembershipByIdQuery } from '@/.graphclient'
import { Button, CloseButton, Input, Modal } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { useState } from 'react'

import { isAddress } from 'viem'

import { useSign } from '@/src/app/vesting-v2/_hooks/useSign'
import {
  groupMembershipByIdPagedCachedTag,
  groupMembershipsPagedCachedTag,
  groupsOwnedByUserPagedCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'

import { Btn } from '../../../../_components/Btn'
import { useRefresh } from '../../../../_hooks/useRefresh'

export function AddAddressModal({
  closeAddAddressImportModal,
  addAddressModalOpened,
  group,
  wallet,
  chainId,
}: {
  addAddressModalOpened: boolean
  closeAddAddressImportModal: () => void
  group: NonNullable<GroupMembershipByIdQuery['vestingV2_groupById']>
  wallet: string
  chainId: number
}) {
  const { signAddGroupMember } = useSign()
  const [addressToAdd, setAddressToAdd] = useState<string | null>(null)
  const { isPending, refresh } = useRefresh()
  const addAddressesToGroupMutation = useMutation({
    mutationFn: async ({
      groupId,
      addresses,
      signature,
    }: {
      groupId: string
      addresses: string[]
      signature: string
    }) => {
      const response = await fetch(
        `/api/vesting-v2/addAddressesToGroup?wallet=${wallet}&chain=${chainId}`,
        {
          method: 'POST',
          body: JSON.stringify({
            groupId,
            addresses,
            signature,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (!response.ok) throw new Error('Failed to add address')
      await new Promise((resolve) => setTimeout(resolve, 3000))
      customRevalidateTag(groupMembershipByIdPagedCachedTag(groupId))
      customRevalidateTag(groupMembershipsPagedCachedTag(wallet))
      customRevalidateTag(groupsOwnedByUserPagedCachedTag(wallet))
    },
  })

  return (
    <Modal
      title="Add Address"
      size="md"
      padding="sm"
      centered
      onClose={closeAddAddressImportModal}
      opened={addAddressModalOpened}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 10,
      }}
      classNames={{
        body: 'bg-transparent p-4',
        header: 'bg-transparent',
        content: 'border border-[#2C2F3A] rounded-3xl p-[1rem] bg-[#17181C]',
        close: 'text-dim hover:text-white hover:bg-transparent',
        title: 'text-[#F0F2FB] text-[24px] font-bold',
      }}>
      <div className="flex flex-col items-center justify-center gap-y-[2rem]">
        <div className="flex w-full flex-col items-center gap-y-[1rem]">
          <div className="flex w-full gap-x-[1rem] rounded-lg bg-[#202228] px-[16px] py-[12px] text-[16px] text-white">
            <Input
              value={addressToAdd ?? ''}
              classNames={{
                input:
                  'bg-transparent border-transparent text-white py-0 my-0 pl-0 ml-0 text-[16px]',
              }}
              onChange={(e) => {
                setAddressToAdd(e.currentTarget.value)
              }}
              className="m-0 w-full border-transparent bg-transparent text-[20px]"
              placeholder={'Address'}
              rightSectionPointerEvents="all"
              rightSection={
                <CloseButton
                  aria-label="Clear input"
                  onClick={() => setAddressToAdd(null)}
                  style={{ display: addressToAdd ? undefined : 'none' }}
                />
              }
            />
          </div>
          <Btn
            className="w-full text-[16px] font-bold"
            variant="white"
            disabled={!addressToAdd}
            loading={addAddressesToGroupMutation.isPending || isPending}
            onClick={async () => {
              try {
                if (!addressToAdd || !isAddress(addressToAdd)) {
                  throw new Error('Invalid address')
                }
                const signature = await signAddGroupMember({
                  groupId: group.id,
                })
                if (!signature) throw new Error('Signature not found')
                await addAddressesToGroupMutation.mutateAsync({
                  groupId: group.id,
                  addresses: [addressToAdd],
                  signature,
                })
                toast.success('Address added successfully')
                setAddressToAdd(null)
                refresh()
                closeAddAddressImportModal()
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
            Add Address
          </Btn>
        </div>
      </div>
    </Modal>
  )
}

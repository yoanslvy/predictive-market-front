'use client'

import { GroupMembershipByIdQuery } from '@/.graphclient'
import { useDisclosure } from '@mantine/hooks'

import { type ReactNode, useState } from 'react'

import { cn } from '@/src/src/utils'

import { Btn } from '../_components/Btn'
import { PageHeader } from '../_components/PageHeader'
import { Trash } from '../_svg/Trash'
import { ManageGroupTable } from '../_tables/ManageGroupTable'
import { ActionBar } from '../groups/manage/[id]/_components/ActionBar'
import { DeleteGroupModal } from '../groups/manage/[id]/_components/DeleteGroupModal'
import { EditGroup } from '../groups/manage/[id]/_components/EditGroup'

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'h-[296px] w-full justify-between rounded-xl px-[32px] py-[26px] lg:w-[684px]',
        className
      )}>
      {children}
    </div>
  )
}

export function ManageGroup({
  group,
  wallet,
  chainId,
}: {
  group: NonNullable<GroupMembershipByIdQuery['vestingV2_groupById']>
  wallet: string
  chainId: number
}) {
  const [search, setSearch] = useState<null | string>(null)
  const [selectedAddresses, setSelectedAddresses] = useState<Set<string>>(new Set<string>())
  const [deleteModalOpened, { close: closeDeleteGroupModal, open: openDeleteGroupModal }] =
    useDisclosure(false)

  return (
    <>
      <DeleteGroupModal
        deleteModalOpened={deleteModalOpened}
        closeDeleteGroupModal={closeDeleteGroupModal}
        group={group}
        wallet={wallet}
        chainId={chainId}
      />
      <div className="flex flex-col items-center justify-start page-content-no-pt">
        <PageHeader
          leftHref={`/vesting-v2/groups?wallet=${wallet}&chain=${chainId}`}
          leftLabel="My Groups"
          title={'Manage Group'}
        />
        <div className="flex flex-col items-center justify-center w-full">
          <Card className="flex flex-col justify-between bg-[#17181C]">
            <div>
              <p className="text-[24px] text-[#F0F2FB]">Group Details</p>
              <EditGroup group={group} wallet={wallet} />
            </div>
            <div>
              <Btn
                className="w-fit"
                variant="transparent"
                onClick={() => {
                  openDeleteGroupModal()
                }}>
                <div className="flex items-center gap-x-[0.6rem]">
                  <div className="relative size-[24px]">
                    <Trash fill="#FB3D48" />
                  </div>
                  <span className=" text-[16px] text-[#FB3D48]">Delete Group</span>
                </div>
              </Btn>
            </div>
          </Card>
        </div>
        <ActionBar
          wallet={wallet}
          selectedAddresses={selectedAddresses}
          setSelectedAddresses={setSelectedAddresses}
          setSearch={setSearch}
          group={group}
          chainId={chainId}
        />
        <ManageGroupTable
          selectedAddresses={selectedAddresses}
          setSelectedAddresses={setSelectedAddresses}
          group={group}
          wallet={wallet}
          search={search}
          chainId={chainId}
        />
      </div>
    </>
  )
}

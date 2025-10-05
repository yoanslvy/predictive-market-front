import { GroupMembershipByIdQuery } from '@/.graphclient'
import { Checkbox } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

import { PaginationNoPathname } from '@/src/components/modules/Pagination/Pagination'
import {
  groupMembershipByIdPagedCachedTag,
  groupMembershipsPagedCachedTag,
  groupsOwnedByUserPagedCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'
import { cn } from '@/src/src/utils'

import { useRefresh } from '../_hooks/useRefresh'
import { useSign } from '../_hooks/useSign'
import { Copy } from '../_svg/Copy'
import { Trash } from '../_svg/Trash'
import { dateFormatter } from '../_utils/utils'

const entriesPerPage = 10

type ManageGroupTableProps = {
  group: NonNullable<GroupMembershipByIdQuery['vestingV2_groupById']>
  wallet: string
  search: string | null
  selectedAddresses: Set<string>
  setSelectedAddresses: Dispatch<SetStateAction<Set<string>>>
  chainId: number
}

const AddressRow = ({
  recipient,
  idx,
  selectedAddresses,
  setSelectedAddresses,
  isPending,
  onRemoveAddress,
}: {
  recipient: NonNullable<GroupMembershipByIdQuery['vestingV2_groupById']>['members'][number]
  idx: number
  selectedAddresses: Set<string>
  setSelectedAddresses: Dispatch<SetStateAction<Set<string>>>
  isPending: boolean
  onRemoveAddress: (address: string) => Promise<void>
}) => {
  const wallet = recipient.wallet
  return (
    <tr
      className={cn(
        'table-row h-[4rem] border-black bg-[#15161C] text-base text-white hover:bg-black/10',
        idx > 0 && 'border-t'
      )}
      key={wallet}>
      <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
        <div className="flex items-center w-full h-full">
          <Checkbox
            checked={selectedAddresses.has(wallet)}
            onChange={(checked) => {
              setSelectedAddresses((prev) => {
                const next = new Set(prev)
                if (checked.target.checked) {
                  next.add(wallet)
                } else {
                  next.delete(wallet)
                }
                return next
              })
            }}
            classNames={{
              input:
                'bg-transparent border-[#757A8B52] bg-[#757A8B52] checked:bg-[#2FFA8129] checked:border-transparent',
              icon: 'text-[#2FFA81]',
            }}
          />
        </div>
      </td>
      <td className="table-cell h-[4rem] px-[1rem] align-middle text-[#F0F2FB4D]">
        <div className="flex items-center w-full h-full">
          <span className="min-w-max">{idx + 1}</span>
        </div>
      </td>
      <td className="table-cell h-[4rem] px-[1rem] align-middle text-white">
        <div className="flex h-full w-full items-center gap-x-[0.7rem]">
          <span className=" min-w-max">{wallet}</span>
          <button
            onClick={() => {
              void navigator.clipboard.writeText(wallet)
              toast.info('Address copied to clipboard', {
                className: 'bg-[#2A2C35]',
              })
            }}>
            <Copy color="#F0F2FB4D" />
          </button>
        </div>
      </td>
      <td className="table-cell h-[4rem] px-[1rem]">
        <div className="flex items-center w-full h-full">
          <span className="capitalize min-w-max">
            {dateFormatter(new Date(Number(recipient.joinedAt) * 1000))}
          </span>
        </div>
      </td>
      <td className="table-cell h-[4rem] px-[1rem]">
        <div className="flex items-center w-full h-full">
          <button
            disabled={isPending}
            onClick={() => void onRemoveAddress(recipient.wallet)}
            className="flex items-center gap-x-[0.5rem] disabled:cursor-not-allowed disabled:opacity-70">
            <p className=" text-[#FB3D48]">Remove</p>
            <Trash fill="#FB3D48" />
          </button>
        </div>
      </td>
    </tr>
  )
}

const TableHeader = ({
  filteredAddresses,
  selectedAddresses,
  setSelectedAddresses,
}: {
  filteredAddresses: NonNullable<GroupMembershipByIdQuery['vestingV2_groupById']>['members']
  selectedAddresses: Set<string>
  setSelectedAddresses: Dispatch<SetStateAction<Set<string>>>
}) => {
  const columns = [
    {
      jsx: (
        <Checkbox
          checked={
            selectedAddresses.size === filteredAddresses.length && filteredAddresses.length > 0
          }
          onChange={(checked) => {
            setSelectedAddresses(
              checked.target.checked ? new Set(filteredAddresses.map((a) => a.wallet)) : new Set()
            )
          }}
          classNames={{
            input:
              'bg-transparent border-[#757A8B52] bg-[#757A8B52] checked:bg-[#2FFA8129] checked:border-transparent',
            icon: 'text-[#2FFA81]',
          }}
        />
      ),
    },
    { jsx: '#' },
    { jsx: `Addresses (${filteredAddresses.length})` },
    { jsx: 'Date added' },
    { jsx: 'Action' },
  ]

  return (
    <thead className="h-[3.5rem] rounded-lg bg-[#1F2128] text-xs text-gray-400">
      <tr className="rounded-t-lg">
        {columns.map(({ jsx }, idx, arr) => (
          <th
            key={idx}
            className={cn(
              'px-[1rem] text-start',
              idx === 0 && 'rounded-tl-lg pl-[1rem]',
              idx === arr.length - 1 && 'rounded-tr-lg'
            )}>
            {jsx}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export function ManageGroupTable({
  group,
  wallet,
  search,
  selectedAddresses,
  setSelectedAddresses,
  chainId,
}: ManageGroupTableProps) {
  const { signRemoveGroupMember } = useSign()
  const { refresh, isPending } = useRefresh()
  const removeAddressesMutation = useMutation({
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
        `/api/vesting-v2/removeAddressesFromGroup?wallet=${wallet}&chain=${chainId}`,
        {
          method: 'DELETE',
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
      if (!response.ok) throw new Error('Failed to remove address')
      await new Promise((resolve) => setTimeout(resolve, 3000))
      customRevalidateTag(groupMembershipByIdPagedCachedTag(groupId))
      customRevalidateTag(groupMembershipsPagedCachedTag(wallet))
      customRevalidateTag(groupsOwnedByUserPagedCachedTag(wallet))
      refresh()
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    },
    onSuccess: () => {
      toast.success('Addresses removed successfully')
    },
  })

  const filteredAddresses = search
    ? group.members.filter((a) => a.wallet.toLowerCase().includes(search.toLowerCase()))
    : group.members

  useEffect(() => {
    setSelectedAddresses(new Set())
  }, [search, setSelectedAddresses])

  const handleRemoveAddress = async (address: string) => {
    try {
      const signature = await signRemoveGroupMember({
        groupId: group.id,
      })
      if (!signature) throw new Error('Signature not found')
      await removeAddressesMutation.mutateAsync({
        groupId: group.id,
        addresses: [address],
        signature,
      })
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
  }

  const [currentPage, setCurrentPage] = useState(1)

  const filteredAndSlicedRecipients = filteredAddresses.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="table w-full border-collapse rounded-lg bg-steel-80">
        <TableHeader
          filteredAddresses={filteredAndSlicedRecipients}
          selectedAddresses={selectedAddresses}
          setSelectedAddresses={setSelectedAddresses}
        />
        <tbody>
          {filteredAndSlicedRecipients.map((recipient, idx) => (
            <AddressRow
              key={recipient.wallet}
              recipient={recipient}
              idx={idx}
              selectedAddresses={selectedAddresses}
              setSelectedAddresses={setSelectedAddresses}
              isPending={isPending || removeAddressesMutation.isPending}
              onRemoveAddress={handleRemoveAddress}
            />
          ))}
        </tbody>
      </table>
      <PaginationNoPathname
        className="mt-4"
        total={filteredAddresses.length}
        onChange={(page) => {
          setCurrentPage(page)
        }}
        page={currentPage}
        perPage={entriesPerPage}
        skipRadius={2}
      />
    </div>
  )
}

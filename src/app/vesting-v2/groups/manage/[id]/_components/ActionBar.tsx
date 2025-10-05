import { GroupMembershipByIdQuery } from '@/.graphclient'
import { useDisclosure } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { type Dispatch, type SetStateAction } from 'react'

import { useSign } from '@/src/app/vesting-v2/_hooks/useSign'
import {
  groupMembershipByIdPagedCachedTag,
  groupMembershipsPagedCachedTag,
  groupsOwnedByUserPagedCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'

import { Btn } from '../../../../_components/Btn'
import { SearchInput } from '../../../../_components/SearchInput'
import { useRefresh } from '../../../../_hooks/useRefresh'
import { Trash } from '../../../../_svg/Trash'
import { UploadWithGreenDash } from '../../../../_svg/UploadWithGreenDash'
import { downloadCsv } from '../../../../_utils/utils'
import { AddAddressModal } from './AddAddressModal'
import { ImportAddressesModal } from './ImportAddressesModal'

export function ActionBar({
  setSearch,
  group,
  selectedAddresses,
  setSelectedAddresses,
  wallet,
  chainId,
}: {
  setSearch: Dispatch<SetStateAction<string | null>>
  group: NonNullable<GroupMembershipByIdQuery['vestingV2_groupById']>
  selectedAddresses: Set<string>
  setSelectedAddresses: Dispatch<SetStateAction<Set<string>>>
  chainId: number
  wallet: string
}) {
  const { signRemoveGroupMember } = useSign()
  const [importModalOpened, { close: closeImportModal, open: openImportModal }] = useDisclosure()
  const [
    addAddressModalOpened,
    { close: closeAddAddressImportModal, open: openAddAddressImportModal },
  ] = useDisclosure()
  const { isPending, refresh } = useRefresh()

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
      const { ok } = await fetch(
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

      if (!ok) throw new Error('Failed to remove address')
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setSelectedAddresses(new Set())
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

  function exportAddressesCsv() {
    const csvData = new Blob([group.members.map((e) => e.wallet).join('\n')], {
      type: 'text/csv',
    })

    const fileName = `addresses-group-${group.name}_${new Date()
      .toLocaleDateString('en', {
        dateStyle: 'short',
      })
      .replaceAll('/', '-')}`
    downloadCsv(csvData, `${fileName}.csv`)
  }

  return (
    <>
      <ImportAddressesModal
        importModalOpened={importModalOpened}
        closeImportModal={closeImportModal}
        group={group}
        wallet={wallet}
      />
      <AddAddressModal
        wallet={wallet}
        addAddressModalOpened={addAddressModalOpened}
        closeAddAddressImportModal={closeAddAddressImportModal}
        group={group}
        chainId={chainId}
      />
      <div className="flex w-full flex-wrap items-center justify-between gap-[1rem]">
        <div className="flex items-center gap-[2rem]">
          <SearchInput search={null} setSearch={setSearch} />
          {selectedAddresses.size > 0 && (
            <button
              disabled={isPending}
              onClick={async () => {
                try {
                  const signature = await signRemoveGroupMember({
                    groupId: group.id,
                  })
                  if (!signature) throw new Error('Signature not found')
                  await removeAddressesMutation.mutateAsync({
                    groupId: group.id,
                    addresses: [...selectedAddresses],
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
              }}
              className="flex items-center gap-x-[0.4rem] text-[#FB3D48]">
              <Trash fill="#FB3D48" />
              <span>Remove Selected</span>
            </button>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center justify-between gap-[1.4rem] lg:w-fit">
          <Btn
            variant="transparent"
            onClick={() => {
              exportAddressesCsv()
            }}>
            <div className="flex items-center gap-x-[0.6rem]">
              <div className="relative size-[24px] rotate-180">
                <UploadWithGreenDash />
              </div>
              <span className="text-white text-[15px]">Export</span>
            </div>
          </Btn>
          <Btn variant="transparent" onClick={openImportModal}>
            <div className="flex items-center gap-x-[0.6rem]">
              <div className="relative size-[24px]">
                <UploadWithGreenDash />
              </div>
              <span className="text-white text-[15px]">Import</span>
            </div>
          </Btn>
          <Btn variant="green" onClick={openAddAddressImportModal}>
            <span className="text-[15px] font-bold gap-x-[0.6rem] flex items-center justify-center w-full h-full">
              <PlusIcon size={18} /> Add Address
            </span>
          </Btn>
        </div>
      </div>
    </>
  )
}

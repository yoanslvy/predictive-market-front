'use client'

import { GroupMembershipByIdQuery } from '@/.graphclient'
import { Modal } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'

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
import { ImportCsvButton } from '../../../../_components/ImportCsvButton'
import { useRefresh } from '../../../../_hooks/useRefresh'
import { File } from '../../../../_svg/File'
import { Trash } from '../../../../_svg/Trash'
import { formatBytes } from '../../../../_utils/utils'

export function ImportAddressesModal({
  importModalOpened,
  closeImportModal,
  group,
  wallet,
}: {
  importModalOpened: boolean
  closeImportModal: () => void
  group: NonNullable<GroupMembershipByIdQuery['vestingV2_groupById']>
  wallet: string
}) {
  const { signAddGroupMember } = useSign()
  const [csvFile, setCsvFile] = useState<File | null>(null)
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
      const response = await fetch(`/api/vesting-v2/addAddressesToGroup?wallet=${wallet}`, {
        method: 'POST',
        body: JSON.stringify({
          groupId,
          addresses,
          signature,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to add address')
      await new Promise((resolve) => setTimeout(resolve, 3000))
      customRevalidateTag(groupMembershipByIdPagedCachedTag(groupId))
      customRevalidateTag(groupMembershipsPagedCachedTag(wallet))
      customRevalidateTag(groupsOwnedByUserPagedCachedTag(wallet))
    },
  })

  return (
    <Modal
      title="Import Addresses"
      size="md"
      padding="sm"
      centered
      onClose={closeImportModal}
      opened={importModalOpened}
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
        <p className="text-[16px] text-[#757A8B]">
          Upload a CSV file with wallet addresses to add them to this group. Ensure that the file is
          formatted correctly. Duplicates will be ignored.
        </p>
        <div className="flex w-full flex-col gap-y-[1rem]">
          {csvFile ? (
            <div className="flex h-[68px] w-full items-center justify-between rounded-xl bg-[#2FFA810F] px-[16px]">
              <div className="flex items-center gap-x-[1rem]">
                <div>
                  <File />
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-[14px] font-[500] text-white">{csvFile.name}</p>
                  <p className="text-[12px] font-[400] text-[#757A8B]">
                    {formatBytes(csvFile.size)} - 100% uploaded
                  </p>
                </div>
              </div>
              <button onClick={() => setCsvFile(null)}>
                <Trash width={28} height={28} />
              </button>
            </div>
          ) : (
            <ImportCsvButton csvFile={csvFile} setCsvFile={setCsvFile} />
          )}
          <Btn
            variant="white"
            disabled={!csvFile}
            loading={addAddressesToGroupMutation.isPending || isPending}
            onClick={() => {
              if (!csvFile) return
              const reader = new FileReader()
              reader.onload = async () => {
                const text = reader.result as string
                const lines = text
                  .split('\n')
                  .filter((line) => line.trim() !== '')
                  .filter((line) => !line.startsWith('address'))
                  .map((line) => line.trim())
                const newRecipients = lines
                  .map((line) => {
                    const [address] = line.includes(',') ? line.split(',') : line.split(';')
                    if (!address || !isAddress(address)) return null
                    return address
                  })
                  .filter((x) => x != null)
                if (newRecipients.length !== lines.length) {
                  toast.error('Some CSV lines are invalid, please review your CSV file')
                  return
                }
                if (newRecipients.length === 0) {
                  toast.error('No valid recipients found in the CSV file')
                  return
                }
                const setRecipients = [...new Set(newRecipients)]
                const signature = await signAddGroupMember({
                  groupId: group.id,
                })
                if (!signature) throw new Error('Signature not found')
                await addAddressesToGroupMutation.mutateAsync({
                  groupId: group.id,
                  addresses: setRecipients,
                  signature,
                })
                toast.success('Addresses added successfully')
                setCsvFile(null)
                refresh()
                closeImportModal()
              }
              reader.readAsText(csvFile)
            }}
            className="text-[16px] font-bold w-full">
            Import
          </Btn>
        </div>
      </div>
    </Modal>
  )
}

'use client'

import { Divider } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { useState } from 'react'

import { isAddress } from 'viem'

import {
  groupMembershipsPagedCachedTag,
  groupsOwnedByUserPagedCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'
import { createGroupInputSchema } from '@/src/server/schemas/groups'

import { Btn } from '../_components/Btn'
import { ImportCsvButton } from '../_components/ImportCsvButton'
import { InputWithAddButton } from '../_components/InputWithAddButton'
import { RecipientsList } from '../_components/RecipientsList'
import { SearchInput } from '../_components/SearchInput'
import { useRefresh } from '../_hooks/useRefresh'
import { useSign } from '../_hooks/useSign'
import { Plus } from '../_svg/Plus'

const formId = 'createGroupForm'

export function CreateGroup({ wallet, chainId }: { wallet: string; chainId: number }) {
  const { signCreateGroup } = useSign()
  const [search, setSearch] = useState<null | string>(null)
  const [recipient, setRecipient] = useState<string | null>(null)
  const [recipients, setRecipients] = useState<string[]>([])
  const [groupName, setGroupName] = useState<string | null>(null)
  const filteredRecipients = search
    ? recipients.filter((recipient) => recipient.toLowerCase().includes(search.toLowerCase()))
    : recipients
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const createGroupMutation = useMutation({
    mutationFn: async ({
      groupName,
      addresses,
      signature,
    }: {
      groupName: string
      addresses: string[]
      signature: string
    }) => {
      const response = await fetch(`/api/vesting-v2/create?wallet=${wallet}&chain=${chainId}`, {
        method: 'POST',
        body: JSON.stringify({
          groupName,
          addresses,
          signature,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) throw new Error('Failed to create group')
      await new Promise((resolve) => setTimeout(resolve, 3000))
      customRevalidateTag(groupMembershipsPagedCachedTag(wallet))
      customRevalidateTag(groupsOwnedByUserPagedCachedTag(wallet))
    },
  })
  const router = useRouter()
  const { refresh } = useRefresh()

  return (
    <div className="flex flex-col items-center justify-start w-full h-full pb-[1.5em]">
      <p className="mb-[2rem] text-[32px] font-[500] text-[#F0F2FB]">Create Group</p>
      <div className="grid grid-cols-1 gap-[3rem] lg:grid-cols-2">
        <form
          className="flex w-full max-w-[430px] flex-col gap-y-[0.7rem]"
          id={formId}
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              const parsed = createGroupInputSchema.parse({
                groupName,
                addresses: recipients,
              })
              const signature = await signCreateGroup({
                owner: wallet,
                name: parsed.groupName,
              })
              if (!signature) throw new Error('Signature not found')
              await createGroupMutation.mutateAsync({
                groupName: parsed.groupName,
                addresses: parsed.addresses,
                signature,
              })
              toast.success('Group created successfully')
              await new Promise((resolve) => setTimeout(resolve, 3000))
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
          }}>
          <div className="flex w-full flex-col items-start gap-y-[2rem]">
            <div className="flex w-full flex-col items-start gap-y-[1rem]">
              <label className="text-[20px] text-white">Add group name</label>
              <div className="flex w-full items-center gap-x-[1rem] rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] py-[12px] text-white">
                <input
                  onChange={(e) => {
                    setGroupName(e.currentTarget.value)
                  }}
                  className="m-0 w-full border-transparent bg-transparent p-0 text-[16px] text-white outline outline-transparent"
                  placeholder={'Group name'}
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-y-[1rem]">
              <label className="text-[20px] text-white">Add wallet addresses</label>
              <InputWithAddButton
                onInputChange={(e) => {
                  const address = e.currentTarget.value
                  if (isAddress(address)) {
                    setRecipient(address)
                  }
                }}
                onAddClick={() => {
                  try {
                    if (!recipient) throw new Error('Address is required')
                    if (!isAddress(recipient)) throw new Error('Invalid public key address')
                    if (recipients.includes(recipient)) throw new Error('Address already added')
                    setRecipients((prev) => [...prev, recipient])
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : 'An error occurred')
                  }
                }}
              />
            </div>
          </div>
          <div>
            <Divider
              my="xs"
              label="OR"
              color="#202228"
              labelPosition="center"
              classNames={{
                label: 'text-[#757A8BB8]',
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-y-[1rem]">
            <ImportCsvButton csvFile={csvFile} setCsvFile={setCsvFile} />
            <button
              className="w-full text-sm font-bold text-left text-white underline"
              onClick={() => {
                const link = document.createElement('a')
                link.href = '/template.csv'
                link.setAttribute('target', '_blank')
                link.setAttribute('rel', 'noopener noreferrer')
                link.innerText = 'template.csv'
                const csvContent = 'data:text/csv;charset=utf-8,'
                const csvData = `address\n0xA4068Dcb282a1A957740c3E0E10AE7b588216dD8`
                const encodedUri = encodeURI(csvContent + csvData)
                link.href = encodedUri
                link.setAttribute('download', 'template.csv')
                link.download = 'template.csv'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}>
              Download template
            </button>
            <button
              type="button"
              onClick={() => {
                if (!csvFile) return
                const reader = new FileReader()
                reader.onload = () => {
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
                  if (new Set(newRecipients.map((e) => e)).size !== newRecipients.length) {
                    toast.error(
                      'Some CSV lines have duplicate addresses, please review your CSV file'
                    )
                    return
                  }
                  if (newRecipients.length !== lines.length) {
                    toast.error('Some CSV lines are invalid, please review your CSV file')
                    return
                  }
                  if (newRecipients.length === 0) {
                    toast.error('No valid recipients found in the CSV file')
                    return
                  }
                  if (
                    new Set([...recipients.map((e) => e), ...newRecipients.map((e) => e)]).size !==
                    recipients.length + newRecipients.length
                  ) {
                    toast.error('Some recipients are already in the list')
                    return
                  }
                  setRecipients(newRecipients)
                  setCsvFile(null)
                }
                reader.readAsText(csvFile)
              }}
              className="flex h-[48px] w-full items-center justify-center gap-x-[16px] gap-y-[12px] rounded-full bg-[#757A8B33]">
              <span className="text-[15px] font-[500] text-white">Add recipients to the list</span>
              <span>
                <Plus />
              </span>
            </button>
          </div>
        </form>
        {recipients.length > 0 ? (
          <div className="flex w-full max-w-[246px] flex-col gap-y-[1rem]">
            <div className="flex items-end justify-between w-full">
              <p className="text-[20px] text-white">Wallet addresses</p>
              <p className="text-[13px] text-[#FFFFFF4D]">{filteredRecipients.length} Total</p>
            </div>
            <SearchInput search={search} setSearch={setSearch} placeholder="Search by address" />
            <RecipientsList
              filteredRecipients={filteredRecipients}
              setRecipients={setRecipients}
              className="max-h-[25em] overflow-y-auto"
            />
          </div>
        ) : (
          <div className="flex w-full max-w-[246px] flex-col gap-y-[1rem]">
            <div className="flex items-end justify-between w-full">
              <p className="text-[20px] text-white">Wallet addresses</p>
            </div>
            <div className="flex flex-col items-start gap-y-[1rem]">
              <p className="text-[14px] text-[#757A8BB8]">
                1. Add Addresses Manually. Enter wallet addresses one by one.
              </p>
              <p className="text-[14px] text-[#757A8BB8]">
                2. Import a CSV File. Upload a file to bulk add multiple addresses.
              </p>
              <p className="text-[14px] text-[#757A8BB8]">
                3. Use Existing Addresses from vesting. Select addresses already in use within
                vesting that don’t belong to any group.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="mt-[2em]">
        <Btn
          as="button"
          loading={createGroupMutation.isPending}
          form={formId}
          buttonType="submit"
          variant="green">
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-[15px] font-bold gap-x-[0.6rem] flex items-center justify-center w-full h-full">
              <PlusIcon size={18} /> Create group
            </span>
          </div>
        </Btn>
      </div>
    </div>
  )
}

import { Divider, Menu, Tooltip } from '@mantine/core'
import { toast } from 'react-toastify'

import { useState, type Dispatch, type SetStateAction } from 'react'

import { PaginationNoPathname } from '@/src/components/modules/Pagination/Pagination'
import { cn } from '@/src/src/utils'

import { shortenEthAddress } from '../../minter/global'
import { Copy } from '../_svg/Copy'
import { Trash } from '../_svg/Trash'
import { dateFormatter, formatAmount } from '../_utils/utils'
import { AnyRecipient } from '../create/_steps/_hooks/useAirdropStore'
import { AnyFlux } from '../create/_steps/_hooks/useVestingStore'

type RecipientList = AnyFlux | AnyRecipient

type RecipientsProps<TRecipient extends (string | RecipientList)[]> = {
  filteredRecipients: TRecipient
  setRecipients: Dispatch<SetStateAction<TRecipient>>
  className?: string
  tokenSymbol?: string
}

const entriesPerPage = 300

export function RecipientsList<T extends (string | RecipientList)[]>({
  filteredRecipients,
  setRecipients,
  className,
  tokenSymbol,
}: RecipientsProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  const filteredAndSlicedRecipients = filteredRecipients.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )
  return (
    <div>
      <ul className={cn('space-y-[1rem]', className)}>
        {filteredAndSlicedRecipients.map((recipient, idx) => {
          const globalIdx = idx + (currentPage - 1) * entriesPerPage

          if (typeof recipient === 'string') {
            return (
              <li
                className="h-fit w-full rounded-xl border border-[#202228] px-[16px] py-[13px]"
                key={recipient}>
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col gap-y-[0.2rem]">
                    <div className="flex w-full justify-between gap-x-[0.5rem]">
                      <span className="text-[14px] text-[#757A8B]">#{globalIdx + 1}</span>
                      <Tooltip label={recipient} position="top">
                        <span className="text-[14px] text-white">
                          {shortenEthAddress(recipient)}
                        </span>
                      </Tooltip>
                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard.writeText(recipient)
                          toast.success('Address copied to clipboard')
                        }}>
                        <Copy />
                      </button>
                    </div>
                  </div>
                  <Menu
                    classNames={{
                      dropdown: 'bg-[#202228] border-[#202228]',
                    }}
                    width={200}
                    position="bottom"
                    shadow="md">
                    <Menu.Target>
                      <div className="rotate-90">
                        <button type="button">...</button>
                      </div>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Options</Menu.Label>
                      <Menu.Item
                        onClick={() => {
                          setRecipients(
                            (prev) =>
                              prev.filter((e) => {
                                if (typeof e === 'string') {
                                  return e !== recipient
                                }
                                return true
                              }) as T
                          )
                        }}
                        color="red"
                        leftSection={<Trash fill="#757A8B" />}>
                        Remove
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </div>
              </li>
            )
          }
          return (
            <li
              className="h-fit w-full rounded-xl border border-[#202228] px-[16px] py-[13px]"
              key={recipient.address}>
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col gap-y-[0.2rem]">
                  <div className="flex w-full justify-between gap-x-[0.5rem]">
                    <span className="text-[14px] text-[#757A8B]">#{globalIdx + 1}</span>
                    <Tooltip label={recipient.address} position="top">
                      <span className="text-[14px] text-white">
                        {shortenEthAddress(recipient.address)}
                      </span>
                    </Tooltip>
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard.writeText(recipient.address)
                        toast.success('Address copied to clipboard')
                      }}>
                      <Copy />
                    </button>
                  </div>
                  <div className="flex items-center gap-x-[0.5rem]">
                    <span className="text-white">
                      {recipient?.amount ? formatAmount(recipient.amount) : '-'}
                    </span>
                    <span className="text-[#757A8B80]">{tokenSymbol}</span>
                  </div>
                </div>
                <Menu
                  classNames={{
                    dropdown: 'bg-[#202228] border-[#202228]',
                  }}
                  width={200}
                  position="bottom"
                  shadow="md">
                  <Menu.Target>
                    <div className="rotate-90">
                      <button type="button">...</button>
                    </div>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Options</Menu.Label>
                    <Menu.Item
                      onClick={() => {
                        setRecipients(
                          (prev) =>
                            prev.filter((e) => {
                              if (typeof e === 'object' && 'address' in e) {
                                return e.address !== recipient.address
                              }
                              return true
                            }) as T
                        )
                      }}
                      color="red"
                      leftSection={<Trash fill="#757A8B" />}>
                      Remove
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
              {'startDate' in recipient && (
                <>
                  <Divider className="my-[1em] w-full" color="#202228" />
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <p className="text-[13px] text-[#757A8B80]">Start</p>
                      <p className="text-[14px] text-white">{dateFormatter(recipient.startDate)}</p>
                    </div>
                    {'endDate' in recipient && (
                      <div>
                        <p className="text-[13px] text-[#757A8B80]">End</p>
                        <p className="text-[14px] text-white">{dateFormatter(recipient.endDate)}</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </li>
          )
        })}
      </ul>
      <PaginationNoPathname
        className="mt-4"
        total={filteredRecipients.length}
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

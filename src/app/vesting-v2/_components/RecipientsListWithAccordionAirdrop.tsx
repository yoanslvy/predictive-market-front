'use client'

import { Accordion, Menu, Tooltip } from '@mantine/core'
import { toast } from 'react-toastify'

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import { PaginationNoPathname } from '@/src/components/modules/Pagination/Pagination'
import { cn } from '@/src/src/utils'

import { shortenEthAddress } from '../../minter/global'
import { Copy } from '../_svg/Copy'
import { Trash } from '../_svg/Trash'
import { AnyRecipient, EmissionTypeValue } from '../create/_steps/_hooks/useAirdropStore'
import {
  RecipientPanelLinear,
  RecipientPanelProps,
  RecipientPanelScheduled,
  RecipientPanelSteps,
} from './RecipientPanel'

type RecipientList = {
  address: string
  amount: number
  isCompleted: boolean
  startDate: Date
  endDate: Date | null
  steps?: number
}

type RecipientsProps<TRecipient extends RecipientList[]> = {
  filteredRecipients: TRecipient
  setRecipients: Dispatch<SetStateAction<AnyRecipient[]>>
  className?: string
  tokenPriceUsd: number
  tokenSymbol?: string
  emissionType: EmissionTypeValue
}

const emissionTypePanels: Record<
  EmissionTypeValue,
  (props: RecipientPanelProps<any>) => JSX.Element | null
> = {
  scheduled: (props) => <RecipientPanelScheduled {...props} />,
  unlockInSteps: (props) => <RecipientPanelSteps {...props} />,
  linear: (props) => <RecipientPanelLinear {...props} />,
}

const entriesPerPage = 300

export function RecipientsListWithAccordionAirdrop<T extends RecipientList[]>({
  filteredRecipients,
  setRecipients,
  className,
  tokenPriceUsd,
  tokenSymbol,
  emissionType,
}: RecipientsProps<T>) {
  const Panel = emissionTypePanels[emissionType]

  const [value, setValue] = useState<string | null>(null)
  const [ft, setFt] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredAndSlicedRecipients = filteredRecipients.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  useEffect(() => {
    if (filteredAndSlicedRecipients.length === 1 && value == null && ft) {
      setValue(JSON.stringify({ idx: 0 }))
      setFt(false)
    }
  }, [filteredAndSlicedRecipients])

  return (
    <div>
      <Accordion
        value={value}
        onChange={(val) => {
          setValue(val)
        }}
        classNames={{
          control: 'hover:bg-transparent p-0 ',
          chevron: 'ml-[1em] text-[#757A8B]',
          content: 'm-0 p-0',
        }}
        defaultValue={filteredAndSlicedRecipients[0] ? JSON.stringify({ idx: 0 }) : ''}
        className={cn('space-y-[0.5rem]', className)}>
        {filteredAndSlicedRecipients.map((recipient, idx) => {
          const globalIdx = idx + (currentPage - 1) * entriesPerPage;
          return (
            <Accordion.Item
              className="h-fit w-full rounded-xl border border-[#202228] px-[16px] py-[13px]"
              key={JSON.stringify({ idx: globalIdx })}
              value={JSON.stringify({ idx: globalIdx })}>
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="flex w-full items-center justify-between gap-x-[0.5rem]">
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
                        }}
                        className="size-[20px]">
                        <Copy />
                      </button>
                    </div>
                    <Accordion.Control></Accordion.Control>
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
                    <div className="ml-[1em] mt-[0.1em]">
                      <button className="rotate-90" type="button">
                        ...
                      </button>
                    </div>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Options</Menu.Label>
                    <Menu.Item
                      onClick={() => {
                        setRecipients(
                          (prev) =>
                            prev.filter((_, rIdx) => {
                              return rIdx !== idx
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
              <Accordion.Panel>
                <Panel
                  recipient={recipient}
                  tokenPriceUsd={tokenPriceUsd}
                  tokenSymbol={tokenSymbol ?? ''}
                />
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>
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

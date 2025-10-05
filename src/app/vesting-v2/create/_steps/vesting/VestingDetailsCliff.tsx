'use client'

import { Divider, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { type FormEvent, useState } from 'react'

import { cn } from '@/src/src/utils'

import { AmountInputWithMaxAmount } from '../../../_components/AmountInputWithMaxAmount'
import { Btn } from '../../../_components/Btn'
import { DateRangePicker } from '../../../_components/DatePicker'
import { RecipientAddressInput } from '../../../_components/RecipientAddressInput'
import { RecipientsListWithAccordion } from '../../../_components/RecipientsListWithAccordion'
import { SearchInput } from '../../../_components/SearchInput'
import { Emissions } from '../../../_flux/_components/Emissions'
import { Plus } from '../../../_svg/Plus'
import { useVestingStore } from '../_hooks/useVestingStore'
import { CreateFluxWithChartHeader } from './CreateFluxWithChartHeader'

export function VestingDetailsCliff({
  tokenAmountUi,
  tokenPriceUsd,
  tokenSymbol,
  tokenDecimals,
}: {
  tokenSymbol: string
  tokenAmountUi: number
  tokenPriceUsd: number | null
  tokenDecimals: number
}) {
  const { cliffFluxes, setCliffFluxes } = useVestingStore((s) => ({
    cliffFluxes: s.cliffFluxes,
    setCliffFluxes: s.setCliffFluxes,
  }))

  const [endDate, setEndDate] = useState<Date | null>(null)
  const [recipient, setRecipient] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(null)
  const [cliffAmount, setCliffAmount] = useState<number | null>(null)
  const [searchAddress, setSearchAddress] = useState<string | null>(null)
  const [cliffDate, setCliffDate] = useState<Date | null>(null)

  const filteredFluxes = searchAddress
    ? cliffFluxes.filter((recipient) =>
        recipient.address.toLowerCase().includes(searchAddress.toLowerCase())
      )
    : cliffFluxes

  const remainingBalance =
    typeof tokenAmountUi === 'number'
      ? tokenAmountUi - cliffFluxes.reduce((acc, { amount }) => acc + amount, 0)
      : 0

  const hasInsufficientFunds = !!amount && !!(remainingBalance < amount)

  const canAddFlux =
    !!recipient &&
    !!amount &&
    !!endDate &&
    !hasInsufficientFunds &&
    !!cliffAmount &&
    !!cliffDate &&
    dayjs(cliffDate).isBefore(dayjs(endDate)) &&
    cliffAmount <= amount &&
    dayjs(cliffDate).isAfter(dayjs())

  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (canAddFlux) {
      setCliffFluxes((prev) => [
        ...prev,
        {
          address: recipient,
          amount,
          allowTopUps: false,
          endDate,
          cliffAmount,
          cliffDate,
          isCompleted: false,
        },
      ])
      setRecipient(null)
    } else {
      if (hasInsufficientFunds) {
        toast.error('You do not have enough funds to create this flux.')
        return
      }
      if (!recipient) {
        toast.error('Please enter a recipient address.')
        return
      }
      if (!amount) {
        toast.error('Please enter an amount.')
        return
      }
      if (!endDate) {
        toast.error('Please select an end date.')
        return
      }
      if (!cliffAmount) {
        toast.error('Please enter a cliff amount.')
        return
      }
      if (cliffAmount > amount) {
        toast.error('Cliff amount cannot be greater than the total amount.')
        return
      }
      if (!cliffDate) {
        toast.error('Please select a cliff date.')
        return
      }
      if (dayjs(cliffDate).isAfter(dayjs(endDate))) {
        toast.error('Cliff date must be after start date and before end date.')
        return
      }
      if (dayjs(cliffDate).isBefore(dayjs())) {
        toast.error('Cliff date cannot be in the past.')
        return
      }
    }
  }
  const [modalOpened, { close: closeModal, open: openModal }] = useDisclosure()

  return (
    <div className="flex w-full flex-col lg:flex-row items-start gap-x-[1rem] gap-y-[2rem]">
      <Modal
        title={'Emissions Schedule'}
        size="auto"
        padding="sm"
        centered
        onClose={() => {
          closeModal()
        }}
        opened={modalOpened}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 10,
        }}
        classNames={{
          body: 'bg-transparent',
          header: 'bg-transparent px-[2em] pt-[1em]',
          content: 'border border-[#2C2F3A] rounded-3xl bg-[#17181C] p-[1em]',
          close: 'text-dim hover:text-white hover:bg-transparent',
          title: 'text-[#F0F2FB]  text-[24px] font-bold',
        }}>
        <>
          {canAddFlux && (
            <Emissions
              className="px-0 py-0"
              hideTitle
              omitResponsiveContainer
              emissions={[
                {
                  name: new Date(),
                  pv: 0,
                },
                {
                  name: new Date(cliffDate),
                  pv: cliffAmount,
                },
                {
                  name: new Date(endDate),
                  pv: amount,
                },
              ]}
              tokenName={tokenSymbol}
              emissionType="CLIFF"
            />
          )}
        </>
      </Modal>
      <form
        onSubmit={onFormSubmit}
        className="flex w-full lg:max-w-[430px] flex-col items-start gap-x-[1rem] gap-y-[1rem]">
        <div className="flex w-full flex-col gap-y-[1rem]">
          <CreateFluxWithChartHeader canAddFlux={canAddFlux} openModal={openModal} />
          <AmountInputWithMaxAmount
            onChange={(e) => {
              const n = Number(e)
              setAmount(n)
            }}
            amount={amount}
            maxAmount={remainingBalance}
            tokenSymbol={tokenSymbol}
            tokenPriceUsd={tokenPriceUsd}
            hasInsufficientFunds={hasInsufficientFunds}
            tooltip="The amount that will be released at the end date."
            maxTokenDecimals={tokenDecimals}
          />
        </div>
        <Divider className="w-full" color="#202228" />
        <RecipientAddressInput
          onChange={(e) => {
            const address = e.currentTarget.value
            setRecipient(address)
          }}
          recipient={recipient ?? ''}
        />
        <Divider className="w-full" color="#202228" />
        <DateRangePicker
          enableYearNavigation
          showTimePicker
          value={{
            from: cliffDate ?? undefined,
            to: endDate ?? undefined,
          }}
          onChange={(value) => {
            if (value) {
              setCliffDate(value.from ? value.from : null)
              setEndDate(value.to ? value.to : null)
            }
          }}
          fromDate={new Date()}
          className="px-[16px] py-[12px] text-[16px] text-white h-[48px]"
          placeholder="Select cliff and end date"
        />
        {(cliffDate || endDate) && (
          <div className="w-full p-3 bg-[#2C2F3A]/30 rounded-lg border border-[#2C2F3A]">
            <div className="flex flex-col gap-2 text-sm">
              {cliffDate && (
                <div className="flex justify-between">
                  <span className="text-[#757A8B]">Starts in:</span>
                  <span
                    className={cn(
                      !dayjs(cliffDate).isBefore(dayjs()) ? 'text-white' : 'text-red-500'
                    )}>
                    {dayjs(cliffDate).diff(dayjs(), 'day')} days,{' '}
                    {dayjs(cliffDate).diff(dayjs(), 'hour') % 24} hours (
                    {dayjs(cliffDate).format('MMM DD, YYYY')})
                  </span>
                </div>
              )}
              {cliffDate && endDate && (
                <div className="flex justify-between">
                  <span className="text-[#757A8B]">Duration:</span>
                  <span className="text-white">
                    {dayjs(endDate).diff(dayjs(cliffDate), 'day')} days,{' '}
                    {dayjs(endDate).diff(dayjs(cliffDate), 'hour') % 24} hours
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        <Divider className="w-full" color="#202228" />

        <AmountInputWithMaxAmount
          onChange={(e) => {
            const n = Number(e)
            setCliffAmount(n)
          }}
          amount={cliffAmount}
          maxAmount={amount ?? undefined}
          tokenSymbol={tokenSymbol}
          tokenPriceUsd={tokenPriceUsd}
          hasInsufficientFunds={hasInsufficientFunds}
          placeholder="Enter cliff amount"
          className="w-full"
          tooltip="The amount that will be released at the cliff date. It must be less than or equal to the total amount."
          maxTokenDecimals={tokenDecimals}
        />
        <Divider className="w-full" color="#202228" />
        <p className="text-sm text-green-500">
          Cliff date must be after start date and before end date.
        </p>
        <Btn type="submit" className="mt-[1rem]" variant="gray">
          <span className="text-[16px] font-bold text-white mr-[1em]">Add Vesting</span>
          <Plus />
        </Btn>
      </form>
      <div className="flex w-full lg:max-w-[246px] flex-col gap-y-[1rem] ml-0 lg:ml-[3em]">
        <div className="flex items-center justify-between w-full">
          <p className="text-[20px] text-white">Vesting list</p>
          <p className="text-[13px] text-[#FFFFFF4D]">{filteredFluxes.length} Vesting</p>
        </div>
        <Divider className="w-full" color="#202228" />
        <SearchInput
          placeholder="Search by address"
          search={searchAddress}
          setSearch={setSearchAddress}
        />
        {filteredFluxes.length > 0 && (
          <Btn
            variant="red"
            onClick={() => {
              setCliffFluxes([])
            }}>
            Reset list
          </Btn>
        )}
        <RecipientsListWithAccordion
          className="max-h-[25em] overflow-y-auto"
          filteredRecipients={filteredFluxes}
          tokenPriceUsd={tokenPriceUsd ?? 0}
          setRecipients={setCliffFluxes}
          tokenSymbol={tokenSymbol}
          emissionType="cliff"
        />
      </div>
    </div>
  )
}

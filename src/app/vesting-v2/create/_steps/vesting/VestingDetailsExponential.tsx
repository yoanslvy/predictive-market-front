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

export function VestingDetailsExponential({
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
  const { exponentialFluxes, setExponentialFluxes } = useVestingStore((s) => ({
    exponentialFluxes: s.exponentialFluxes,
    setExponentialFluxes: s.setExponentialFluxes,
  }))

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [recipient, setRecipient] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(null)
  const [searchAddress, setSearchAddress] = useState<string | null>(null)

  const filteredFluxes = searchAddress
    ? exponentialFluxes.filter((recipient) =>
        recipient.address.toLowerCase().includes(searchAddress.toLowerCase())
      )
    : exponentialFluxes

  const remainingBalance =
    typeof tokenAmountUi === 'number'
      ? tokenAmountUi - exponentialFluxes.reduce((acc, { amount }) => acc + amount, 0)
      : 0

  const hasInsufficientFunds = !!amount && !!(remainingBalance < amount)

  const canAddFlux =
    !!recipient &&
    !!amount &&
    !!startDate &&
    !!endDate &&
    !hasInsufficientFunds &&
    dayjs(startDate).isBefore(dayjs(endDate)) &&
    dayjs(startDate).isAfter(dayjs())

  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (canAddFlux) {
      setExponentialFluxes((prev) => [
        ...prev,
        {
          address: recipient,
          amount,
          allowTopUps: false,
          endDate,
          startDate,
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
      if (!startDate) {
        toast.error('Please select a start date.')
        return
      }
      if (!endDate) {
        toast.error('Please select an end date.')
        return
      }
      if (dayjs(startDate).isAfter(dayjs(endDate))) {
        toast.error('Start date cannot be after end date.')
        return
      }
      if (dayjs(startDate).isBefore(dayjs())) {
        toast.error('Start date cannot be in the past.')
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
                  name: new Date(startDate),
                  pv: 0,
                },
                {
                  name: new Date(endDate),
                  pv: amount,
                },
              ]}
              tokenName={tokenSymbol}
              emissionType="EXPONENTIAL"
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
            from: startDate ?? undefined,
            to: endDate ?? undefined,
          }}
          onChange={(value) => {
            if (value) {
              setStartDate(value.from ? value.from : null)
              setEndDate(value.to ? value.to : null)
            }
          }}
          fromDate={new Date()}
          className="px-[16px] py-[12px] text-[16px] text-white h-[48px]"
          placeholder="Select cliff and end date"
        />
        {(startDate || endDate) && (
          <div className="w-full p-3 bg-[#2C2F3A]/30 rounded-lg border border-[#2C2F3A]">
            <div className="flex flex-col gap-2 text-sm">
              {startDate && (
                <div className="flex justify-between">
                  <span className="text-[#757A8B]">Starts in:</span>
                  <span
                    className={cn(
                      !dayjs(startDate).isBefore(dayjs()) ? 'text-white' : 'text-red-500'
                    )}>
                    {dayjs(startDate).diff(dayjs(), 'day')} days,{' '}
                    {dayjs(startDate).diff(dayjs(), 'hour') % 24} hours (
                    {dayjs(startDate).format('MMM DD, YYYY')})
                  </span>
                </div>
              )}
              {startDate && endDate && (
                <div className="flex justify-between">
                  <span className="text-[#757A8B]">Duration:</span>
                  <span className="text-white">
                    {dayjs(endDate).diff(dayjs(startDate), 'day')} days,{' '}
                    {dayjs(endDate).diff(dayjs(startDate), 'hour') % 24} hours
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
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
              setExponentialFluxes([])
            }}>
            Reset list
          </Btn>
        )}
        <RecipientsListWithAccordion
          className="max-h-[25em] overflow-y-auto"
          filteredRecipients={filteredFluxes}
          tokenPriceUsd={tokenPriceUsd ?? 0}
          setRecipients={setExponentialFluxes}
          tokenSymbol={tokenSymbol}
          emissionType="exponential"
        />
      </div>
    </div>
  )
}

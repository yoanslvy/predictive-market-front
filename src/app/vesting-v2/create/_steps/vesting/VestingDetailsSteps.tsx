'use client'

import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Checkbox, Divider, Modal, Popover, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { type FormEvent, useState } from 'react'

import Table from '@/src/components/modules/Table'
import { cn } from '@/src/src/utils'

import { AmountInputWithMaxAmount } from '../../../_components/AmountInputWithMaxAmount'
import { Btn } from '../../../_components/Btn'
import { DateRangePicker } from '../../../_components/DatePicker'
import { NumberInputWithLeftArrows } from '../../../_components/NumberInputWithLeftArrows'
import { RecipientAddressInput } from '../../../_components/RecipientAddressInput'
import { RecipientsListWithAccordion } from '../../../_components/RecipientsListWithAccordion'
import { SearchInput } from '../../../_components/SearchInput'
import { Emissions } from '../../../_flux/_components/Emissions'
import { Plus } from '../../../_svg/Plus'
import {
  dateFormatter,
  formatAmount,
  getAmountAndDatePerStepWithFee,
  getNormalizedTokenAmount,
  getStepsUnixTimestamps,
  MAX_STEPS_PER_BATCH,
  MIN_STEPS_PER_BATCH,
} from '../../../_utils/utils'
import { useVestingStore } from '../_hooks/useVestingStore'
import { CreateFluxWithChartHeader } from './CreateFluxWithChartHeader'

export function VestingDetailsSteps({
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
  const { stepsFluxes, setStepsFluxes } = useVestingStore((s) => ({
    stepsFluxes: s.stepsFluxes,
    setStepsFluxes: s.setStepsFluxes,
  }))

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [recipient, setRecipient] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(null)
  const [allowTopUps, setAllowTopUps] = useState(false)
  const [searchAddress, setSearchAddress] = useState<string | null>(null)
  const [steps, setSteps] = useState<number | null>(null)

  const filteredFluxes = searchAddress
    ? stepsFluxes.filter((recipient) =>
        recipient.address.toLowerCase().includes(searchAddress.toLowerCase())
      )
    : stepsFluxes

  const remainingBalance =
    typeof tokenAmountUi === 'number'
      ? tokenAmountUi - stepsFluxes.reduce((acc, { amount }) => acc + amount, 0)
      : 0

  const amountPerStep = ((amount ?? 0) * 10 ** 18) / (steps ?? 1) / 10 ** 18
  const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)

  const totalAmount = getStepDatesAndAmounts().at(-1)?.pv ?? 0

  const hasInsufficientFunds =
    (!!amount && !!(remainingBalance < amount)) ||
    (!!totalAmount && !!(remainingBalance < totalAmount))

  const canAddFlux =
    !!recipient &&
    !!amount &&
    !!startDate &&
    !hasInsufficientFunds &&
    !!steps &&
    !!endDate &&
    dayjs(startDate).isBefore(dayjs(endDate)) &&
    dayjs(startDate).isAfter(dayjs()) &&
    !!amountPerStepNorm &&
    steps >= MIN_STEPS_PER_BATCH &&
    steps <= MAX_STEPS_PER_BATCH

  function onFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (canAddFlux) {
      setStepsFluxes((prev) => [
        ...prev,
        {
          address: recipient,
          amount,
          allowTopUps,
          startDate,
          endDate,
          steps,
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
      if (!steps) {
        toast.error('Steps must be larger than 0')
        return
      }
      if (!amountPerStepNorm) {
        toast.error('Amount per step cannot be 0')
        return
      }
    }
  }

  const [modalOpened, { close: closeModal, open: openModal }] = useDisclosure()

  function getEmissionDates() {
    if (!canAddFlux) return []
    const datesUnix = getStepsUnixTimestamps(startDate, endDate, steps)
    return getAmountAndDatePerStepWithFee(amountPerStepNorm, datesUnix).map((e) => ({
      name: new Date(e.date * 1000),
      pv: Number(e.amount),
    }))
  }

  function getStepDatesAndAmounts() {
    if (!startDate || !endDate || !steps) {
      return []
    }

    const datesUnix = getStepsUnixTimestamps(startDate, endDate, steps)
    return getAmountAndDatePerStepWithFee(amountPerStepNorm, datesUnix).map((e) => ({
      name: new Date(e.date * 1000),
      pv: Number(amountPerStepNorm),
    }))
  }

  const [showAllRows, setShowAllRows] = useState(false)

  const stepDates = getStepDatesAndAmounts()
  const displayData = showAllRows ? stepDates : stepDates.slice(0, 3)
  const hasMoreRows = stepDates.length > 3

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
                ...getEmissionDates(),
              ]}
              tokenName={tokenSymbol}
              emissionType="UNLOCK_IN_STEPS"
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
            tooltip="The amount that will be released at each step."
            maxTokenDecimals={tokenDecimals}
          />
          <div className="flex items-center gap-x-[0.5em]">
            <Checkbox
              label="Allow top-ups"
              checked={allowTopUps}
              onChange={() => setAllowTopUps((prev) => !prev)}
              size="sm"
              classNames={{
                input:
                  'bg-transparent border-[#757A8B52] border-2 bg-[#757A8B52] checked:bg-[#2FFA8129] checked:border-transparent',
                icon: 'text-[#2FFA81]',
                label: 'text-[14px] text-[#757A8BB8] ',
              }}
            />
            <Tooltip
              label={
                'This will enable you to add more funds to the vesting schedule after it has been created.'
              }
              position="top">
              <div className="cursor-help text-[#757A8B] hover:text-[#F0F2FB] transition-colors text-[14px]">
                <QuestionMarkCircleIcon width={20} height={20} />
              </div>
            </Tooltip>
          </div>
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

        <NumberInputWithLeftArrows
          placeholder="Number of steps"
          value={steps}
          setValue={setSteps}
          min={MIN_STEPS_PER_BATCH}
          max={MAX_STEPS_PER_BATCH}
        />
        <p className="text-sm">
          Min: {MIN_STEPS_PER_BATCH}, Max: {MAX_STEPS_PER_BATCH}
        </p>
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
          placeholder="Select start and end date"
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
            {stepDates.length >= 2 && (
              <div className="mt-[0.4em] text-[#F0F2FB] text-sm">
                <div className="mt-2">
                  <div className="overflow-x-auto">
                    <Table
                      className="border border-[#2C2F3A] min-w-full"
                      data={displayData
                        .map(({ name, pv }, idx) => ({
                          id: idx + 1,
                          date: dateFormatter(name),
                          pv,
                        }))
                        .slice(0, MAX_STEPS_PER_BATCH)}
                      columns={[
                        {
                          title: 'Release #',
                          render: ({ data }) => (
                            <p className="text-[#F0F2FB4D] text-[13px] sm:text-[15px]">{data.id}</p>
                          ),
                        },
                        {
                          title: 'Release Date',
                          render: ({ data }) => (
                            <p className="text-[13px] sm:text-[15px] capitalize">{data.date}</p>
                          ),
                        },
                        {
                          title: 'Amount',
                          render: ({ data }) => (
                            <p
                              className={cn(
                                'text-[11px] sm:text-[13px] lg:text-[15px]',
                                data.pv ? 'text-white' : 'text-red-500'
                              )}>
                              {formatAmount(data.pv)}
                            </p>
                          ),
                        },
                      ]}
                      showHeader={true}
                    />
                  </div>
                  {hasMoreRows && (
                    <div className="flex justify-center mt-3">
                      <button
                        type="button"
                        onClick={() => setShowAllRows(!showAllRows)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs lg:text-sm bg-[#202228] hover:bg-[#2A2C33] border border-[#2C2F3A] rounded-md text-white transition-colors duration-200 flex items-center gap-1 sm:gap-2">
                        {showAllRows ? (
                          <>
                            <span className="inline">Show Less</span>
                            <svg
                              className="w-2 h-2 rotate-180 sm:w-3 sm:h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span className="inline">Show All {stepDates.length} Rows</span>
                            <svg
                              className="w-2 h-2 sm:w-3 sm:h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
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
              setStepsFluxes([])
            }}>
            Reset list
          </Btn>
        )}
        <RecipientsListWithAccordion
          className="max-h-[25em] overflow-y-auto"
          filteredRecipients={filteredFluxes}
          tokenPriceUsd={tokenPriceUsd ?? 0}
          setRecipients={setStepsFluxes}
          tokenSymbol={tokenSymbol}
          emissionType="unlockInSteps"
        />
      </div>
    </div>
  )
}

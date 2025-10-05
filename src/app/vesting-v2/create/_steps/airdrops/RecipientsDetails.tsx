'use client'

import { Divider } from '@mantine/core'
import { toast } from 'react-toastify'

import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'

import { isAddress } from 'viem'

import { cn } from '@/src/src/utils'

import { AmountInputWithMaxAmount } from '../../../_components/AmountInputWithMaxAmount'
import { Btn } from '../../../_components/Btn'
import { ImportCsvButton } from '../../../_components/ImportCsvButton'
import { InputWithAddButton } from '../../../_components/InputWithAddButton'
import { RecipientsListWithAccordionAirdrop } from '../../../_components/RecipientsListWithAccordionAirdrop'
import { SearchInput } from '../../../_components/SearchInput'
import {
  getAmountAndDatePerStepWithFee,
  getNormalizedTokenAmount,
  getStepsUnixTimestamps,
} from '../../../_utils/utils'
import { AnyRecipient, EmissionTypeValue, useAirdropStore } from '../_hooks/useAirdropStore'
import { AddRecipientsButton } from './AddRecipientsButton'

type RecipientDetailsProps = {
  tokenSymbol: string
  tokenAmountUi: number
  tokenPriceUsd: number | null
  startDate: Date
  endDate: Date | null
  tokenDecimals: number
}

type ManualAddProps = {
  tokenSymbol: string
  remainingBalance: number
  hasInsufficientFunds: boolean
  tokenPriceUsd: number | null
  amount: number | null
  recipient: string | null
  setAmount: Dispatch<SetStateAction<number | null>>
  setRecipient: Dispatch<SetStateAction<string | null>>
  addRecipient: () => void
  tokenDecimals: number
  steps: number | null
}

type CsvImportProps = {
  csvFile: File | null
  setCsvFile: Dispatch<SetStateAction<File | null>>
  processCsv: () => void
}

type RecipientsListViewProps = {
  tokenSymbol: string
  recipients: AnyRecipient[]
  setRecipients: Dispatch<SetStateAction<AnyRecipient[]>>
  searchAddress: string | null
  setSearchAddress: Dispatch<SetStateAction<string | null>>
  startDate: Date
  endDate: Date | null
  steps: number | null
  emissionType: EmissionTypeValue
  tokenPriceUsd: number
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[20px] text-white">{children}</p>
}

function ManualAddSection({
  tokenSymbol,
  remainingBalance,
  hasInsufficientFunds,
  amount,
  setAmount,
  setRecipient,
  addRecipient,
  tokenPriceUsd,
  tokenDecimals,
  steps,
}: ManualAddProps) {
  const amountPerMonthNorm = (() => {
    if (!amount || !steps) return null
    const amountPerStep = ((amount ?? 0) * 10 ** 18) / (steps ?? 1) / 10 ** 18
    const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)
    return amountPerStepNorm
  })()
  return (
    <div className="flex w-full flex-col gap-y-[2em]">
      <div className="flex w-full flex-col gap-y-[1em]">
        <SectionTitle>Assign the same token amount to all addresses</SectionTitle>
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
        {typeof amountPerMonthNorm === 'number' && (
          <p
            className={cn('text-sm font-bold', amountPerMonthNorm ? 'text-white' : 'text-red-500')}>
            {amountPerMonthNorm} {tokenSymbol} per step
          </p>
        )}
        {hasInsufficientFunds && <p className="font-bold text-red-500">Insufficient funds</p>}
      </div>
      <div className="flex w-full flex-col gap-y-[1em]">
        <SectionTitle>Select recipients</SectionTitle>
        <InputWithAddButton
          onInputChange={(e) => {
            const address = e.currentTarget.value
            if (isAddress(address)) {
              setRecipient(address)
            }
          }}
          onAddClick={addRecipient}
        />
      </div>
    </div>
  )
}

function DividerOR() {
  return (
    <div className="w-full">
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
  )
}

function CsvImportSection({ csvFile, setCsvFile, processCsv }: CsvImportProps) {
  return (
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
          const csvData = `address,amount\n0xA4068Dcb282a1A957740c3E0E10AE7b588216dD8,1000`
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
      <AddRecipientsButton onClick={processCsv} />
    </div>
  )
}

function RecipientsListView({
  tokenSymbol,
  recipients,
  setRecipients,
  searchAddress,
  setSearchAddress,
  emissionType,
  endDate,
  startDate,
  steps,
  tokenPriceUsd,
}: RecipientsListViewProps) {
  const filteredRecipients = searchAddress
    ? recipients.filter((recipient) =>
        recipient.address.toLowerCase().includes(searchAddress.toLowerCase())
      )
    : recipients

  return (
    <div className="flex w-full lg:max-w-[246px] flex-col gap-y-[1rem]">
      <div className="flex items-end justify-between w-full">
        <SectionTitle>Recipients list</SectionTitle>
        <p className="text-[13px] text-[#FFFFFF4D]">{filteredRecipients.length} Recipients</p>
      </div>
      <SearchInput
        placeholder="Search by address"
        search={searchAddress}
        setSearch={setSearchAddress}
      />
      {filteredRecipients.length > 0 && (
        <Btn
          variant="red"
          onClick={() => {
            setRecipients([])
          }}>
          Reset list
        </Btn>
      )}
      <RecipientsListWithAccordionAirdrop
        className="max-h-[25em] overflow-y-auto"
        filteredRecipients={recipients.map((filteredRecipient) => ({
          ...filteredRecipient,
          startDate,
          endDate,
          steps: steps ?? undefined,
        }))}
        tokenPriceUsd={tokenPriceUsd ?? 0}
        setRecipients={setRecipients}
        tokenSymbol={tokenSymbol}
        emissionType={emissionType}
      />
    </div>
  )
}

type AddRecipientsFormProps = {
  tokenSymbol: string
  tokenAmountUi: number
  tokenPriceUsd: number | null
  recipients: AnyRecipient[]
  setRecipients: (recipients: AnyRecipient[]) => void
  amount: number | null
  setAmount: Dispatch<SetStateAction<number | null>>
  recipient: string | null
  setRecipient: Dispatch<SetStateAction<string | null>>
  csvFile: File | null
  setCsvFile: Dispatch<SetStateAction<File | null>>
  steps: number | null
  startDate: Date | null
  endDate: Date | null
  tokenDecimals: number
}

function AddRecipientsForm({
  tokenSymbol,
  tokenAmountUi,
  recipients,
  setRecipients,
  amount,
  setAmount,
  recipient,
  setRecipient,
  csvFile,
  setCsvFile,
  tokenPriceUsd,
  endDate,
  startDate,
  steps,
  tokenDecimals,
}: AddRecipientsFormProps) {
  const remainingBalance = useMemo(() => {
    if (typeof tokenAmountUi !== 'number') return 0
    return tokenAmountUi - recipients.reduce((acc, { amount }) => acc + amount, 0)
  }, [tokenAmountUi, recipients])

  const totalAmount = getStepDates().at(-1)?.pv ?? 0

  function getStepDates() {
    if (!startDate || !endDate || !steps || !tokenDecimals) {
      return []
    }
    const datesUnix = getStepsUnixTimestamps(startDate, endDate, steps)
    const amountPerStep = ((amount ?? 0) * 10 ** 18) / (steps ?? 1) / 10 ** 18
    const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)
    return getAmountAndDatePerStepWithFee(amountPerStepNorm, datesUnix).map((e) => ({
      name: new Date(e.date * 1000),
      pv: Number(e.amount),
    }))
  }

  const hasInsufficientFunds =
    (!!amount && !!(remainingBalance < amount)) ||
    (!!totalAmount && !!(remainingBalance < totalAmount))

  function addRecipient() {
    try {
      if (hasInsufficientFunds) {
        throw new Error('Insufficient funds')
      }
      if (!recipient) {
        throw new Error('Address is required')
      }
      if (!isAddress(recipient)) {
        throw new Error('Invalid public key address')
      }
      if (!amount) {
        throw new Error('Amount is required')
      }
      if (recipients.some(({ address }) => address === recipient)) {
        throw new Error('Address already added')
      }
      if (steps) {
        const amountPerStep = ((amount ?? 0) * 10 ** 18) / (steps ?? 1) / 10 ** 18
        const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)
        if (!amountPerStepNorm) {
          throw new Error('Amount per step cannot be zero')
        }
      }

      const newRecipients = [...recipients, { address: recipient, amount, isCompleted: false }]
      setRecipients(newRecipients)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An error occurred')
    }
  }

  function processCSV() {
    if (!csvFile) {
      toast.error('Add a CSV file to import recipients')
      return
    }
    const reader = new FileReader()

    reader.onload = () => {
      const text = reader.result as string
      const lines = text
        .split('\n')
        .filter((line) => line.trim() !== '')
        .filter((line) => !line.startsWith('address,amount') && !line.startsWith('address;amount'))
        .map((line) => line.trim())
      const newRecipients = lines
        .map((line) => {
          const [address, amount] = line.includes(',') ? line.split(',') : line.split(';')
          const num = Number(amount)
          if (!address || !isAddress(address) || !num || isNaN(num)) return null
          return {
            address,
            amount: num,
            isCompleted: false,
          }
        })
        .filter((x) => x != null) as AnyRecipient[]

      if (new Set(newRecipients.map((e) => e.address)).size !== newRecipients.length) {
        toast.error('Some CSV lines have duplicate addresses, please review your CSV file')
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
        new Set([...recipients.map((e) => e.address), ...newRecipients.map((e) => e.address)])
          .size !==
        recipients.length + newRecipients.length
      ) {
        toast.error('Some recipients are already in the list')
        return
      }

      setRecipients([...recipients, ...newRecipients])
    }

    reader.readAsText(csvFile)
  }

  return (
    <div className="flex w-full lg:max-w-[430px] flex-col items-start gap-x-[1rem] gap-y-[0.7rem]">
      <ManualAddSection
        tokenSymbol={tokenSymbol}
        remainingBalance={remainingBalance}
        hasInsufficientFunds={hasInsufficientFunds}
        amount={amount}
        recipient={recipient}
        setAmount={setAmount}
        setRecipient={setRecipient}
        addRecipient={addRecipient}
        tokenPriceUsd={tokenPriceUsd}
        tokenDecimals={tokenDecimals}
        steps={steps}
      />
      <DividerOR />
      <CsvImportSection csvFile={csvFile} setCsvFile={setCsvFile} processCsv={processCSV} />
    </div>
  )
}

export function RecipientsDetails({
  tokenSymbol,
  tokenAmountUi,
  tokenPriceUsd,
  endDate,
  startDate,
  tokenDecimals,
}: RecipientDetailsProps) {
  const {
    recipients,
    stepsRecipients,
    linearRecipients,
    emissionType,
    setScheduledRecipients,
    setStepsRecipients,
    setLinearRecipients,
    steps,
  } = useAirdropStore((s) => ({
    recipients: s.recipients,
    stepsRecipients: s.stepsRecipients,
    linearRecipients: s.linearRecipients,

    emissionType: s.emissionType,
    setScheduledRecipients: s.setScheduledRecipients,
    setStepsRecipients: s.setStepsRecipients,
    setLinearRecipients: s.setLinearRecipients,
    steps: s.steps,
  }))

  const [recipient, setRecipient] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(null)
  const [searchAddress, setSearchAddress] = useState<string | null>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)

  const handleSetRecipients = (
    newRecipients: AnyRecipient[] | ((prev: AnyRecipient[]) => AnyRecipient[])
  ) => {
    if (emissionType.value === 'scheduled') {
      setScheduledRecipients(newRecipients)
    } else if (emissionType.value === 'unlockInSteps' && steps) {
      setStepsRecipients(newRecipients)
    } else if (emissionType.value === 'linear') {
      setLinearRecipients(newRecipients)
    }
  }

  const recipientsToShow =
    emissionType.value === 'unlockInSteps'
      ? stepsRecipients
      : emissionType.value === 'linear'
        ? linearRecipients
        : recipients

  return (
    <div className="flex w-full flex-col lg:flex-row items-start gap-x-[1rem] gap-y-[2rem]">
      <AddRecipientsForm
        tokenSymbol={tokenSymbol}
        tokenAmountUi={tokenAmountUi}
        recipients={recipientsToShow}
        setRecipients={handleSetRecipients}
        amount={amount}
        setAmount={setAmount}
        recipient={recipient}
        setRecipient={setRecipient}
        csvFile={csvFile}
        setCsvFile={setCsvFile}
        tokenPriceUsd={tokenPriceUsd}
        steps={steps}
        startDate={startDate}
        endDate={endDate}
        tokenDecimals={tokenDecimals}
      />
      <RecipientsListView
        tokenSymbol={tokenSymbol}
        recipients={recipientsToShow}
        setRecipients={handleSetRecipients}
        searchAddress={searchAddress}
        setSearchAddress={setSearchAddress}
        emissionType={emissionType.value}
        tokenPriceUsd={tokenPriceUsd ?? 0}
        startDate={startDate}
        endDate={endDate}
        steps={steps}
      />
    </div>
  )
}

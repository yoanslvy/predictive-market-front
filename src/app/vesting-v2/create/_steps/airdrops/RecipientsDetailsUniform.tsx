'use client'

import { Divider } from '@mantine/core'
import { toast } from 'react-toastify'

import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'

import { isAddress } from 'viem'

import { AmountInputWithBalanceReadOnly } from '../../../_components/AmountInputWithBalanceReadOnly'
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
import {
  AnyRecipient,
  EmissionTypeValue,
  Recipient,
  useAirdropStore,
} from '../_hooks/useAirdropStore'
import { AddRecipientsButton } from './AddRecipientsButton'

type RecipientDetailsProps = {
  tokenSymbol: string
  tokenAmountUi: number
  tokenPriceUsd: number | null
  airdropTokenAmountUi: number
  startDate: Date
  endDate: Date | null
  tokenDecimals: number
}

type ManualAddProps = {
  tokenSymbol: string
  remainingBalance: number
  hasInsufficientFunds: boolean
  tokenPriceUsd: number | null
  recipient: string | null
  setRecipient: Dispatch<SetStateAction<string | null>>
  addRecipient: () => void
  airdropTokenAmountUi: number
  steps: number | null
  tokenDecimals: number
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
  setRecipient,
  addRecipient,
  tokenPriceUsd,
  airdropTokenAmountUi,
}: ManualAddProps) {
  return (
    <div className="flex w-full flex-col gap-y-[2em]">
      <div className="flex w-full flex-col gap-y-[1em]">
        <SectionTitle>Token Amount per Recipient</SectionTitle>
        <AmountInputWithBalanceReadOnly
          hasInsufficientFunds={hasInsufficientFunds}
          tokenPriceUsd={tokenPriceUsd}
          balance={airdropTokenAmountUi}
          tokenSymbol={tokenSymbol}
        />

        <SectionTitle>Remaining Balance</SectionTitle>
        <AmountInputWithBalanceReadOnly
          hasInsufficientFunds={hasInsufficientFunds}
          tokenPriceUsd={tokenPriceUsd}
          balance={remainingBalance}
          tokenSymbol={tokenSymbol}
        />
        {hasInsufficientFunds && <p className="font-bold text-red-500">Insufficient funds</p>}
      </div>
      <Divider className="w-full" color="#202228" />
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
  recipients: Recipient[]
  setRecipients: (recipients: Recipient[]) => void
  recipient: string | null
  setRecipient: Dispatch<SetStateAction<string | null>>
  csvFile: File | null
  setCsvFile: Dispatch<SetStateAction<File | null>>
  airdropTokenAmountUi: number
  steps: number | null
  startDate: Date | null
  endDate: Date | null
  tokenDecimals: number
  emissionType: EmissionTypeValue
}

function AddRecipientsForm({
  tokenSymbol,
  tokenAmountUi,
  recipients,
  setRecipients,
  recipient,
  setRecipient,
  csvFile,
  setCsvFile,
  tokenPriceUsd,
  airdropTokenAmountUi,
  endDate,
  startDate,
  steps,
  tokenDecimals,
  emissionType,
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
    const amountPerStep = ((airdropTokenAmountUi ?? 0) * 10 ** 18) / (steps ?? 1) / 10 ** 18
    const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)

    return getAmountAndDatePerStepWithFee(amountPerStepNorm, datesUnix).map((e) => ({
      name: new Date(e.date * 1000),
      pv: Number(e.amount),
    }))
  }

  const hasInsufficientFunds =
    (!!airdropTokenAmountUi && !!(remainingBalance < airdropTokenAmountUi)) ||
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

      if (recipients.some(({ address }) => address === recipient)) {
        throw new Error('Address already added')
      }

      if (emissionType === 'unlockInSteps') {
        if (!steps) return false
        if (typeof tokenDecimals !== 'number') return false
        for (const activeRecipient of recipients) {
          const amountPerStep = ((activeRecipient.amount ?? 0) * 10 ** 18) / (steps ?? 1) / 10 ** 18
          const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)
          if (!amountPerStepNorm) {
            throw new Error('Amount cannot be 0')
          }
        }
      }

      const newRecipients = [
        ...recipients,
        { address: recipient, amount: airdropTokenAmountUi, isCompleted: false },
      ]
      setRecipients(newRecipients)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'An error occurred')
    }
  }

  function processCSV() {
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
          return {
            address,
            amount: airdropTokenAmountUi,
            isCompleted: false,
          }
        })
        .filter((x) => x != null) as Recipient[]

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
        recipient={recipient}
        setRecipient={setRecipient}
        addRecipient={addRecipient}
        tokenPriceUsd={tokenPriceUsd}
        airdropTokenAmountUi={airdropTokenAmountUi}
        steps={steps}
        tokenDecimals={tokenDecimals}
      />
      <DividerOR />
      <CsvImportSection csvFile={csvFile} setCsvFile={setCsvFile} processCsv={processCSV} />
    </div>
  )
}

export function RecipientsDetailsUniform({
  tokenSymbol,
  tokenAmountUi,
  tokenPriceUsd,
  airdropTokenAmountUi,
  startDate,
  endDate,
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
        recipient={recipient}
        setRecipient={setRecipient}
        csvFile={csvFile}
        setCsvFile={setCsvFile}
        tokenPriceUsd={tokenPriceUsd}
        airdropTokenAmountUi={airdropTokenAmountUi}
        steps={steps}
        startDate={startDate}
        endDate={endDate}
        tokenDecimals={tokenDecimals}
        emissionType={emissionType.value}
      />
      <RecipientsListView
        tokenSymbol={tokenSymbol}
        recipients={recipientsToShow}
        setRecipients={handleSetRecipients}
        searchAddress={searchAddress}
        setSearchAddress={setSearchAddress}
        startDate={startDate}
        endDate={endDate}
        steps={steps}
        emissionType={emissionType.value}
        tokenPriceUsd={tokenPriceUsd ?? 0}
      />
    </div>
  )
}

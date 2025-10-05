import dayjs from 'dayjs'

import { Address, encodeFunctionData } from 'viem'

import { config } from '../../(providers)/wagmiConfig'
import { estimateGas, getBlock } from '@wagmi/core'

import { recipientHandlers, SimulationOptions } from '../create/_steps/_hooks/useAirdrop'

export function dateFormatter(date: Date, yearAsTwoDigit = false, includeTime = true): string {
  const timeStr = includeTime
    ? ` @ ${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`
    : ''

  if (yearAsTwoDigit) {
    const d = date
      .toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
      .split(' ')
    return `${d[0]} ${d[1]} ${d[2].slice(2)}${timeStr}`
  }

  const dateStr = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return `${dateStr}${timeStr}`
}

export function dateFormatterOnlyMonthAndYear(date: Date): string {
  const dateStr = date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .split(' ')
    .slice(1)
    .join(' ')

  return `${dateStr}`
}

export function downloadCsv(csvData: Blob, fileName: `${string}.csv`) {
  const csvURL = URL.createObjectURL(csvData)
  const link = document.createElement('a')
  link.href = csvURL
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function getUnlockedAmountForStep(stepNumber: number, amountPerStep: number): number {
  return stepNumber * amountPerStep
}

export function getUnlockedAmountForStepBI(stepNumber: number, amountPerStep: bigint): bigint {
  return BigInt(stepNumber) * amountPerStep
}

export function getStepsUnixTimestamps(startDate: Date, endDate: Date, steps: number): number[] {
  const datesUnix: number[] = []
  const timeDiff = (endDate.getTime() - startDate.getTime()) / 1000
  const stepTime = timeDiff / (steps - 1)
  for (let i = 0; i < steps; i++) {
    datesUnix.push(Number((startDate.getTime() / 1000 + stepTime * i).toFixed(0)))
  }
  return datesUnix
}

export function getAmountAndDatePerStepWithFee(
  amount: number,
  datesUnix: number[],
  amountWithFee?: number
) {
  return datesUnix.map((date, i, arr) => ({
    amount:
      i === arr.length - 1 && typeof amountWithFee === 'number'
        ? amountWithFee
        : getUnlockedAmountForStep(i + 1, amount),
    date,
  }))
}

export function getAmountAndDatePerStepWithFeeBI(
  amount: bigint,
  datesUnix: number[],
  amountWithFee?: bigint
) {
  return datesUnix.map((date, i, arr) => ({
    amount:
      i === arr.length - 1 && typeof amountWithFee === 'bigint'
        ? amountWithFee
        : getUnlockedAmountForStepBI(i + 1, amount),
    date,
  }))
}

export function getAmountAndDatePerMonthWithFee(
  amount: number,
  months: number,
  startDate: Date,
  amountWithFee?: number
) {
  return Array.from({ length: months }).map((_, i, arr) => ({
    amount:
      i === arr.length - 1 && typeof amountWithFee === 'number'
        ? amountWithFee
        : getUnlockedAmountForStep(i + 1, amount),
    date: Number(
      dayjs(startDate)
        .add(i + 1, 'month')
        .unix()
        .toFixed(0)
    ),
  }))
}

export function getAmountAndDatePerMonthWithFeeBI(
  amount: bigint,
  months: number,
  startDate: Date,
  amountWithFee?: bigint
) {
  return Array.from({ length: months }).map((_, i, arr) => ({
    amount:
      i === arr.length - 1 && typeof amountWithFee === 'bigint'
        ? amountWithFee
        : getUnlockedAmountForStepBI(i + 1, amount),
    date: Number(
      dayjs(startDate)
        .add(i + 1, 'month')
        .unix()
        .toFixed(0)
    ),
  }))
}

export const emissionTypeMapper = {
  LINEAR: 'Linear',
  TIME_LOCK: 'Timelock',
  MONTHLY_UNLOCKS: 'Monthly Unlocks',
  BACKWEIGHTED: 'Backweighted',
  UNLOCK_IN_STEPS: 'Unlock in Steps',
  CLIFF: 'Cliff',
  CLIFF_EXPONENTIAL: 'Cliff Exponential',
  UNLOCK_CLIFF: 'Unlock Cliff',
  EXPONENTIAL: 'Exponential',
  SCHEDULED: 'Scheduled',
}

export const formatAmount = (amount: number) => formatTokenAmountWithDecimals(amount)

export function formatTokenAmountWithDecimals(amount: number): string {
  if (amount < 0.000001 && amount > 0) {
    return amount.toExponential(2)
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: amount < 1 ? 6 : amount < 1000 ? 4 : 2,
  }).format(amount)

  return formatted
}

export const mintNftWarning =
  'Minting the NFT lets you view your vesting details via its dynamic metadata. Please keep it safe—losing the NFT means you won’t be able to claim your vested tokens.'

export function computeAmountWithFeeBI(
  amount: bigint,
  feePercentage: number,
  tokenDecimals: number
): bigint {
  const basisPoints = BigInt(Math.floor(feePercentage * 10 ** tokenDecimals)) // Convert percentage to basis points, considering token decimals
  const totalBasisPoints = BigInt(10 ** tokenDecimals)

  return (amount * totalBasisPoints) / (totalBasisPoints - basisPoints)
}

export function paginate<T>(items: T[], pageNumber: number, pageSize: number): T[] {
  const startIndex = (pageNumber - 1) * pageSize
  return items.slice(startIndex, startIndex + pageSize)
}

export const MAX_RECIPIENTS_PER_BATCH = 50
export const MAX_STEPS_PER_BATCH = 300
export const MIN_STEPS_PER_BATCH = 2

export function createBatchesWithSteps<T>(array: T[], steps: number): T[][] {
  const batches: T[][] = []
  let batch: T[] = []
  let stepsCount = 0
  for (const r of array) {
    if (batch.length >= MAX_RECIPIENTS_PER_BATCH || stepsCount + steps > MAX_STEPS_PER_BATCH) {
      batches.push(batch)
      batch = []
      stepsCount = 0
    }
    batch.push(r)
    stepsCount += steps
  }
  if (batch.length > 0) batches.push(batch)
  return batches
}

export async function createBatches<
  T extends {
    address: string
    amount: number
    isCompleted: boolean
  },
>(
  array: T[],
  flatFee: bigint,
  contract: Address,
  chainId: number,
  simulationOptions: SimulationOptions,
  feePercentageValue: bigint,
  recipientHandler: (typeof recipientHandlers)[keyof typeof recipientHandlers]
): Promise<T[][]> {
  const { gasLimit } = await getBlock(config, {
    blockTag: 'latest',
    chainId,
  })

  let batchSize = array.length
  let batches: T[][] = []
  let fits = false

  while (!fits && batchSize > 0) {
    batches = []
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize))
    }

    // Simulate and estimate gas for the first batch as a proxy
    const batch = batches[0]
    try {
      const simulateCreateVesting = await recipientHandler(
        batch,
        simulationOptions,
        Number(feePercentageValue),
        flatFee
      )
      const data = encodeFunctionData(simulateCreateVesting.request)

      const _gas = await estimateGas(config, {
        to: contract,
        value: flatFee,
        chainId,
        data,
      })

      const gas = (_gas * BigInt(13)) / BigInt(10)

      if (gas < gasLimit) {
        fits = true
      } else {
        batchSize = Math.floor(batchSize / 2)
      }
    } catch (err) {
      console.error(err)
      batchSize = Math.floor(batchSize / 2)
    }
  }

  return batches
}

export function getNormalizedTokenAmount(amount: number, decimals: number): number {
  return Number(amount * 10 ** decimals) < 1 && Number(amount * 10 ** decimals) % 1 !== 0
    ? 0
    : Number(amount.toFixed(decimals))
}

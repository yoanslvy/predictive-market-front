import { Pickaxe, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { ErrorBoundary } from 'react-error-boundary'
import 'server-only'

import { formatEther } from 'viem'

import Table from '@modules/Table'
import TokenAsset from '@modules/TokenAsset'
import Value from '@modules/Value'

import Pagination from '@/src/components/modules/Pagination'
import Etherscan from '@/src/images/apps/etherscan.svg'

import { Forbidden } from '../../_svg/Forbidden'
import { Payout } from '../../_svg/Payout'
import { Transfer } from '../../_svg/Transfer'
import { Withdrawal } from '../../_svg/Withdrawal'
import TokenTableError from './error'

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

export function paginate<T>(items: T[], pageNumber: number, pageSize: number): T[] {
  const startIndex = (pageNumber - 1) * pageSize
  return items.slice(startIndex, startIndex + pageSize)
}

export const truncate = (fullStr: string, strLen: number, separator: string) => {
  if (fullStr.length <= strLen) return fullStr

  separator = separator || '&hellip;'

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2)

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars)
}

type Props = {
  page?: number
  filter?: string
  entriesPerPage: number
  wallet?: string
  chainId?: number
  creationTx?: {
    creationTimestamp: string
    txnHash: string
    amount: string
    token: string
  }
}

type FluxType = 'stop' | 'claim' | 'transfer' | 'topup' | 'create' | 'NFT Mint'

function TypeIcon({ type }: { type: FluxType }) {
  if (type === 'create') {
    return <PlusIcon color="#30333C" size={20} />
  }
  if (type === 'NFT Mint') {
    return <Pickaxe color="#30333C" size={20} />
  }
  if (type === 'topup') {
    return <Payout />
  }
  if (type === 'claim') {
    return <Withdrawal />
  }
  if (type === 'stop') {
    return <Forbidden />
  }
  return <Transfer />
}

export default async function FluxTxTableServer({
  page,
  filter,
  entriesPerPage,
  chainId,
  wallet,
  creationTx,
}: Props) {
  const filteredEvents = [0]
    .map(() => {
      const vestingCreated = {
        type: 'create',
        timestamp: +creationTx?.creationTimestamp! as number,
        amount: creationTx?.amount,
        txHash: creationTx?.txnHash,
        token: creationTx?.token,
        preValue: null,
        postValue: null,
      } as const

      return [vestingCreated]
    })
    .flat()
    .sort((a, b) => b.timestamp - a.timestamp) // sort descending by timestamp

  return (
    <ErrorBoundary fallback={<TokenTableError />}>
      <Table
        isLoading={false}
        columns={[
          {
            title: 'Action',
            render: ({ data }) => (
              <div className="flex items-center gap-x-[0.5rem]">
                <TypeIcon type={data.type} />
                <Value value={data.type} size="sm" prefix="" className="capitalize" />
              </div>
            ),
          },
          {
            title: 'Date',
            render: ({ data }) => (
              <Value
                className="min-w-[160px] w-[160px]"
                value={dateFormatter(new Date(data.timestamp))}
                size="sm"
                prefix=""
              />
            ),
          },
          {
            title: 'Amount',
            render: ({ data }) =>
              'amount' in data &&
              data.amount && (
                <Value
                  value={formatEther(BigInt(data.amount))}
                  size="sm"
                  prefix=""
                  className="capitalize"
                />
              ),
          },
          // {
          //   title: 'Pre-value',
          //   render: ({ data }) =>
          //     'preValue' in data && data.preValue ? (
          //       <Value value={formatAmount(Number(data.preValue))} size="sm" />
          //     ) : 'from' in data && data.from ? (
          //       <Value value={data.from} size="sm" />
          //     ) : null,
          // },
          // {
          //   title: 'Post-value',
          //   render: ({ data }) =>
          //     'postValue' in data && data.postValue ? (
          //       <Value value={formatAmount(Number(data.postValue))} size="sm" />
          //     ) : 'to' in data && data.to ? (
          //       <Value value={data.to} size="sm" />
          //     ) : null,
          // },
          {
            title: 'Token',
            render: ({ data }) => {
              return (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={'/'}
                  className="flex items-center gap-x-[0.5rem]">
                  <TokenAsset
                    chainId={1}
                    address={data.token!}
                    name={'Token'}
                    symbol={'TKN'}
                    size="xs"
                  />
                </Link>
              )
            },
          },
          {
            title: 'Transaction Hash',
            render: ({ data }) =>
              data.txHash && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://sepolia.etherscan.io/tx/${data.txHash}`}
                  className="flex items-center gap-x-[0.5rem]">
                  <Etherscan className="size-[1.4em]" />
                  <span className="text-[#F0F2FB] underline">
                    {truncate(data.txHash, 14, '...')}
                  </span>
                </Link>
              ),
          },
        ]}
        data={paginate(
          filteredEvents.map((e, idx) => ({ ...e, idx })),
          page ?? 1,
          entriesPerPage
        )}
      />
      <Pagination
        total={Number(filteredEvents.length)}
        perPage={Number(entriesPerPage)}
        page={page ? Number(page) : 1}
        pathname={`/vesting-v2/flux/${'123'}`}
        query={{ page: page, filter: filter, chain: '56' }}
        className="mt-[2em]"
      />
    </ErrorBoundary>
  )
}

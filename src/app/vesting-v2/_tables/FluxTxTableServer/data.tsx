import { Pickaxe, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { ErrorBoundary } from 'react-error-boundary'
import 'server-only'

import Table from '@modules/Table'
import TokenAsset from '@modules/TokenAsset'
import Value from '@modules/Value'

import { truncate } from '@/src/app/grants/grant/components/GrantDetails'
import { Forbidden } from '@/src/app/vesting-v2/_svg/Forbidden'
import { Payout } from '@/src/app/vesting-v2/_svg/Payout'
import { Transfer } from '@/src/app/vesting-v2/_svg/Transfer'
import { Withdrawal } from '@/src/app/vesting-v2/_svg/Withdrawal'
import { dateFormatter, formatAmount, paginate } from '@/src/app/vesting-v2/_utils/utils'
import Pagination from '@/src/components/modules/Pagination'
import Etherscan from '@/src/images/apps/etherscan.svg'

import TokenTableError from './error'

type Props = {
  page?: number
  filter?: string
  entriesPerPage: number
  wallet?: string
  chainId?: number
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
}: Props) {
  const filteredEvents = [0]
    .map((pool) => {
      const vestingCreated = {
        type: 'create',
        timestamp: 0,
        amount: 10,
        txHash: '0x12ddddddddddddddddd3',
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
                value={dateFormatter(new Date(data.timestamp * 1000))}
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
                  value={formatAmount(Number(data.amount))}
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
                    address={'0x12ddddddddddddddddd3'}
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
                  href={`${'/'}`}
                  className="flex items-center gap-x-[0.5rem]">
                  <Etherscan className="size-[1.4em]" />
                  <span className="text-[#F0F2FB] underline">
                    {truncate(data.txHash, 12, '...')}
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

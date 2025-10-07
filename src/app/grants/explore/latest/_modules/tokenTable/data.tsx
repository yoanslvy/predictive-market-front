import Link from 'next/link'

import { formatUnits } from 'viem'

import Table from '@modules/Table'
import Tag from '@modules/Tag'
import Value from '@modules/Value'

import { getAllGrants, getGrant } from '@/src/app/server/getAllGrants'
import Pagination from '@/src/components/modules/Pagination'
import Etherscan from '@/src/images/apps/etherscan.svg'
import { getAllGrantsDatasByChainFetcherCached } from '@/src/server/fetchers/getAllGrants'

import EtherscanLink from '../../../_components/CollateralToken'

export type Grants = {
  amount: string
  chainId: number
  conditionId: string
  creationBlockNumber: number
  creationTimestamp: number
  creatorId: string
  grantId: string
  id: string
  txnHash: string
  success: boolean
  resolved: boolean
  recipientId: string
  questionId: string
  questionEntity: {
    question: string
    minBond: string
    contentHash: string
    openingTs: number
    nonce: string
    timeout: number
  }
  recipient: {
    walletAddress: string
  }
  creator: {
    walletAddress: string
  }
}

export const shortenEthAddress = (address: string, startLength?: number, endLength?: number) =>
  `${address?.substring(0, startLength || 5)}...${address?.substring(38 - (endLength || 1))}`

export function timeDifference(timestamp: number): string {
  const now: Date = new Date()
  const targetDate: Date = new Date(timestamp)
  const isFuture: boolean = targetDate.getTime() > now.getTime()
  const seconds: number = Math.abs(Math.floor((targetDate.getTime() - now.getTime()) / 1000))
  const minutes: number = Math.floor(seconds / 60)
  const hours: number = Math.floor(minutes / 60)
  const days: number = Math.floor(hours / 24)

  // Calculate months using average days per month
  const totalMonths: number = Math.floor(days / 30.44)

  // Convert months to years and remaining months
  const years: number = Math.floor(totalMonths / 12)
  const months: number = totalMonths % 12

  if (years > 0) {
    if (months > 0) {
      return isFuture
        ? `in ${years} ${years === 1 ? 'year' : 'years'} and ${months} ${
            months === 1 ? 'month' : 'months'
          }`
        : `${years} ${years === 1 ? 'year' : 'years'} and ${months} ${
            months === 1 ? 'month' : 'months'
          } ago`
    } else {
      return isFuture
        ? `in ${years} ${years === 1 ? 'year' : 'years'}`
        : `${years} ${years === 1 ? 'year' : 'years'} ago`
    }
  } else if (months > 0) {
    return isFuture
      ? `in ${months} ${months === 1 ? 'month' : 'months'}`
      : `${months} ${months === 1 ? 'month' : 'months'} ago`
  } else if (days > 0) {
    return isFuture
      ? `in ${days} ${days === 1 ? 'day' : 'days'}`
      : `${days} ${days === 1 ? 'day' : 'days'} ago`
  } else if (hours > 0) {
    return isFuture
      ? `in ${hours} ${hours === 1 ? 'hour' : 'hours'}`
      : `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  } else if (minutes > 0) {
    return isFuture
      ? `in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
      : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  } else {
    return isFuture
      ? `in ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
      : `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`
  }
}

type Grant = {
  grantId: string
  collateralToken: string
  conditionId: string
  questionId: string
  amount: string
  recipient: string
  resolved: string
  question: string
  deadline: string
  bond: bigint
  minBond: bigint
}

export default async function TokenTableServer({
  props,
}: {
  props: {
    chain?: string | null
    page: string
    filter: string | null
    entriesPerPage: string
  }
}) {
  // Pass search params from parent here, in no params then load default (page 1)

  const allGrantsId = await getAllGrantsDatasByChainFetcherCached({ chain: '11155111' })

  console.log('grantss', allGrantsId)

  const grants = (await Promise.all(
    allGrantsId.conditional_grants.map(async (grant) => {
      const grantData = await getGrant(grant.grantId)
      return grantData as Grant
    })
  )) as Grant[]

  return (
    <>
      <Table
        rowHref={(data) => {
          return `/grants/grant?grantId=${data?.grantId}&question=${data?.question}&bond=${data?.bond.toString()}&openingTime=${data?.deadline}&resolved=${data?.resolved}&minBond=${data?.minBond.toString()}&recipient=${data?.recipient}`
        }}
        isLoading={false}
        columns={[
          {
            title: 'Grant Condition',
            render: ({ data }) => <Tag type={'info'}>{data.question}</Tag>,
          },
          {
            title: 'Opening time',
            render: ({ data }) =>
              !!data?.resolved ? 'Resolved' : timeDifference(Number(data.deadline) * 1000),
          },

          /*    {
            render: ({ data }) => (
              <Value value={Number(data.lockedPercent).toFixed()} suffix="%" size="sm" />
            ),
          }, 
           */

          {
            title: 'Reward token',
            render: ({ data }) => (
              <EtherscanLink
                address={data.collateralToken}
                shortenedAddress={shortenEthAddress(data.collateralToken)}
              />
            ),
          },

          {
            title: 'Reward Amount',
            type: 'number',
            render: ({ data }) => (
              <Value
                value={formatUnits(BigInt(data.amount), 18)} // Remove formatter.format
                size="md"
              />
            ),
          },
        ]}
        data={paginate(grants, Number(props.page), Number(props.entriesPerPage))}
      />
      <Pagination
        total={Number(grants.length)}
        perPage={Number(props.entriesPerPage)}
        page={props.page ? Number(props.page) : 1}
        pathname={`/grants/explore/latest`}
        query={{ page: props.page, filter: props.filter, chain: props.chain }}
      />
    </>
  )
}

function paginate<T>(items: T[], pageNumber: number, pageSize: number): T[] {
  // Calculate the starting index of the items on the requested page
  const startIndex = (pageNumber - 1) * pageSize
  // Slice the array to get only the items for the requested page
  return items.slice(startIndex, startIndex + pageSize)
}

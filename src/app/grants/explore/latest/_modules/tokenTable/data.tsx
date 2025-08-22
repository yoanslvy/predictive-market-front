'server-only'

import { formatUnits } from 'viem'

import Table from '@modules/Table'
import Tag from '@modules/Tag'
import Value from '@modules/Value'

import { getAllGrants, getGrant } from '@/src/app/server/getAllGrants'
import Pagination from '@/src/components/modules/Pagination'
import { timeDifference } from '@/src/utils/global'

export const shortenEthAddress = (address: string, startLength?: number, endLength?: number) =>
  `${address?.substring(0, startLength || 5)}...${address?.substring(58 - (endLength || 1))}`

const now = new Date()

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

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

  const allGrantsId = (await getAllGrants()) as string[]

  const grants = (await Promise.all(
    allGrantsId.map(async (grantId) => {
      const grantData = await getGrant(grantId)
      return grantData as Grant
    })
  )) as Grant[]

  return (
    <>
      <Table
        rowHref={(data) => {
          return '/'
          /*           return `/lockers/univ${data.version.toString()}/chain/${data.chain}/address/${data.id}`
           */
        }}
        isLoading={false}
        columns={[
          {
            title: 'Grant ID',
            render: ({ data }) => (
              <>
                <div className="justify-between items-center flex w-fit">
                  <Tag className="ml-3" type={'comment'}>
                    {shortenEthAddress(data.grantId)}
                  </Tag>
                </div>
              </>
            ),
          },
          {
            title: 'Question',
            render: ({ data }) => <Tag type={'info'}>{data.question}</Tag>,
          },
          {
            title: 'Deadline',
            render: ({ data }) => timeDifference(Number(data.deadline) * 1000),
          },

          /*    {
            title: 'Locked %',
            type: 'number',
            render: ({ data }) => (
              <Progress
                value={data.lockedPercent}
                max={100}
                min={0}
                low={30}
                optimum={90}
                high={64}
                block
              />
            ),
          }, */

          /*    {
            render: ({ data }) => (
              <Value value={Number(data.lockedPercent).toFixed()} suffix="%" size="sm" />
            ),
          }, 

          {
            title: 'Unlock Date',
            render: ({ data }) => '∞',
          },
          */

          {
            title: 'Amount',
            type: 'number',
            render: ({ data }) => (
              <Value
                value={formatUnits(BigInt(data.amount), 18)} // Remove formatter.format
                prefix="$"
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
        pathname={`/lockers/explore/latest`}
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

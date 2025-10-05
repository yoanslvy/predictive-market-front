import * as z from 'zod'

import { fluxesPagedCached } from '@/src/server/fetchers/vesting-v2/fluxesPaged'
import { groupsOwnedByUserPagedCached } from '@/src/server/fetchers/vesting-v2/groupsOwnedByUser'
import { inflowsPerMonthCached } from '@/src/server/fetchers/vesting-v2/inflowsPerMonth'

import { shortenEthAddress } from '../../minter/global'
import { Analytics } from '../_views/Analytics'
import { IncorrectParams } from '../create/_steps/_components/IncorrectParams'

async function getInflows(userWallet: string) {
  try {
    const { vestingV2_inflowsPerMonths } = await inflowsPerMonthCached(userWallet, 30)

    const emissions = vestingV2_inflowsPerMonths
      .reduce(
        (acc, item) => {
          const date = new Date(item.date)
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

          const existingMonth = acc.find((entry) => entry.monthKey === monthKey)

          if (existingMonth) {
            existingMonth.pv += item.amountReleasedUSD
          } else {
            acc.push({
              name: date,
              monthKey,
              pv: item.amountReleasedUSD,
            })
          }

          return acc
        },
        [] as Array<{ name: Date; monthKey: string; pv: number }>
      )
      .map(({ name, pv }) => ({ name, pv: Math.floor(pv) }))
    return {
      distribution: {
        totalAmount: Math.floor(Math.random() * 100000000),
        distributedAmount: Math.floor(Math.random() * 10000000),
        availableAmount: Math.floor(Math.random() * 10000000),
      },
      tokenName: 'USD',
      tokenAddress: 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump',
      recipient: {
        address: '0x' + crypto.getRandomValues(new Uint8Array(32)).toString(),
        groups: ['salary', 'contractor'],
      },
      vesting: {
        startDate: new Date(),
        endDate: new Date(),
        nextUnlockDate: new Date(),
        unlocksLeft: Math.floor(Math.random() * 100),
        totalDuration: Math.floor(Math.random() * 100),
        daysLeft: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
      },
      emissions,
    }
  } catch (err) {
    console.error({
      location: 'vestingStatsRouter.getFluxDetails',
      name: err instanceof Error ? err.name : 'Error',
      message: err instanceof Error ? err.message : 'An error occurred',
    })
    throw err
  }
}
async function getOutgoingFluxes(userWallet: string) {
  try {
    const { vestingV2_vestings } = await fluxesPagedCached(100, 1, userWallet, 30)

    // Aggregate data by beneficiary
    const aggregatedData = new Map<
      string,
      {
        source: string
        target: string
        value: number
        fullSource: string
        fullTarget: string
        tokenSymbol: string
      }
    >()

    vestingV2_vestings.forEach((vesting) => {
      const beneficiaryAddress = vesting.beneficiaryId.split('-')[1].toLowerCase()
      const key = beneficiaryAddress

      const value =
        typeof vesting.amountBD === 'number'
          ? vesting.amountBD
          : parseFloat(vesting.amountBD || '0')

      if (aggregatedData.has(key)) {
        // Add to existing beneficiary
        const existing = aggregatedData.get(key)!
        existing.value += value
      } else {
        // Create new beneficiary entry
        aggregatedData.set(key, {
          source: shortenEthAddress(userWallet.toUpperCase()),
          target: shortenEthAddress(beneficiaryAddress),
          value: value,
          fullSource: userWallet.toUpperCase() + 1,
          fullTarget: beneficiaryAddress,
          tokenSymbol: vesting.tokenVested?.symbol || 'Unknown',
        })
      }
    })

    return Array.from(aggregatedData.values())
  } catch (err) {
    console.error({
      location: 'analytics.getOutgoingFluxes',
      name: err instanceof Error ? err.name : 'Error',
      message: err instanceof Error ? err.message : 'An error occurred',
    })
    return []
  }
}

function getOutflows() {
  try {
    const today = new Date()

    const createDateArray = () => {
      const emissions: {
        name: Date
        pv?: number
      }[] = []

      for (let i = 7; i > 0; i--) {
        const date = new Date()
        date.setDate(today.getDate() - i)

        emissions.push({
          name: date,
          pv: Math.floor(Math.random() * 100) + 50,
        })
      }
      emissions.push({
        name: new Date(),
        pv: Math.floor(Math.random() * 100) + 50,
      })
      for (let i = 1; i <= 3; i++) {
        const date = new Date()
        date.setDate(today.getDate() + i)
        const val = Math.floor(Math.random() * 100) + 30
        if (i === 1) {
          emissions.push({
            name: date,
            pv: val,
          })
          continue
        }
        emissions.push({
          name: date,
          pv: val,
        })
      }
      return emissions
    }

    const emissions = createDateArray()
    return {
      distribution: {
        totalAmount: Math.floor(Math.random() * 100000000),
        distributedAmount: Math.floor(Math.random() * 10000000),
        availableAmount: Math.floor(Math.random() * 10000000),
      },
      tokenName: 'USDT',
      tokenAddress: 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump',
      recipient: {
        address: '0x' + crypto.getRandomValues(new Uint8Array(32)).toString(),
        groups: ['salary', 'contractor'],
      },
      vesting: {
        startDate: new Date(),
        endDate: new Date(),
        nextUnlockDate: new Date(),
        unlocksLeft: Math.floor(Math.random() * 100),
        totalDuration: Math.floor(Math.random() * 100),
        daysLeft: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
      },
      emissions,
    }
  } catch (err) {
    console.error({
      location: 'vestingStatsRouter.getFluxDetails',
      name: err instanceof Error ? err.name : 'Error',
      message: err instanceof Error ? err.message : 'An error occurred',
    })
    throw err
  }
}

const searchParamsSchema = z.object({
  wallet: z.string(),
})

type Props = {
  searchParams: z.infer<typeof searchParamsSchema>
}

export default async function AnalyticsPage({ searchParams }: Props) {
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams)
  if (!parsedSearchParams.success) {
    return <IncorrectParams />
  }
  const inflows = await getInflows(parsedSearchParams.data.wallet)
  const outflows = getOutflows()
  const outgoingFluxes = await getOutgoingFluxes(parsedSearchParams.data.wallet)
  const groups = await groupsOwnedByUserPagedCached(parsedSearchParams.data.wallet, 30)

  return (
    <div className="page-content-no-pt">
      <Analytics
        inflows={inflows}
        outflows={outflows}
        outgoingFluxes={outgoingFluxes}
        groups={groups}
      />
    </div>
  )
}

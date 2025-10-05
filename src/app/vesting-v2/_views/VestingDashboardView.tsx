import Link from 'next/link'
import 'server-only'

import { cn } from '@/src/src/utils'

import { DashboardHeaderClient } from '../_components/DashboardHeaderClient'
import FluxesTable from '../dashboard/_modules/FluxesTable'

export type FluxDirection = 'fluxes' | 'airdrops'

type TabProps = {
  isActive: boolean
  name: string
  href: string
}

function DashboardTab({ isActive, name, href }: TabProps) {
  return (
    <Link href={href} className="flex gap-x-[1rem] text-white">
      <strong
        className={cn(
          'relative border-0 text-left font-semibold',
          isActive ? 'tab_underline text-green-500' : 'text-white'
        )}>
        {name}
      </strong>
    </Link>
  )
}

type TabNavProps = {
  activeTable: Props['table']
  wallet: string
  chainId: number
}

function TabNav({ activeTable, wallet, chainId }: TabNavProps) {
  const tabs: { table: Props['table']; name: string; href: string }[] = [
    {
      table: 'fluxes',
      name: 'Vesting',
      href: `/vesting-v2/dashboard/fluxes?wallet=${wallet}&chain=${chainId}`,
    },

    {
      table: 'airdrops',
      name: 'Airdrops',
      href: `/vesting-v2/dashboard/airdrops?wallet=${wallet}&chain=${chainId}`,
    },
  ]

  return (
    <div className="flex items-center gap-x-[1rem]">
      {tabs.map((tab) => (
        <DashboardTab
          key={tab.table}
          isActive={activeTable === tab.table}
          name={tab.name}
          href={tab.href}
        />
      ))}
    </div>
  )
}

type TableContentProps = {
  table: Props['table']
  filter?: string
  page?: number
  chainId: number
  wallet: string
  direction: 'incoming' | 'outgoing' | 'all'
  onlyClaimable: boolean
  chainFilter?: number
}

function TableContent({
  table,
  filter,
  page,
  chainId,
  wallet,
  direction,
  onlyClaimable,
  chainFilter,
}: TableContentProps) {
  return (
    <FluxesTable
      filter={filter}
      page={page}
      direction={direction}
      chainId={chainId}
      wallet={wallet}
      onlyClaimable={onlyClaimable}
      table={table}
      chainFilter={chainFilter}
    />
  )
}

type DashboardHeaderProps = {
  table: Props['table']
  filter?: string
  wallet: string
  chainId: number
  direction: 'incoming' | 'outgoing' | 'all'
  onlyClaimable: boolean
  chainFilter?: number
}

function DashboardHeader({
  table,
  filter,
  wallet,
  chainId,
  direction,
  onlyClaimable,
  chainFilter,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between md:flex-row flex-col gap-[1rem]">
      <TabNav activeTable={table} wallet={wallet} chainId={chainId} />
      <DashboardHeaderClient
        table={table}
        filter={filter}
        wallet={wallet}
        chainId={chainId}
        direction={direction}
        onlyClaimable={onlyClaimable}
        chainFilter={chainFilter}
      />
    </div>
  )
}

type Props = {
  filter?: string
  page?: number
  wallet: string
  table: FluxDirection
  chainId: number
  direction: 'incoming' | 'outgoing' | 'all'
  onlyClaimable: boolean
  chainFilter?: number
}

export async function VestingDashboardView({
  filter,
  page,
  wallet,
  table,
  chainId,
  direction,
  onlyClaimable,
  chainFilter,
}: Props) {
  return (
    <>
      <DashboardHeader
        table={table}
        filter={filter}
        wallet={wallet}
        chainId={chainId}
        direction={direction}
        onlyClaimable={onlyClaimable}
        chainFilter={chainFilter}
      />
      <TableContent
        table={table}
        filter={filter}
        page={page}
        chainId={chainId}
        wallet={wallet}
        direction={direction}
        onlyClaimable={onlyClaimable}
        chainFilter={chainFilter}
      />
    </>
  )
}

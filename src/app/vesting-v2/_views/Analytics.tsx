'use client'

import { GroupsOwnedByUserQuery } from '@/.graphclient'
import { MultiSelect } from '@mantine/core'
import { twMerge } from 'tailwind-merge'

import { useState } from 'react'

import { cn } from '@/src/src/utils'

import { BarChart } from '../_components/BarChart'
import { PageHeader } from '../_components/PageHeader'
import { SankeyChart, type SankeyDataType } from '../_components/SankeyChart'
import { focusWithinInput } from '../_utils/focusInput'
import { formatAmount } from '../_utils/utils'

type InflowsType = {
  distribution: {
    totalAmount: number
    distributedAmount: number
    availableAmount: number
  }
  tokenName: string
  tokenAddress: string
  recipient: {
    address: string
    groups: string[]
  }
  vesting: {
    startDate: Date
    endDate: Date
    nextUnlockDate: Date
    unlocksLeft: number
    totalDuration: number
    daysLeft: number
    progress: number
  }
  emissions: Array<{
    name: Date
    pv?: number
  }>
}

type HeadingProps = {
  text: string
  size?: 'sm' | 'md' | 'lg'
}

function Heading({ text, size = 'md' }: HeadingProps) {
  const sizeClasses = {
    sm: 'text-[18px]',
    md: 'text-[24px]',
    lg: 'text-[32px] font-[500]',
  }

  return (
    <div className="flex items-center gap-[12px]">
      <div className="w-[3px] h-[24px] bg-[#2FFA81] rounded-full"></div>
      <p className={cn(sizeClasses[size], 'text-[#F0F2FB]')}>{text}</p>
    </div>
  )
}

type StatValueProps = {
  value: number
  label: string
}

function StatValue({ value, label }: StatValueProps) {
  return (
    <div className="flex flex-col items-start justify-between h-full">
      <Heading text={label} />
      <span className="flex items-center gap-[0.5em]">
        <p className="text-[42px] text-[#F0F2FB]">${formatAmount(value)}</p>
        <p className="text-[42px] text-[#757A8B]"></p>
      </span>
    </div>
  )
}

type CardContainerProps = {
  children: React.ReactNode
  width?: number | string
  rounded?: 'all' | 'left' | 'right' | 'none'
  className?: string
}

function CardContainer({ children, width, rounded = 'all', className = '' }: CardContainerProps) {
  const roundedClasses = {
    all: 'rounded-xl',
    left: 'rounded-xl rounded-r-none',
    right: 'rounded-xl rounded-l-none',
    none: '',
  }

  const style = width ? { width: typeof width === 'number' ? `${width}px` : width } : {}

  return (
    <div
      className={twMerge(
        cn('bg-[#17181CD1] px-[34px] py-[32px] w-full', roundedClasses[rounded], className)
      )}
      style={style}>
      {children}
    </div>
  )
}

type GroupSelectorProps = {
  groups: GroupsOwnedByUserQuery
}

function GroupSelector({ groups }: GroupSelectorProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const groupOptions = groups.vestingV2_groups.map(({ id, name }) => ({
    value: id,
    label: name,
  }))

  return (
    <div className="flex h-full w-full items-center justify-between rounded-xl bg-[#0D0E12]">
      <MultiSelect
        data={groupOptions}
        value={selectedGroups}
        onChange={setSelectedGroups}
        placeholder="Select groups"
        searchable
        clearable
        hidePickedOptions
        maxDropdownHeight={200}
        className="w-full "
        classNames={{
          input: cn(
            'bg-[#1F2128] border-[#2C2F3A] text-[#F0F2FB] placeholder-[#757A8B]',
            focusWithinInput
          ),
          dropdown: 'bg-[#202228] border-[#2C2F3A]',
          option: 'text-[#F0F2FB] hover:bg-[#2C2F3A]',
          pill: 'bg-[#01EB5A29] text-[#01EB5A] border-[#01EB5A40]',
        }}
        styles={{
          input: {
            minHeight: '82px',
            borderRadius: '12px',
          },
          dropdown: {
            borderRadius: '12px',
          },
        }}
      />
    </div>
  )
}

type ChartDisplayProps = {
  title: string
  data: InflowsType
  tokenName: string
}

function ChartDisplay({ title, data, tokenName }: ChartDisplayProps) {
  return (
    <CardContainer className="w-full">
      <Heading text={title} />
      <div className="flex h-[250px] w-full items-center py-[1rem]">
        <BarChart data={data.emissions} tokenName={tokenName} />
      </div>
    </CardContainer>
  )
}

type ChartCustomizerProps = {
  groups: GroupsOwnedByUserQuery
}

function ChartCustomizer({ groups }: ChartCustomizerProps) {
  return (
    <CardContainer
      width="500px"
      rounded="right"
      className="flex flex-col items-start justify-between gap-[1.2em] bg-[#131317]">
      <Heading text="Customize this chart" />
      <div className="flex w-full items-center gap-[0.5rem]">
        <div className="flex w-full flex-col items-start gap-[0.4rem]">
          <p className="text-[16px] text-[#757A8B]">Filter by group</p>
          <GroupSelector groups={groups} />
        </div>
      </div>
    </CardContainer>
  )
}

type ChartSectionProps = {
  title: string
  data: InflowsType
}

function EmptyChartSection({ title, message }: { title: string; message?: string }) {
  return (
    <div className="flex h-[170px] w-full items-stretch">
      <CardContainer className="w-full">
        <Heading text={title} />
        <div className="flex h-full w-full items-center justify-center py-[1rem]">
          <div className="flex flex-col items-center w-full gap-3 text-center">
            <div className="px-3 py-3 bg-[#01EB5A29] border border-[#01EB5A40] w-full rounded-md text-[#01EB5A] text-sm font-medium ">
              {message ?? 'No data available yet'}
            </div>
          </div>
        </div>
      </CardContainer>
    </div>
  )
}

function ChartSection({ title, data }: ChartSectionProps) {
  return (
    <div className="flex h-[350px] w-full items-stretch">
      <ChartDisplay title={title} data={data} tokenName="USD" />
    </div>
  )
}

type ChartSectionWithCustomizerProps = {
  title: string
  data: InflowsType
  groups: GroupsOwnedByUserQuery
}

function ChartSectionWithCustomizer({ title, data, groups }: ChartSectionWithCustomizerProps) {
  return (
    <div className="flex h-[350px] w-full items-stretch">
      <CardContainer className="flex-1" rounded="left">
        <Heading text={title} />
        <div className="flex h-[250px] w-full items-center py-[1rem]">
          <BarChart data={data.emissions} tokenName="USD" />
        </div>
      </CardContainer>
      <ChartCustomizer groups={groups} />
    </div>
  )
}

type StatsSectionProps = {
  inflows: InflowsType
  outflows: InflowsType
}

function StatsSection({ inflows, outflows }: StatsSectionProps) {
  const totalInflows = inflows.emissions.reduce((acc, emission) => acc + (emission.pv || 0), 0)
  const totalOutflows = outflows.emissions.reduce((acc, emission) => acc + (emission.pv || 0), 0)
  return (
    <div className="flex h-full items-start justify-between gap-[1.2em] w-full">
      <CardContainer className="h-full">
        <StatValue value={totalInflows} label="Total inflows" />
      </CardContainer>
      <CardContainer className="h-full">
        <StatValue value={totalOutflows} label="Total outflows" />
      </CardContainer>
    </div>
  )
}

export function Analytics({
  inflows,
  outflows,
  outgoingFluxes,
  groups,
}: {
  inflows: InflowsType
  outflows: InflowsType
  outgoingFluxes: SankeyDataType[]
  groups: GroupsOwnedByUserQuery
}) {
  return (
    <div className="flex h-full w-full flex-col gap-[1em]">
      <div className="w-full mb-4">
        <PageHeader title="Analytics" />
      </div>

      <div className="flex w-full flex-col gap-[1em]">
        <div className="flex h-[170px] w-full items-center">
          <StatsSection inflows={inflows} outflows={outflows} />
        </div>

        {inflows.emissions.length > 0 ? (
          <ChartSection title="Inflows over time" data={inflows} />
        ) : (
          <EmptyChartSection title="Inflows over time" />
        )}

        {/* {outflows.emissions.length > 0 ? (
          <ChartSectionWithCustomizer title="Outflows over time" data={outflows} groups={groups} />
        ) : (
          <EmptyChartSection title="Outflows over time" />
        )} */}
        <EmptyChartSection title="Outflows over time" message="Coming soon" />

        {outgoingFluxes.length > 0 ? (
          <div className="flex h-[350px] w-full items-stretch">
            <CardContainer className="w-full">
              <Heading text="Outgoing Flux Distribution" />
              <div className="flex h-full w-full items-center py-[1rem]">
                <SankeyChart data={outgoingFluxes} />
              </div>
            </CardContainer>
          </div>
        ) : (
          <EmptyChartSection title="Outgoing Flux Distribution" />
        )}
      </div>
    </div>
  )
}

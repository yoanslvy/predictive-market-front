'use client'

import { useSearchParams } from 'next/navigation'

import { useAccount } from 'wagmi'

import RedeemGrant from '@/src/components/modules/RedeemGrant'
import ResolveForm from '@/src/components/modules/ResolveForm'
import SubmitAnswer from '@/src/components/modules/SubmitAnswer'
import Tabs from '@/src/components/modules/Tabs'
import { TabProps } from '@/src/components/modules/Tabs/Tabs'

export default async function GrantTab({
  grantId,
  question,
  bond,
  minBond,
  openingTime,
  isopeningTimePassed,
  resolved,
}: {
  grantId: string
  question: string
  bond: string
  minBond: string
  openingTime: string
  isopeningTimePassed: boolean
  resolved: boolean
}) {
  const { address } = useAccount()

  if (!address) return null

  const pathname = '/grants/grant'
  let searchParams = useSearchParams()
  let service = searchParams.get('service')

  const grant = {
    id: grantId,
    question,
    bond,
    openingTime,
    resolved,
    minBond,
  }

  let tabs: TabProps[] = []

  /*  const tabs: TabProps[] = [
    {
      caption: 'Submit Answer',
      value: 'submitAnswer',
      href: {
        pathname: `${pathname}`,
        query: { service: 'overview', grantId, question, bond, openingTime, resolved, minBond },
      },
      isActive: service == 'overview' || !service,
    },
    {
      caption: 'Resolve Grant',
      value: 'resolveGrant',
      prefetch: true,
      href: {
        pathname: `${pathname}`,
        query: { service: 'resolve', grantId, question, bond, openingTime, resolved, minBond },
      },
      isActive: service === 'resolve',
    },
    {
      caption: 'Redeem Grant',
      value: 'redeemGrant',
      prefetch: true,
      href: {
        pathname: `${pathname}`,
        query: { service: 'redeem', grantId, question, bond, openingTime, resolved, minBond },
      },
      isActive: service === 'redeem',
    },
  ] */

  if (resolved) {
    tabs = [
      {
        caption: 'Redeem Grant',
        value: 'redeemGrant',
        prefetch: true,
        href: {
          pathname: `${pathname}`,
          query: { service: 'overview', grantId, question, bond, openingTime, resolved, minBond },
        },
        isActive: service === 'overview',
      },
    ]
  } else if (isopeningTimePassed) {
    tabs = [
      {
        caption: 'Submit Answer',
        value: 'submitAnswer',
        href: {
          pathname: `${pathname}`,
          query: { service: 'overview', grantId, question, bond, openingTime, resolved, minBond },
        },
        isActive: service == 'overview' || !service,
      },
      {
        caption: 'Resolve Grant',
        value: 'resolveGrant',
        prefetch: true,
        href: {
          pathname: `${pathname}`,
          query: { service: 'resolve', grantId, question, bond, openingTime, resolved, minBond },
        },
        isActive: service === 'resolve',
      },
    ]
  }

  return (
    <>
      {isopeningTimePassed && (
        <>
          <Tabs items={tabs} value={service as string | undefined} />
          {(service === 'overview' || !service) && !resolved && (
            <SubmitAnswer grant={grant} isopeningTimePassed={isopeningTimePassed} />
          )}
          {service === 'resolve' && <ResolveForm grant={grant} />}
          {service === 'overview' && resolved && <RedeemGrant grant={grant} />}
        </>
      )}
    </>
  )
}

'use client'

import { useSearchParams } from 'next/navigation'

import ResolveForm from '@/src/components/modules/ResolveForm'
import SubmitAnswer from '@/src/components/modules/SubmitAnswer'
import Tabs from '@/src/components/modules/Tabs'
import { TabProps } from '@/src/components/modules/Tabs/Tabs'
import RedeemGrant from '@/src/components/modules/RedeemGrant'

export default async function GrantTab({
  grantId,
  question,
  bond,
  deadline,
  isDeadlinePassed,
}: {
  grantId: string
  question: string
  bond: string
  deadline: string
  isDeadlinePassed: boolean
}) {
  const pathname = '/grants/grant'
  let searchParams = useSearchParams()
  let service = searchParams.get('service')

  const grant = {
    id: grantId,
    question,
    bond,
    deadline,
  }

  const tabs: TabProps[] = [
    {
      caption: 'Submit Answer',
      value: 'submitAnswer',
      href: {
        pathname: `${pathname}`,
        query: { service: 'overview', grantId, question, bond, deadline },
      },
      isActive: service == 'overview' || !service,
    },
    {
      caption: 'Resolve Grant',
      value: 'resolveGrant',
      prefetch: true,
      href: {
        pathname: `${pathname}`,
        query: { service: 'resolve', grantId, question, bond, deadline },
      },
      isActive: service === 'resolve',
    },
    {
      caption: 'Redeem Grant',
      value: 'redeemGrant',
      prefetch: true,
      href: {
        pathname: `${pathname}`,
        query: { service: 'redeem', grantId, question, bond, deadline },
      },
      isActive: service === 'redeem',
    }
  ]

  return (
    <>
      <Tabs items={tabs} value={service as string | undefined} />
      {(service === 'overview' || !service) && (
        <SubmitAnswer grant={grant} isDeadlinePassed={isDeadlinePassed} />
      )}
      {service === 'resolve' && <ResolveForm grant={grant} />}
      {service === 'redeem' && <RedeemGrant grant={grant} />}
    </>
  )
}

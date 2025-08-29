'use client'

import { useSearchParams } from 'next/navigation'

import ResolveForm from '@/src/components/modules/ResolveForm'
import SubmitAnswer from '@/src/components/modules/SubmitAnswer'
import Tabs from '@/src/components/modules/Tabs'
import { TabProps } from '@/src/components/modules/Tabs/Tabs'

export default async function GrantTab({
  grantId,
  question,
  bond,
}: {
  grantId: string
  question: string
  bond: string
}) {
  const pathname = '/grants/grant'
  let searchParams = useSearchParams()
  let service = searchParams.get('service')

  const grant = {
    id: grantId,
    question,
    bond,
  }

  const tabs: TabProps[] = [
    {
      caption: 'Submit Answer',
      value: 'submitAnswer',
      href: {
        pathname: `${pathname}`,
        query: { service: 'answer', grantId, question, bond },
      },
      isActive: service == 'answer' || !service,
    },
    {
      caption: 'Resolve Grant',
      value: 'resolveGrant',
      prefetch: true,
      href: {
        pathname: `${pathname}`,
        query: { service: 'resolve', grantId, question, bond },
      },
      isActive: service === 'resolve',
    },
  ]

  return (
    <>
      <Tabs items={tabs} value={service as string | undefined} />
      {service === 'resolve' && <ResolveForm grant={grant} />}
      {(service === 'answer' || !service) && <SubmitAnswer grant={grant} />}
    </>
  )
}

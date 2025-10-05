'use client'

import { PlusIcon } from 'lucide-react'

import { useParams } from '../create/_steps/_hooks/useParams'
import { Btn } from './Btn'

export function CreateEventBtn() {
  const { searchParams } = useParams()
  const wallet = searchParams.get('wallet')
  const chain = searchParams.get('chain')
  const chainFilter = searchParams.get('chainFilter')
  const filter = searchParams.get('filter')

  const href = (() => {
    const params = new URLSearchParams()
    if (wallet) params.set('wallet', wallet)
    if (chain) params.set('chain', chain)
    if (chainFilter) params.set('chainFilter', chainFilter)
    if (filter) params.set('filter', filter)
    return `/vesting-v2/create?${params.toString()}`
  })()

  return (
    <Btn as="link" href={href} variant="green">
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-[15px] font-bold gap-x-[0.6rem] flex items-center justify-center w-full h-full">
          <PlusIcon size={18} /> Create Event
        </span>
      </div>
    </Btn>
  )
}

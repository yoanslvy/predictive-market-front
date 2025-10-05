'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useDebounce } from 'rooks'

import { useState } from 'react'

import { FluxDirection } from '../_views/VestingDashboardView'
import { useParams } from '../create/_steps/_hooks/useParams'
import { SearchInput } from './SearchInput'

type SearchBarProps = {
  filter?: string
  table: FluxDirection
}

export function DashboardSearchBar({ filter }: SearchBarProps) {
  const placeholder = 'Search by name or tag'
  const { createQueryString, removeQueryString } = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const [deferredFilter, setDeferredFilter] = useState<string | null>(filter ?? null)
  const setFilterToUrl = useDebounce((value: string) => {
    if (!value) {
      const params = removeQueryString('filter')
      router.replace(`${pathname}?${params}`)
      return
    }
    const params = createQueryString('filter', value)
    router.replace(`${pathname}?${params}`)
  }, 1000)

  return (
    <div>
      <SearchInput
        setSearch={(search) => {
          if (typeof search !== 'string') {
            return
          }
          setDeferredFilter(search)
          setFilterToUrl(search)
        }}
        placeholder={placeholder}
        search={deferredFilter}
      />
    </div>
  )
}

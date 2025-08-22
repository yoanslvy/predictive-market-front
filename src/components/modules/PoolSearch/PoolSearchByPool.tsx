'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useEffect, useState, useTransition } from 'react'
import { useDebouncedValue } from 'rooks'

import Input from '../Input'
import Heading from '../Heading'

type PoolSearchByPoolProps = {
  query?: string

}

export const PoolSearchByPool = ({ query }: PoolSearchByPoolProps) => {
  const [inputValue, setInputValue] = useState<string | undefined>(query)
  const [debouncedValue] = useDebouncedValue(inputValue, 500)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()

  const handleSearchParams = useCallback(
    (debouncedValue?: string) => {
      let params = new URLSearchParams(window.location.search)
      if (debouncedValue?.length) {
        params.set('search', debouncedValue)
      } else {
        params.delete('search')
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router]
  )

  useEffect(() => {
    let search = searchParams.get('search') || ''
    if (!search) {
      setInputValue('')
    }
  }, [searchParams])

  useEffect(() => {
    handleSearchParams(debouncedValue)
  }, [debouncedValue, handleSearchParams])

  return (
    <>

      <Heading>Find pools by their address.</Heading>
      
      <Input
        size="lg"
        placeholder="Pool Address..."
        value={inputValue}
        onValueChange={(value) => setInputValue(value)}
        autoFocus
        isPending={isPending}
      />
    </>

  )
}

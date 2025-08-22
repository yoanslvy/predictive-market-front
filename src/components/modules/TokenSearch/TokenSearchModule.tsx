'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useEffect, useState, useTransition } from 'react'
import { useDebouncedValue } from 'rooks'

import Input from '../Input'
import Heading from '../Heading'

type TokenSearchModuleProps = { 
  query?: string

}

export const TokenSearchModule = ({ query }: TokenSearchModuleProps) => {
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
    <Input
      title={<Heading size='sm'>Find tokens by their address.</Heading>
    }
      size="lg"
      placeholder="Token Address..."
      value={inputValue}
      onValueChange={(value) => setInputValue(value)}
      autoFocus
      isPending={isPending}
    />
  )
}

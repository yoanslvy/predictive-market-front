'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedValue } from 'rooks'

import { ChangeEventHandler, FC, useCallback, useEffect, useState, useTransition } from 'react'

import clsx from 'clsx'

import ChainAsset from '@modules/ChainAsset'

import Button from '@components/modules/Button'
import { ChainId, ChainsData } from '@components/modules/ChainAsset/constants'
import Dropdown from '@components/modules/Dropdown'
import Input from '@components/modules/Input'
import Table from '@components/modules/Table'
import Tabs from '@components/modules/Tabs'
import { TabProps } from '@components/modules/Tabs/Tabs'

import IconCross from '@images/icons/cross.svg'
import IconSearch from '@images/icons/search.svg'

import { chainNameMap } from '@/src/utils/global'

import styles from './PageSearch.module.scss'
import sectionPools from './sections/pools'
import sectionTokens from './sections/tokens'

type PageSearchProps = {
  query?: string
  chain?: string
  className?: string
  onClose?: () => void
}

const sections = [
  {
    title: 'Tokens',
    value: 'tokens',
    href: '/vesting-v2/search/tokens',
  },
]

export const PageSearch: FC<PageSearchProps> = ({ query, className, onClose }) => {
  const [currentChainId, setCurrentChainId] = useState<ChainId | null>(null)
  const [currentTab, setCurrentTab] = useState<string>(sections[0].value)
  const [currentQuery, setCurrentQuery] = useState<string>(query || '')
  const [debouncedQuery] = useDebouncedValue(currentQuery, 500)

  const [isPending, startTransition] = useTransition()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  let chain = searchParams.get('sgchain')

  const allChainsIcon = (
    <div className="flex items-center justify-between">
      <div className="flex justify-between -space-x-1 overflow-hidden ">
        <ChainAsset id={42161} onlyIcon={true} size="xs" />
        <ChainAsset id={56} onlyIcon={true} size="xs" />
        <ChainAsset id={1} onlyIcon={true} size="xs" />
      </div>
      <div className="ml-2">All</div>
    </div>
  )

  const handleTabChange = (tab: TabProps) => {
    router.replace('/vesting-v2/search/' + tab.value + (chain ? `?sgchain=${chain}` : ''))
    setCurrentTab(tab.value)
    // setCurrentData(null)
  }

  const currentSection = sections.find((section) => section.value === currentTab) || sections[0]
  // const [currentData, setCurrentData] = useState<typeof currentSection.columns | null>(null)

  const handleChange = (value: string) => {
    if (value === currentQuery) {
      return
    }

    setCurrentQuery(value)
  }

  const handleChainChange = (value: ChainId | null) => {
    // setCurrentData(null)
    setCurrentChainId(value)
  }

  const handleClose = () => {
    onClose?.()
  }

  const handleSearchParams = useCallback(
    (debouncedValue?: string) => {
      let params = new URLSearchParams(window.location.search)
      if (debouncedValue?.length) {
        params.set('sgquery', debouncedValue)
        params.delete('sgpage')
      } else {
        params.delete('sgquery')
        params.delete('sgpage')
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router]
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (debouncedQuery.length) {
      params.set('sgquery', debouncedQuery)
      params.delete('sgpage')
    } else {
      params.delete('sgquery')
      params.delete('sgpage')
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }, [debouncedQuery])

  useEffect(() => {
    handleSearchParams(debouncedQuery)
  }, [debouncedQuery, handleSearchParams])

  return (
    <div className={clsx(styles.container, className, 'min-w-full')}>
      {/* <div className={styles.header}> */}
      <div className={'flex gap-x-3 items-center justify-between'}>
        {/* <label className={styles.input}> */}
        <label className="w-full">
          {/* <IconSearch className={styles.icon} /> */}
          <Input
            className={'w-full'}
            onValueChange={handleChange}
            placeholder="Search..."
            autoFocus
            value={currentQuery}
            isPending={isPending}
            defaultValue={query}
          />
        </label>

        <Dropdown
          size="md"
          prefetch={true}
          caption={
            !chain ? (
              allChainsIcon
            ) : (
              <ChainAsset id={chain ? Number(chain) : 1} onlyIcon={false} size="xs" />
            )
          }
          items={[
            {
              scroll: false,
              onClick: () => {
                const params = new URLSearchParams(window.location.search)
                params.delete('sgchain')
                router.replace(`${pathname}?${params.toString()}`)
                handleChainChange(null)
              },
              // href: {
              //   pathname: `${baseExploreUrl}/${pathname.endsWith('tokens') ? 'tokens' : pathname.endsWith('latest') ? 'latest' : 'pools'}`
              // },
              caption: allChainsIcon,
            },
            ...Object.entries(chainNameMap)
              .filter((val) => {
                return val[0] !== '5' && val[0] !== '11155111'
              })
              .map(([key, value]) => {
                return {
                  scroll: false,
                  onClick: () => {
                    const params = new URLSearchParams(window.location.search)
                    // params.delete('chain', debouncedQuery)
                    params.set('sgchain', key)
                    router.replace(`${pathname}?${params.toString()}`)
                    handleChainChange(null)
                  },
                  // href: {
                  //   pathname: `${baseExploreUrl}/${pathname.endsWith('tokens') ? 'tokens' : pathname.endsWith('latest') ? 'latest' : 'pools'}`,
                  //   query: {
                  //     ['sgchain']: key
                  //   }
                  // },
                  caption: <ChainAsset id={key} onlyIcon={false} size="xs" />,
                }
              }),
          ]}
        />

        {/* caption={chainCaption} */}
        {/* <Dropdown size="sm" items={chainItems} />
        {!!onClose && (
          <Button
            size="sm"
            type="link"
            icon={<IconCross className={styles.icon} />}
            className={styles.close}
            onClick={handleClose}
          />
        )} */}
      </div>
      <div className={styles.body}>
        <Tabs
          items={sections.map((item) => ({ caption: item.title, value: item.value }))}
          onChange={handleTabChange}
          value={currentTab}
        />

        {/* {renderedData} */}
      </div>
    </div>
  )
}

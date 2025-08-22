import { useDebouncedValue } from 'rooks'

import { ChangeEventHandler, FC, useEffect, useState } from 'react'

import clsx from 'clsx'

import IconCross from '@images/icons/cross.svg'
import IconSearch from '@images/icons/search.svg'

import Button from '../../Button'
import { ChainId, ChainsData } from '../../ChainAsset/constants'
import Dropdown from '../../Dropdown'
import Table from '../../Table'
import Tabs from '../../Tabs'
import { TabProps } from '../../Tabs/Tabs'
import styles from './PageSearch.module.scss'
import sectionPools from './sections/pools'
import sectionTokens from './sections/tokens'

type PageSearchProps = {
  query?: string
  className?: string
  onClose?: () => void
}

const sections = [sectionTokens, sectionPools]

export const PageSearch: FC<PageSearchProps> = ({ query, className, onClose }) => {
  const [currentChainId, setCurrentChainId] = useState<ChainId | null>(null)
  const [currentTab, setCurrentTab] = useState<string>(sections[0].value)
  const [currentQuery, setCurrentQuery] = useState<string>(query || '')
  const [debouncedQuery] = useDebouncedValue(currentQuery, 500)

  const handleTabChange = (tab: TabProps) => {
    setCurrentTab(tab.value)
    setCurrentData(null)
  }

  const currentSection = sections.find((section) => section.value === currentTab) || sections[0]
  const [currentData, setCurrentData] = useState<typeof currentSection.columns | null>(null)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === currentQuery) {
      return
    }

    setCurrentQuery(e.target.value)
  }

  const handleChainChange = (value: ChainId | null) => {
    // setCurrentData(null)
    setCurrentChainId(value)
  }

  const handleClose = () => {
    onClose?.()
  }

  const chainItems = Object.values(ChainsData).map((item) => {
    if (!item.id) {
      return {
        caption: 'All chains',
        onClick: () => {
          handleChainChange(null)
        },
      }
    }

    return {
      caption: item.displayName,
      icon: item.logo,
      onClick: () => {
        handleChainChange(item.id)
      },
    }
  })

  const chainCaption = currentChainId ? ChainsData[currentChainId].displayName : 'All Chains'
  const renderedData = currentSection?.render(debouncedQuery, currentChainId)

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        <label className={styles.input}>
          <IconSearch className={styles.icon} />
          <input
            className={styles.control}
            onChange={handleChange}
            placeholder="Search..."
            autoFocus
            defaultValue={query}
          />
        </label>
        {/* <Dropdown size="sm" caption={chainCaption} items={chainItems} /> */}
        {!!onClose && (
          <Button
            size="sm"
            type="link"
            icon={<IconCross className={styles.icon} />}
            className={styles.close}
            onClick={handleClose}
          />
        )}
      </div>
      <div className={styles.body}>
        <Tabs
          items={sections.map((item) => ({ caption: item.title, value: item.value }))}
          onChange={handleTabChange}
          value={currentTab}
        />

        {renderedData}
      </div>
    </div>
  )
}

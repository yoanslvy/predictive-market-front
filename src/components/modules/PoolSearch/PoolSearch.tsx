import { FC } from 'react'

import clsx from 'clsx'

import { formatUnits, isAddress } from 'viem'

import IconDropdown from '@images/icons/chevronR.svg'

import { chainNameMap, supportedExchangesMap } from '@/src/utils/global'

import Button from '../Button'
import { ButtonProps } from '../Button/Button'
import Card from '../Card'
import { ChainIdSupported, ChainsData } from '../ChainAsset/constants'
import { isChainIdSupported } from '../ChainAsset/utils'
import Dropdown from '../Dropdown'
import Grid from '../Grid'
import Message from '../Message'
import PoolAsset from '../PoolAsset'
import Table from '../Table'
import Tabs from '../Tabs'
import { TabProps } from '../Tabs/Tabs'
import TextBlock from '../TextBlock'
import Value from '../Value'
import styles from './PoolSearch.module.scss'
import { PoolSearchByPair } from './PoolSearchByPair'
import { PoolSearchByPool } from './PoolSearchByPool'
import { getPoolData } from './utils'

export type PoolData = {
  id?: string
  token0_symbol: string
  token1_symbol: string
  token0: string
  token1: string
  factoryId: string
  balance: bigint
}

type PoolSearchProps = {
  className?: string
  chainId: ChainIdSupported | string
  wallet: string
  pool?: string
  search?: string
  pathname: string
  query?: Record<string, string | number>
  type?: string

  amm?: string
  token0?: string
  token1?: string
}

const formatter = Intl.NumberFormat('en', { notation: 'standard' })

export const PoolSearch: FC<PoolSearchProps> = async ({
  chainId,
  wallet,
  className,
  pool,
  search,
  pathname,
  query,
  type,
  amm,
  token0,
  token1,
}) => {
  const numberChainId = Number(chainId)
  const currentChainId = isChainIdSupported(numberChainId) ? numberChainId : 1

  const tabs: TabProps[] = [
    {
      caption: 'By Pool',
      value: 'pool',
      href: { pathname, query: { ...query, type: undefined } },
      isActive: type !== 'pair',
    },
    {
      caption: 'By Token Pair',
      value: 'pair',
      href: { pathname, query: { ...query, type: 'pair' } },
      isActive: type === 'pair',
    },
  ]

  const amms: ButtonProps[] =
    ChainsData[Number(chainId)].amms?.map((amm) => ({
      icon: amm.icon,
      caption: amm.name,
      href: amm.creationUrl,
      target: '_blank',
    })) || []

  if (pool && isAddress(pool)) {
    const poolData = await getPoolData(`${chainId}`, wallet, pool, amm, token0, token1)

    if (poolData) {
      const poolAsset = (
        <PoolAsset
          chainId={chainId}
          tokens={[
            {
              address: poolData.token0,
              symbol: poolData.token0_symbol,
            },
            {
              address: poolData.token1,
              symbol: poolData.token1_symbol,
            },
          ]}
        />
      )

      const poolBalance = (
        <Value
          // prefix={<>Balance&nbsp;</>}
          // value={formatter.format(Number(formatUnits(poolData.balance, 18)))}
          size="md"
        />
      )

      return (
        <Button
          className={styles.selected}
          href={{ pathname, query: { ...query, pool: undefined, search: pool } }}
          indicator={<IconDropdown />}
          size="xxl"
          caption={
            <>
              {poolAsset} {poolBalance}
            </>
          }
        />
      )
    }
  }

  // const poolDataA = await getPoolByTokensDataViem(`${chainId}`, amm!, token0!, token1!)
  const poolData = await getPoolData(`${chainId}`, wallet, search || '', amm, token0, token1)

  const renderCurrentPool = () => {
    if (!poolData) {
      return (
        <Grid>
          <Message title="Valid pools will show here" className={styles.message}>
            Verify that a correct chain is selected if the pool is not found.
          </Message>

          <Message
            type="success"
            title={`Supported V2 Exchanges on ${chainNameMap[chainId].name}:`}
            text={
              <TextBlock>
                <ul>
                  {supportedExchangesMap.lockersV2[chainId || '1'].map((exchange, idx) => {
                    const renderIcon = () => {
                      if (!exchange.icon) return null

                      // If it's a Next.js image object (PNG imports), use the src property
                      if (
                        typeof exchange.icon === 'object' &&
                        exchange.icon !== null &&
                        'src' in exchange.icon
                      ) {
                        const imageObj = exchange.icon as { src: string }
                        return (
                          <img
                            src={imageObj.src}
                            alt={exchange.basicName}
                            style={{ width: '20px', height: '20px' }}
                          />
                        )
                      }

                      // If it's a string (direct image URL), render as img tag
                      if (typeof exchange.icon === 'string') {
                        return (
                          <img
                            src={exchange.icon}
                            alt={exchange.basicName}
                            style={{ width: '20px', height: '20px' }}
                          />
                        )
                      }

                      // If it's a function (SVG component), render as JSX element
                      if (typeof exchange.icon === 'function') {
                        const IconComponent = exchange.icon as React.ComponentType<any>
                        return <IconComponent style={{ width: '20px', height: '20px' }} />
                      }

                      // If it's already a React element, render directly
                      return exchange.icon
                    }

                    return (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}>
                        {exchange.icon && (
                          <span style={{ display: 'flex', alignItems: 'center' }}>
                            {renderIcon()}
                          </span>
                        )}
                        {exchange.basicName}
                      </li>
                    )
                  })}
                </ul>
              </TextBlock>
            }
          />
        </Grid>
      )
    }

    return (
      <Table
        inner
        rowHref={(data) => ({
          pathname,
          query: {
            service: 'lock',
            wallet: wallet,
            chain: chainId,
            search: undefined,
            pool: data?.id,
          },
        })}
        columns={[
          {
            title: 'Search Result',
            accessor: 'result',
            render: ({ data }) => (
              <PoolAsset
                chainId={chainId}
                tokens={[
                  {
                    address: data.token0,
                    symbol: data.token0_symbol,
                  },
                  {
                    address: data.token1,
                    symbol: data.token1_symbol,
                  },
                ]}
              />
            ),
          },

          {
            title: 'Balance',
            accessor: 'balance',
            type: 'number',
            render: ({ data }) => (
              <Value value={formatter.format(Number(formatUnits(data.balance, 18)))} size="sm" />
            ),
          },
        ]}
        data={[poolData]}
      />
    )
  }

  return (
    <>
      <Card
        title="Select Pool"
        className={clsx(styles.container, className)}
        tools={
          <>
            {/* <div className='rounded-[11px] bg-black border border-gray-800 p-[1px]'>
              <Tabs size="md" type="switch" items={tabs} />
            </div> */}

            {/* <Dropdown caption="Create New Pool" items={amms} /> */}
          </>
        }>
        {type !== 'pair' && <PoolSearchByPool query={search || pool} />}
        {type === 'pair' && (
          <PoolSearchByPair
            chainId={currentChainId}
            ammName={amm}
            token0={token0}
            token1={token1}
            wallet={wallet}
          />
        )}

        {renderCurrentPool()}
      </Card>
    </>
  )
}

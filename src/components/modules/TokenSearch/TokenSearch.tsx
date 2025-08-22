import { FC } from 'react'

import { formatUnits, isAddress } from 'viem'

import clsx from 'clsx'

import IconDropdown from '@images/icons/chevronR.svg'

import { chainNameMap, supportedExchangesMap } from '@/src/utils/global'

import Button from '../Button'
import { ButtonProps } from '../Button/Button'
import Card from '../Card'
import { ChainIdSupported, ChainsData } from '../ChainAsset/constants'
import { isChainIdSupported } from '../ChainAsset/utils'
import Grid from '../Grid'
import Message from '../Message'
import TokenAsset from '../TokenAsset'
import Table from '../Table'
import Tabs from '../Tabs'
import { TabProps } from '../Tabs/Tabs'
import TextBlock from '../TextBlock'
import Value from '../Value'
import styles from './PoolSearch.module.scss'
// import { PoolSearchByPair } from './PoolSearchByPair'
import { TokenSearchModule } from './TokenSearchModule'
import { getTokenData } from './utils'

export type TokenData = {
  id?: string
  symbol: string
  address: string
  balance: bigint
  decimals: bigint
  name: string
}

type TokenSearchProps = {
  className?: string
  chainId: ChainIdSupported | string
  wallet: string
  pathname: string
  address?: string
  search?: string
  query?: Record<string, string | number>
}

const formatter = Intl.NumberFormat('en', { notation: 'standard' })

export const PoolSearch: FC<TokenSearchProps> = async ({
  chainId,
  wallet,
  className,
  search,
  pathname,
  query,
  address
}) => {
  const numberChainId = Number(chainId)
  const currentChainId = isChainIdSupported(numberChainId) ? numberChainId : 1


  if ((address && isAddress(address))) {

    const tokenData = await getTokenData(`${chainId}`, wallet, address)

    if (tokenData) {

      const tokenAsset = (
        <TokenAsset
          chainId={chainId}
          address={address}
          symbol={tokenData.symbol}
        />
      )

      const tokenBalance = (
        <Value
          // prefix={<>Balance&nbsp;</>}
          // value={formatter.format(Number(formatUnits(poolData.balance, 18)))}
          size="md"
        />
      )

      return (
        <Button
          className={styles.selected}
          href={{ pathname, query: { ...query, address: undefined, search: address } }}
          indicator={<IconDropdown />}
          size="xxl"
          caption={
            <>
              {tokenAsset} {tokenBalance}
            </>
          }
        />
      )
    }
  }





  const tokenData = await getTokenData(`${chainId}`, wallet, search || '')





  const renderError = () => {
    if (search && !tokenData) {
      return (
        <Grid>
          <Message type='danger' title="Error" className={styles.message}>
            Token not found.
          </Message>
        </Grid>
      )
    }



    // if ((address && isAddress(address))) {



    if (tokenData) {

      return (
        <>
          {/* <Button
            className={styles.selected}
            href={{ pathname, query: { ...query, pool: undefined, search: address } }}
            indicator={<IconDropdown />}
            size="xxl"
            caption={
              <>
                {poolAsset} {poolBalance}
              </>
            }
          /> */}
          <Table
            inner
            rowHref={(data) => ({
              pathname, query: {  
                service: 'lock',
                wallet: wallet,
                chain: chainId,
                view: 'preview',
                address: data?.id,
              }
            })}
            columns={[
              {
                title: 'Search Result',
                accessor: 'result',
                render: ({ data }) => (
                  <TokenAsset
                    chainId={chainId}
                    address={search || ''}
                    symbol={tokenData?.symbol}
                  />
                ),
              },

              {
                title: 'Balance',
                accessor: 'balance',
                type: 'number',
                render: ({ data }) => (
                  <Value value={formatter.format(Number(formatUnits(data.balance, Number(tokenData.decimals))))} size="sm" />
                ),
              },
            ]}
            data={[tokenData]}
          />
        </>
      )
    }

  }



  return (
    <>
      <Card
        title="Search Tokens"
        className={clsx(styles.container, className)}
        tools={
          <>
            {/* <Tabs size="md" type="switch" items={tabs} /> */}
          </>
        }>
        {<TokenSearchModule query={search || address} />}

        {
          (!search || search.length === 0) && (
            <Grid>
              <Message title="Valid tokens will show here" className={styles.message}>
                Verify that a correct chain is selected if the token is not found.
              </Message>
            </Grid>
          )
        }

        {renderError()}
      </Card>
    </>
  )
}


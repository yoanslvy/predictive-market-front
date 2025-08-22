'use client'

import { FC, useCallback, useEffect, useState, useTransition } from 'react'

import { ButtonProps } from '../Button/Button'
import { ChainIdSupported, ChainsData, Exchange } from '../ChainAsset/constants'
import Dropdown from '../Dropdown'
import styles from './PoolSearch.module.scss'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedValue } from 'rooks'
import Input from '../Input'
import { truncate } from '@/src/utils/global'
import Heading from '../Heading'

type PoolSearchByPairProps = {
  className?: string
  chainId: ChainIdSupported,
  ammName?: string,
  token0?: string,
  token1?: string,
  wallet?: string
}

export const PoolSearchByPair: FC<PoolSearchByPairProps> = ({ chainId, wallet, ammName, token0, token1, className }) => {

  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()



  const [currentAmm, setCurrentAmm] = useState<Exchange | undefined>()

  const [debouncedAmmValue] = useDebouncedValue(currentAmm, 500)

  const handleAmmParams = useCallback(
    (debouncedAmmValue?: string) => {
      let params = new URLSearchParams(window.location.search)
      if (debouncedAmmValue?.length) {
        params.set('amm', debouncedAmmValue)
      } else {
        params.delete('amm')
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router]
  )


  useEffect(() => {
    let amm = searchParams.get('amm') || ''
    if (!amm) {
      setCurrentAmm(undefined)
    }
  }, [searchParams])

  useEffect(() => {
    handleAmmParams(debouncedAmmValue?.address)
  }, [debouncedAmmValue, handleAmmParams])





  const amms: ButtonProps[] =
    ChainsData[chainId].amms?.map((amm) => ({
      icon: amm.icon,
      caption: amm.name,
      onClick: () => {
        // router.replace(`/lockers/manage/lockers-v2?service=lock&type=pair&wallet=${wallet}&chain=${chainId}&amm=${amm.address}`)
        setCurrentAmm(amm)
      },
    })) || []


  // useEffect(() => {

  //   if (!ammName && !token0 && !token1) {
  //     setCurrentAmm(undefined)
  //   }

  // }, [router, pathname, searchParams])




  const [inputToken0, setInputToken0] = useState<string | undefined>(token0)
  const [debouncedToken0] = useDebouncedValue(inputToken0, 500)

  const [isPending, startTransition] = useTransition()

  const handleSearchParamsToken0 = useCallback(
    (debouncedToken0?: string) => {
      let params = new URLSearchParams(window.location.search)
      if (debouncedToken0?.length) {
        params.set('token0', debouncedToken0)
      } else {
        params.delete('token0')
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router]
  )

  useEffect(() => {
    let token0 = searchParams.get('token0') || ''
    if (!token0) {
      setInputToken0('')
    }
  }, [searchParams])

  useEffect(() => {
    handleSearchParamsToken0(debouncedToken0)
  }, [debouncedToken0, handleSearchParamsToken0])


  const [inputToken1, setInputToken1] = useState<string | undefined>(token1)
  const [debouncedToken1] = useDebouncedValue(inputToken1, 500)

  // const [isPending, startTransition] = useTransition()

  const handleSearchParamsToken1 = useCallback(
    (debouncedToken1?: string) => {
      let params = new URLSearchParams(window.location.search)
      if (debouncedToken1?.length) {
        params.set('token1', debouncedToken1)
      } else {
        params.delete('token1')
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router]
  )

  useEffect(() => {
    let token1 = searchParams.get('token1') || ''
    if (!token1) {
      setInputToken1('')
    }
  }, [searchParams])

  useEffect(() => {
    handleSearchParamsToken1(debouncedToken1)
  }, [debouncedToken1, handleSearchParamsToken1])





  const tokens1: ButtonProps[] =

    (chainId == 1) ? [
      {
        caption: 'WETH',
        onClick: () => {
          setInputToken1('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
        },
      },
      {
        caption: 'USDC',
        onClick: () => {
          setInputToken1('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')
        },
      },
      {
        caption: 'USDT',
        onClick: () => {
          setInputToken1('0xdac17f958d2ee523a2206206994597c13d831ec7')
        },
      },
      {
        caption: 'DAI',
        onClick: () => {
          setInputToken1('0x6b175474e89094c44da98b954eedeac495271d0f')
        },
      },

    ] :
      (chainId == 5) ? [
        {
          caption: 'WETH',
          onClick: () => {
            setInputToken1('0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6')
          },
        },
      ]

        : (chainId == 56) ? [
          {
            caption: 'WBNB',
            onClick: () => {
              setInputToken1('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c')
            },
          },
          {
            caption: 'USDC',
            onClick: () => {
              setInputToken1('0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d')
            },
          },
          {
            caption: 'USDT',
            onClick: () => {
              setInputToken1('0x55d398326f99059ff775485246999027b3197955')
            },
          },
          {
            caption: 'BUSD',
            onClick: () => {
              setInputToken1('0xe9e7cea3dedca5984780bafc599bd69add087d56')
            },
          },

        ]
          : (chainId == 137) ? [
            {
              caption: 'WMATIC',
              onClick: () => {
                setInputToken1('0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270')
              },
            },
            {
              caption: 'WETH',
              onClick: () => {
                setInputToken1('0x7ceb23fd6bc0add59e62ac25578270cff1b9f619')
              },
            },
            {
              caption: 'USDC',
              onClick: () => {
                setInputToken1('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174')
              },
            },
            {
              caption: 'USDT',
              onClick: () => {
                setInputToken1('0xc2132d05d31c914a87c6611c10748aeb04b58e8f')
              },
            },
            {
              caption: 'DAI',
              onClick: () => {
                setInputToken1('0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063')
              },
            },
          ]
            : (chainId == 42161) ? [
              {
                caption: 'WETH',
                onClick: () => {
                  setInputToken1('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1')
                },
              },
              {
                caption: 'USDC',
                onClick: () => {
                  setInputToken1('0xaf88d065e77c8cc2239327c5edb3a432268e5831')
                },
              },
              {
                caption: 'USDC.e',
                onClick: () => {
                  setInputToken1('0xff970a61a04b1ca14834a43f5de4533ebddb5cc8')
                },
              },
              {
                caption: 'USDT',
                onClick: () => {
                  setInputToken1('0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9')
                },
              },
            ]
              : (chainId == 43114) ? [
                {
                  caption: 'WAVAX',
                  onClick: () => {
                    setInputToken1('0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7')
                  },
                },
                {
                  caption: 'USDC',
                  onClick: () => {
                    setInputToken1('0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E')
                  },
                },
                {
                  caption: 'USDC.e',
                  onClick: () => {
                    setInputToken1('0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664')
                  },
                },
                {
                  caption: 'USDT.e',
                  onClick: () => {
                    setInputToken1('0xc7198437980c041c805A1EDcbA50c1Ce5db95118')
                  },
                },
                {
                  caption: 'USDT',
                  onClick: () => {
                    setInputToken1('0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7')
                  },
                },
              ]

                : []



  // const tokens0: ButtonProps[] = [
  //   { caption: 'ShitETH', icon: '🤡' },
  //   { caption: 'ShitUSDC', icon: '🤡' },
  //   { caption: 'ShitUSDT', icon: '🤡' },
  // ]


  // const [filteredTokens0, setFilteredTokens0] = useState<ButtonProps[]>(tokens0)

  const [filteredTokens1, setFilteredTokens1] = useState<ButtonProps[]>(tokens1)

  // const handleSearch0 = (value: string) => {
  //   setFilteredTokens0(
  //     tokens0.filter(
  //       (item) => item.caption?.toString().toLowerCase().includes(value.toLowerCase()) || false
  //     )
  //   )
  // }

  const handleSearch1 = (value: string) => {
    setFilteredTokens1(
      tokens1.filter(
        (item) => item.caption?.toString().toLowerCase().includes(value.toLowerCase()) || false
      )
    )
  }

  return (
    <>
    <Heading subtitle=''>Find pools by their individual tokens.</Heading>
      <div className={styles.lookup}>
        <div className={styles.amm}>
          <Dropdown

            type={`${currentAmm?.name ? 'action' : 'action'}`}
            caption={currentAmm?.name || 'AMM'}
            className={styles.dropdown}
            isDisabled={!amms?.length}
            items={amms}
          />
        </div>
        <div className={styles.token}>
          {/* <Input
            // title="Enter address of a Uniswap V2 Liquidity pool you wish to Lock or Edit"
            size="md"
            placeholder="Token 0 Address..."
            value={inputToken0}
            onValueChange={(value) => setInputToken0(value)}
            autoFocus
            isPending={isPending}
          /> */}
          <Dropdown
            caption={`${inputToken0 ? truncate(inputToken0, 12, '...') : "Main Token"}`}
            className={styles.dropdown}
            type='tertiary'
            isDisabled={!currentAmm}
            items={[]}
            onSearch={(value) => setInputToken0(value)}
          />
        </div>
        <div className={styles.token}>
          {/* <Input
            // title="Enter address of a Uniswap V2 Liquidity pool you wish to Lock or Edit"
            size="md"
            placeholder="Token 1 Address..."
            value={inputToken0}
            onValueChange={(value) => setInputToken0(value)}
            autoFocus
            isPending={isPending}
          /> */}
          <Dropdown
            caption={`${inputToken1 ? truncate(inputToken1, 12, '...') : "Base Token"}`}
            type='tertiary'
            isDisabled={!currentAmm}

            className={styles.dropdown}
            items={filteredTokens1}
            onSearch={(value) => setInputToken1(value)}
          />
        </div>
      </div>
    </>
  )
}

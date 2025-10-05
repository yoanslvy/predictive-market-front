import { useQuery } from '@tanstack/react-query'

import { useEffect } from 'react'

import { Address, erc20Abi, getAddress, formatUnits } from 'viem'

import { useReadContracts } from 'wagmi'

import { ChainsData } from '@/src/components/modules/ChainAsset/constants'

import { tokenSchemas } from '../../_schemas/tokenSchemas'

export function useQueryMintAndSetToStore({
  tokenAddress,
  wallet,
  setTokenAmountUi,
  setTokenLogoURI,
  setTokenPriceUsd,
  setTokenSymbol,
  chainId,
  setTokenDecimals,
}: {
  tokenAddress: Address | null
  wallet: Address
  setTokenSymbol: (symbol: string) => void
  setTokenAmountUi: (amount: number) => void
  setTokenPriceUsd: (price: number) => void
  setTokenLogoURI: (uri: string) => void
  setTokenDecimals: (decimals: number) => void
  chainId: number
}) {
  const mintQuery = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: tokenAddress!,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [wallet],
        chainId,
      },
      {
        address: tokenAddress!,
        abi: erc20Abi,
        functionName: 'decimals',
        chainId,
      },
      {
        address: tokenAddress!,
        abi: erc20Abi,
        functionName: 'symbol',
        chainId,
      },
    ],
    query: {
      enabled: !!tokenAddress && !!wallet,
    },
  })

  const priceUsdQuery = useQuery({
    queryKey: ['priceUsd', tokenAddress],
    queryFn: async () => {
      try {
        const url = `https://api.dexscreener.com/token-pairs/v1/${ChainsData[chainId].dexscreenerName}/${tokenAddress}`
        const response = await fetch(url)
        const data = await response.json()
        const parsedData = tokenSchemas.DexScreenerPairSchema.parse(data)
        const stablePair = parsedData.find(
          (pair) => pair.baseToken.address.toLowerCase() === tokenAddress!.toLowerCase()
        )
        if (!stablePair) {
          return 0 // Return 0 as fallback when no stable pair is found
        }
        const price = Number(stablePair.priceUsd)
        if (isNaN(price)) {
          return 0 // Return 0 for invalid price
        }
        return price
      } catch (error) {
        console.error('Error fetching token price:', error)
        return 0 // Return 0 on any error
      }
    },
    enabled: !!tokenAddress,
  })

  const tokenLogoQuery = useQuery({
    queryKey: ['tokenLogo', tokenAddress, chainId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/tokenIcon/${chainId}/${getAddress(tokenAddress!)}`)
        if (!response.ok) {
          return '' // Return empty string as fallback
        }
        const { url } = (await response.json()) as { url: string }
        return url
      } catch (error) {
        console.error('Error fetching token logo:', error)
        return '' // Return empty string on any error
      }
    },
    enabled: !!tokenAddress && !!chainId,
  })

  useEffect(() => {
    // Process all query results in a single effect
    if (mintQuery.status === 'success' && mintQuery.data && mintQuery.data.length >= 3) {
      // Set token symbol
      if (mintQuery.data[2]) {
        setTokenSymbol(mintQuery.data[2])
      }

      // Set token decimals
      if (typeof mintQuery.data[1] === 'number') {
        setTokenDecimals(mintQuery.data[1])
      }

      // Set token amount with safe number conversion
      if (typeof mintQuery.data[0] === 'bigint' && typeof mintQuery.data[1] === 'number') {
        const amount = Number(formatUnits(mintQuery.data[0], mintQuery.data[1]))
        setTokenAmountUi(amount)
      }
    }

    // Set token price
    if (priceUsdQuery.status === 'success' && typeof priceUsdQuery.data === 'number') {
      setTokenPriceUsd(priceUsdQuery.data)
    }

    // Set token logo
    if (tokenLogoQuery.status === 'success' && typeof tokenLogoQuery.data === 'string') {
      setTokenLogoURI(tokenLogoQuery.data)
    }
  }, [
    mintQuery.status,
    mintQuery.data,
    priceUsdQuery.status,
    priceUsdQuery.data,
    tokenLogoQuery.status,
    tokenLogoQuery.data,
    setTokenAmountUi,
    setTokenSymbol,
    setTokenPriceUsd,
    setTokenLogoURI,
    setTokenDecimals,
  ])

  // Return query objects with loading and error states
  return {
    mintQuery,
    priceUsdQuery,
    tokenLogoQuery,
    isLoading: mintQuery.isLoading || priceUsdQuery.isLoading || tokenLogoQuery.isLoading,
    isError: mintQuery.isError || priceUsdQuery.isError || tokenLogoQuery.isError,
  }
}

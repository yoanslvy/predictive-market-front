'use client'

import { Address } from 'viem'

import { TokenAddressInputWithQueryStatus } from '../../../_components/TokenAddressInputWithQueryStatus'
import { TokenInformation } from '../_components/TokenInformation'
import { useQueryMintAndSetToStore } from '../_hooks/useQueryMintAndSetToStore'
import { useVestingStore } from '../_hooks/useVestingStore'

export function TokenDetails({ wallet, chainId }: { wallet: string; chainId: number }) {
  const {
    tokenAddress,
    setTokenAddress,
    setTokenAmountUi,
    setTokenLogoURI,
    setTokenPriceUsd,
    setTokenSymbol,
    setTokenDecimals,
  } = useVestingStore((s) => ({
    tokenAddress: s.tokenAddress,
    setTokenAddress: s.setTokenAddress,
    setTokenSymbol: s.setTokenSymbol,
    setTokenAmountUi: s.setTokenAmountUi,
    setTokenPriceUsd: s.setTokenPriceUsd,
    setTokenLogoURI: s.setTokenLogoURI,
    setTokenDecimals: s.setTokenDecimals,
  }))

  const { mintQuery, tokenLogoQuery, isError, isLoading, priceUsdQuery } =
    useQueryMintAndSetToStore({
      tokenAddress: tokenAddress as Address | null,
      wallet: wallet as Address,
      setTokenAmountUi,
      setTokenLogoURI,
      setTokenPriceUsd,
      setTokenSymbol,
      chainId,
      setTokenDecimals,
    })

  return (
    <div className="mb-[5rem] flex w-full items-start gap-x-[1rem] gap-y-[2rem]">
      <form className="flex w-full max-w-[530px] flex-col items-start gap-x-[1rem] gap-y-[1rem]">
        <div className="flex w-full flex-col gap-y-[1rem]">
          <p className="text-[20px] text-white">Token Details</p>
          <TokenAddressInputWithQueryStatus
            isLoading={isLoading}
            isError={isError}
            tokenAddress={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            tokenSymbol={mintQuery.data?.[2] ?? null}
            mintLogoUri={tokenLogoQuery.data ?? null}
          />

          <TokenInformation
            mintQuery={mintQuery}
            tokenLogoQuery={tokenLogoQuery}
            priceUsdQuery={priceUsdQuery}
          />
        </div>
      </form>
    </div>
  )
}

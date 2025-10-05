import { UseQueryResult } from '@tanstack/react-query'

import { formatAmount } from '../../../_utils/utils'

export function TokenInformation({
  mintQuery,
  tokenLogoQuery,
  priceUsdQuery,
}: {
  mintQuery: UseQueryResult<[bigint, number, string], Error>
  tokenLogoQuery: UseQueryResult<string, Error>
  priceUsdQuery: UseQueryResult<number, Error>
}) {
  return (
    <div className="bg-[#1A1B23] border border-[#30333C] rounded-xl">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[#01EB5A] rounded-full"></div>
          <h3 className="text-[18px] font-bold text-[#F0F2FB]">Token Information</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between">
            <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
              Balance
            </span>
            <div className="mt-1">
              <span className="text-sm font-semibold text-white">
                {mintQuery.status === 'success' &&
                  formatAmount(Number(mintQuery.data[0]) / 10 ** mintQuery.data[1])}
              </span>
            </div>
          </div>

          <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between">
            <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
              Decimals
            </span>
            <div className="mt-1">
              <span className="text-sm font-semibold text-white">
                {mintQuery.status === 'success' && mintQuery.data[1]}
              </span>
            </div>
          </div>

          <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between">
            <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
              Symbol
            </span>
            <div className="flex items-center gap-2 mt-1">
              {tokenLogoQuery.data && (
                <img src={tokenLogoQuery.data} alt="Token logo" className="w-4 h-4 rounded-full" />
              )}
              <span className="text-sm font-semibold text-white">
                {mintQuery.status === 'success' && mintQuery.data[2]}
              </span>
            </div>
          </div>

          <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between">
            <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
              Price (USD)
            </span>
            <div className="mt-1">
              {priceUsdQuery.status === 'success' && priceUsdQuery.data > 0 ? (
                <span className="text-sm font-semibold text-white">
                  ~${formatAmount(priceUsdQuery.data)}
                </span>
              ) : (
                <span className="text-sm font-semibold text-[#757A8B]">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export function FluxNotFound({
  wallet,
  chainId,
  isAirdrop,
}: {
  wallet?: string
  chainId?: number
  isAirdrop: boolean
}) {
  return (
    <div className="mt-[4rem] flex flex-col items-center justify-center gap-6 max-w-md text-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FF6B6B]/20 to-[#FF8E8E]/20 border border-[#FF6B6B]/30 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-[#FF6B6B]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-[#F0F2FB]">Vesting Not Found</h2>
        <p className="text-[#757A8B] leading-relaxed">
          The vesting you're looking for doesn't exist or may have been removed. Please check the
          URL and try again.
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-2 sm:flex-row">
        <Link
          href={`/vesting-v2/dashboard/${
            isAirdrop ? 'airdrops' : 'vesting'
          }?wallet=${wallet}&chain=${chainId}`}
          className="px-6 py-2 bg-[#050508] hover:bg-[#1E1F24] text-[#F0F2FB] rounded-full transition-colors">
          Browse Vesting
        </Link>
      </div>
    </div>
  )
}

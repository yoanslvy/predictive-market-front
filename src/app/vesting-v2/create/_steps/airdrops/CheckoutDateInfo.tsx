import { dateFormatter } from '../../../_utils/utils'

interface CheckoutDateInfoProps {
  startDate?: Date | null
  endDate?: Date | null
  steps?: number | null
}

export function CheckoutDateInfo({ startDate, endDate, steps }: CheckoutDateInfoProps) {
  return (
    <div className="bg-[#1A1B23] border border-[#30333C] rounded-xl">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[#01EB5A] rounded-full"></div>
          <h3 className="text-[18px] font-bold text-[#F0F2FB]">Schedule Details</h3>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between flex-1">
            <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
              Start Date
            </span>
            <div className="mt-1">
              <span className="text-sm font-semibold text-white">
                {startDate ? dateFormatter(startDate) : 'Not set'}
              </span>
            </div>
          </div>

          {endDate && (
            <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between flex-1">
              <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
                End Date
              </span>
              <div className="mt-1">
                <span className="text-sm font-semibold text-white">{dateFormatter(endDate)}</span>
              </div>
            </div>
          )}

          {steps && (
            <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] h-[72px] flex flex-col justify-between flex-1">
              <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
                Steps
              </span>
              <div className="mt-1">
                <span className="text-sm font-semibold text-white">{steps}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

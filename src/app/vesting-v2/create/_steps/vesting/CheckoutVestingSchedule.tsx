import { ReactNode } from 'react'

interface CheckoutVestingScheduleProps {
  recipientCount: number
  children: ReactNode
}

export function CheckoutVestingSchedule({
  recipientCount,
  children,
}: CheckoutVestingScheduleProps) {
  return (
    <div className="bg-[#1A1B23] border border-[#30333C] rounded-xl">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-[#01EB5A] rounded-full"></div>
          <h3 className="text-[18px] font-bold text-[#F0F2FB]">
            Vesting Schedule ({recipientCount} Recipients)
          </h3>
        </div>
        <div className="overflow-hidden rounded-lg border border-[#30333C]">{children}</div>
      </div>
    </div>
  )
}

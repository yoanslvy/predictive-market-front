import { Badge } from '@mantine/core'

import { Clock } from '../../../_svg/Clock'
import { Forbidden } from '../../../_svg/Forbidden'
import { TickInCircle } from '../../../_svg/TickInCircle'

export function StatusBadge({
  status,
}: {
  status: 'completed' | 'upcoming' | 'stopped' | number | null
}) {
  if (status === 'completed') {
    return (
      <Badge radius="8px" size="lg" color="#2FFA8133">
        <div className="flex items-center gap-x-[0.5rem]">
          <TickInCircle width={18} height={18} stroke="#2FFA81" />
          <span className="capitalize text-[#2FFA81] font-medium text-[15px]">{status}</span>
        </div>
      </Badge>
    )
  }
  if (status === 'stopped') {
    return (
      <Badge radius="8px" size="lg" color="#FF345626">
        <div className="flex items-center gap-x-[0.5rem]">
          <Forbidden width={18} height={18} />
          <span className="capitalize text-[#FF3456] font-medium text-[15px]">{status}</span>
        </div>
      </Badge>
    )
  }
  if (status === 'upcoming') {
    return (
      <Badge size="lg" radius="8px" color="#5BC0FE33">
        <div className="flex items-center gap-x-[0.5rem]">
          <Clock />
          <span className="capitalize text-[#5BC0FE] font-medium text-[15px]">{status}</span>
        </div>
      </Badge>
    )
  }
  if (typeof status === 'number') {
    return (
      <Badge radius="8px" size="lg" color="#FFB42233">
        <div className="flex items-center gap-x-[0.5rem]">
          <span className="capitalize text-[#FFB422] font-medium text-[15px]">
            {status.toLocaleString('en', {
              style: 'percent',
            })}{' '}
            In Progress
          </span>
        </div>
      </Badge>
    )
  }
  return null
}

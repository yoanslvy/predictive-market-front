import { Badge } from '@mantine/core'

export function OptionBadge({ status }: { status: 'Cancellable' | 'Transferrable' | 'Top-Ups' }) {
  if (status === 'Cancellable') {
    return (
      <Badge radius="8px" size="lg" color="#BF6FFF0F">
        <div className="flex items-center gap-x-[0.5rem]">
          <span className="py-[4px] pt-[7px] text-[15px] font-[500] capitalize text-[#BF6FFF80]">
            {status}
          </span>
        </div>
      </Badge>
    )
  }
  if (status === 'Transferrable') {
    return (
      <Badge radius="8px" size="lg" color="#5BC0FE0F">
        <div className="flex items-center gap-x-[0.5rem]">
          <span className="py-[4px] pt-[7px] text-[15px] font-[500] capitalize text-[#5BC0FE80]">
            {status}
          </span>
        </div>
      </Badge>
    )
  }
  return (
    <Badge radius="8px" size="lg" color="#2FFA810F">
      <div className="flex items-center gap-x-[0.5rem]">
        <span className="py-[4px] pt-[7px] text-[15px] font-[500] capitalize text-[#2FFA8180]">
          {status}
        </span>
      </div>
    </Badge>
  )
}

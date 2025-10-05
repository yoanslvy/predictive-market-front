import { cn } from '@/src/src/utils'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

export function CreateFluxWithChartHeader({
  canAddFlux,
  openModal,
}: {
  canAddFlux: boolean
  openModal: () => void
}) {
  return (
    <div className="flex items-center justify-between w-full mb-[1em]">
      <p className="text-[20px] text-white">Create Vesting</p>
      <button
        type="button"
        className="text-green-500 disabled:text-gray-600 flex items-center gap-x-[0.5rem] cursor-pointer"
        onClick={() => {
          if (canAddFlux) {
            openModal()
          }
        }}
        disabled={!canAddFlux}>
        <ArrowTrendingUpIcon width={20} height={20} className={cn( canAddFlux ? 'text-green-500' : 'text-gray-600')}/>
        <p className={cn('text-sm', canAddFlux ? 'cursor-pointer' : 'cursor-not-allowed')}>
          Chart Simulation
        </p>
      </button>
    </div>
  )
}

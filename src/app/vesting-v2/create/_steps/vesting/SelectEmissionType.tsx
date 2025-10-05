import { cn } from '@/src/src/utils'

import { Tick } from '../../../_svg/Tick'
import { SelectEmissionTypeCard } from '../_components/SelectEmissionTypeCard'
import { emissionTypes, useVestingStore } from '../_hooks/useVestingStore'

export function SelectEmissionType() {
  const { setEmissionType, selectedEmissionType, resetFluxes } = useVestingStore((s) => ({
    setEmissionType: s.setEmissionType,
    selectedEmissionType: s.emissionType,
    resetFluxes: s.resetFluxes,
  }))
  return (
    <div className="flex flex-col items-start w-full h-full gap-4 lg:flex-row">
      <ul className="flex flex-col w-full lg:w-auto gap-y-2">
        {emissionTypes.map((emissionType) => {
          if ('disabled' in emissionType && emissionType.disabled) {
            return null
          }
          return (
            <li
              key={emissionType.value}
              className={cn(
                'flex h-[44px] w-full lg:w-[185px] items-center justify-start rounded-lg border border-[#202228] px-[12px] py-[10px]',
                selectedEmissionType.value === emissionType.value && 'bg-[#2FFA811A] text-white'
              )}>
              <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => {
                  setEmissionType(emissionType)
                  resetFluxes()
                }}>
                <span className="font-bold">{emissionType.label}</span>
                {selectedEmissionType.value === emissionType.value && <Tick fill="#2FFA81" />}
              </button>
            </li>
          )
        })}
      </ul>
      <SelectEmissionTypeCard
        title={selectedEmissionType.title}
        description={selectedEmissionType.description}
        bottomText={selectedEmissionType.bottomText}
        svg={selectedEmissionType.svg}
      />
    </div>
  )
}

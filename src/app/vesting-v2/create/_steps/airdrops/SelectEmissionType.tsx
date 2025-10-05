import { cn } from '@/src/src/utils'

import { Tick } from '../../../_svg/Tick'
import { SelectEmissionTypeCard } from '../_components/SelectEmissionTypeCard'
import { emissionTypes, useAirdropStore } from '../_hooks/useAirdropStore'

export function SelectEmissionType() {
  const {
    emissionType: selectedEmissionType,
    setEmissionType,
    resetFluxes,
  } = useAirdropStore((state) => ({
    emissionType: state.emissionType,
    setEmissionType: state.setEmissionType,
    resetFluxes: state.resetFluxes,
  }))
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row md:gap-x-[1rem]">
      <ul className="flex flex-col w-full gap-y-2 md:w-auto">
        {emissionTypes.map((emissionType) => {
          return (
            <li
              key={emissionType.value}
              className={cn(
                'flex h-[44px] w-full items-center justify-start rounded-lg border border-[#202228] px-[12px] py-[10px] md:w-[185px] hover:bg-[#202228] transition-all',
                selectedEmissionType.value === emissionType.value && 'bg-[#2FFA811A] text-white hover:bg-[#2FFA811A]'
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

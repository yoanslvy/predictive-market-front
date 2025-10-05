'use client'

import { useDisclosure } from '@mantine/hooks'

import { Btn } from '../../_components/Btn'
import { Filters } from '../../_svg/Filters'
import { FilterFluxTransactionsModal } from '../../_tables/FilterFluxTransactionsModal'

export function FilterButton() {
  const [opened, { close, open }] = useDisclosure()

  return (
    <>
      <FilterFluxTransactionsModal opened={opened} close={close} />
      <Btn onClick={open} variant="transparent" className="w-fit rounded-[10px]">
        <div className="flex items-center gap-[0.6em]">
          <Filters />
          <p className=" text-[15px] text-[#FFFFFF4D]">Filters</p>
        </div>
      </Btn>
    </>
  )
}

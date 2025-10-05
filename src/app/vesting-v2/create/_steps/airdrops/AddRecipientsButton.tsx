import { Plus } from 'lucide-react'

import { Btn } from '../../../_components/Btn'

export function AddRecipientsButton({ onClick }: { onClick: () => void }) {
  return (
    <Btn onClick={onClick} variant="gray">
      <span className="mr-[0.7em] text-[16px] font-[500] text-white">
        Add recipients to the list
      </span>
      <Plus />
    </Btn>
  )
}

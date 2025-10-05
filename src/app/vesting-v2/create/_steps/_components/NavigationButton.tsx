import { Btn } from '../../../_components/Btn'
import { ArrowIcon } from '../../../_svg/ArrowIcon'

type NavigationButtonProps = {
  direction: 'previous' | 'next'
  onClick: () => void
  disabled?: boolean
  skipMode?: boolean
}

export function NavigationButton({
  direction,
  onClick,
  disabled = false,
  skipMode = false,
}: NavigationButtonProps) {
  if (direction === 'previous') {
    return (
      <Btn variant="transparent" onClick={onClick} className="w-fit">
        <div className="flex w-full items-center gap-x-[1rem]">
          <ArrowIcon />
          <span className="text-[16px]">Return</span>
        </div>
      </Btn>
    )
  }

  return (
    <Btn disabled={disabled} variant="white" onClick={onClick}>
      <span className="text-[16px]">{skipMode ? 'Skip' : 'Continue'}</span>
    </Btn>
  )
}

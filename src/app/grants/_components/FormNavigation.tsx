import { NavigationButton } from './NavigationButton'

type FormNavigationProps = {
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
  canShowPreviousButton: boolean
  canShowNextButton: boolean
  canSkipStep: boolean
}

export function FormNavigation({
  canGoNext,
  onPrevious,
  onNext,
  canShowNextButton,
  canShowPreviousButton,
  canSkipStep,
}: FormNavigationProps) {
  return (
    <div className="mt-[2em] flex w-full items-center justify-center gap-[1rem] flex-wrap pb-[2em]">
      {canShowPreviousButton && <NavigationButton direction="previous" onClick={onPrevious} />}

      {canShowNextButton && (
        <NavigationButton
          direction="next"
          onClick={onNext}
          disabled={!canGoNext}
          skipMode={canSkipStep}
        />
      )}
    </div>
  )
}

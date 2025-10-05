import { ReactNode } from 'react'

import { cn } from '@/src/src/utils'

function Ball({ isActive, isCompleted }: { isActive?: boolean; isCompleted?: boolean }) {
  if (isCompleted) {
    return (
      <div className="relative z-10 bg-[#1A1A1A] rounded-full">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 20C15.4706 20 20 15.4608 20 10C20 4.52942 15.4608 0 9.99021 0C4.52942 0 0 4.52942 0 10C0 15.4608 4.53922 20 10 20ZM8.90196 14.7942C8.56866 14.7942 8.29413 14.6569 8.03924 14.3138L5.57844 11.2941C5.43139 11.098 5.34315 10.8824 5.34315 10.6569C5.34315 10.2157 5.68629 9.85293 6.12746 9.85293C6.41178 9.85293 6.62747 9.94119 6.87256 10.2647L8.86281 12.8333L13.0491 6.10785C13.2353 5.81374 13.4902 5.65688 13.7451 5.65688C14.1765 5.65688 14.5785 5.95099 14.5785 6.41178C14.5785 6.62747 14.451 6.85296 14.3334 7.05884L9.72551 14.3138C9.51962 14.6373 9.23534 14.7942 8.90196 14.7942Z"
            fill="#CFCFCF"
            fillOpacity="0.24"
          />
        </svg>
      </div>
    )
  }
  return (
    <div className="flex size-[20px] items-center justify-center rounded-full bg-[#3e4044] relative z-10">
      {isActive && <div className="size-[10px] rounded-full bg-[#01EB5A]" />}
    </div>
  )
}

export function Steps({
  className,
  steps,
}: {
  className?: string
  steps: {
    name: string
    isActive?: boolean
    isCompleted?: boolean
    id: number
    onClick?: () => void
    subtitle?: string | ReactNode
  }[]
}) {
  const completedSteps = steps.filter((step) => step.isCompleted).length
  const activeStepIndex = steps.findIndex((step) => step.isActive)
  const totalSteps = steps.length

  const progressPercentage =
    totalSteps > 0 ? ((completedSteps + (activeStepIndex >= 0 ? 0.45 : 0)) / totalSteps) * 100 : 0

  return (
    <div className={className}>
      <div className="relative">
        <div className="absolute left-[9px] top-[12px] bottom-[10px] w-[2px] bg-[#3e4044] rounded-full z-0">
          <div
            className="bg-[#01EB5A] rounded-full transition-all duration-500 ease-out w-full"
            style={{ height: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
        <ul className="relative space-y-[1.5em]">
          {steps.map((step) => (
            <li key={step.id}>
              <button
                className={cn(
                  'flex items-center gap-x-[1rem] relative z-10',
                  !step.isActive ? 'text-[#757A8B]' : 'text-[#01EB5A]',
                  step.onClick ? 'cursor-pointer' : 'cursor-default'
                )}
                onClick={step.onClick}>
                <Ball isActive={step.isActive} isCompleted={step.isCompleted} />
                <div className="flex flex-col items-start">
                  <p className="font-bold">{step.name}</p>
                  {step.subtitle && typeof step.subtitle === 'string' && (
                    <p className="text-[13px] text-[#757A8B]">{step.subtitle}</p>
                  )}
                  {step.subtitle && typeof step.subtitle !== 'string' && <>{step.subtitle}</>}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

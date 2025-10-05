import type { Dispatch, ReactNode, SetStateAction } from 'react'

import { Steps } from '@/src/app/vesting-v2/create/_steps/_components/Steps'
import { Title } from '@/src/app/vesting-v2/create/_steps/_components/Title'

export function FormContent<T extends { id: number; title: string; name: string }>({
  activeStepId,
  completedStepsIds,
  formSteps,
  children,
  setActiveStepId,
}: {
  activeStepId: number
  completedStepsIds: number[]
  formSteps: T[]
  children: ReactNode
  setActiveStepId: Dispatch<SetStateAction<number>>
}) {
  const activeStep = formSteps.find((step) => step.id === activeStepId) ?? formSteps[0]!

  function getSubtitle(stepId: number) {
    switch (stepId) {
      case 1:
        return 'Granter Information'
      case 2:
        return 'Grantee Information'
      case 3:
        return 'Grant Details'
      default:
        return undefined
    }
  }

  return (
    <div className="grid grid-cols-1 grid-rows-[auto_auto_auto] lg:grid-cols-8 lg:grid-rows-1 gap-4 px-[1em] lg:px-[2em]">
      <div className="row-span-1 lg:border-r border-[#202228] lg:col-span-2 lg:row-span-1 mr-[2em] border-r-0 ">
        <Steps
          steps={formSteps.map((step) => ({
            name: step.name,
            isActive: step.id === activeStepId,
            isCompleted: completedStepsIds.includes(step.id),
            id: step.id,
            onClick: step.id < activeStepId ? () => setActiveStepId(step.id) : undefined,
            subtitle: activeStep.id > step.id ? getSubtitle(step.id) : undefined,
          }))}
        />
      </div>
      <div className="row-span-1 lg:col-span-5 lg:row-span-1">
        <div className="flex flex-col gap-y-[1rem] w-full">
          <div className="w-full text-left">
            <Title title={activeStep.title} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

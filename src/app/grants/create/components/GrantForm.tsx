'use client'

import { useEffect, useState } from 'react'

import { useGrant } from '@/src/hooks/useGrant'

import { FormNavigation } from '../../_components/FormNavigation'
import { FormContent } from './FormContent'
import { GrantConditions } from './GrantConditions'
import { GrantRewards } from './GrantRewards'
import { Grantee } from './Grantee'

type Step = {
  name: string
  title: string
  id: number
  isOptional?: boolean
  subtitle?: string
}

type StepContentProps = {
  stepId: number
  wallet: string
  chainId: number
}

const FORM_STEPS: Step[] = [
  {
    name: 'Grant Conditions',
    title: 'Grant Conditions',
    id: 1,
  },
  {
    name: 'Grantee Information',
    title: 'Select Grantee Information',
    id: 2,
  },
  {
    name: 'Grant Rewards',
    title: 'Grant Rewards',
    id: 3,
  },
] as const

function StepContent({ stepId, wallet, chainId }: StepContentProps) {
  const uniformStepMap: Record<number, JSX.Element | null> = {
    1: <GrantConditions />,
    2: <Grantee />,
    3: <GrantRewards />,
  }

  return uniformStepMap[stepId] ?? null
}

export function GrantForm({ wallet, chainId }: { wallet: string; chainId: number }) {
  const [activeStepId, setActiveStepId] = useState(1)
  const [hasApproved, setHasApproved] = useState(false)

  const { createGrantFromForm, status, needsApproval, approve, isApprovalConfirmed } = useGrant()

  const completedStepsIds = FORM_STEPS.filter((step) => step.id < activeStepId).map(({ id }) => id)

  const lastStepId = FORM_STEPS.at(-1)!.id

  const isLastStep = activeStepId === lastStepId

  useEffect(() => {
    if (!wallet) {
      setActiveStepId(1)
      setHasApproved(false)
    }
  }, [wallet])

  useEffect(() => {
    if (isApprovalConfirmed) {
      setHasApproved(true)
    }
  }, [isApprovalConfirmed])

  useEffect(() => {
    if (status === 'success') {
      setHasApproved(false)
    }
  }, [status])

  function handlePrevious() {
    setActiveStepId(activeStepId - 1)
  }

  function validateLastStep() {
    return true
  }

  function canGoNext() {
    try {
      if (isLastStep) return validateLastStep()
      return true
    } catch (e) {
      return false
    }
  }

  async function handleNext() {
    if (isLastStep) {
      // Check if we already approved or don't need approval
      if (hasApproved) {
        // Approval already done, create grant now
        await createGrantFromForm()
        return
      }

      // Check if we need approval first
      const needsApprove = await needsApproval()

      console.log('needsApprove', needsApprove)
      if (needsApprove) {
        await approve()
      }

      await createGrantFromForm()
      return
    } else {
      // Not the last step, just move to next step
      setActiveStepId(activeStepId + 1)
    }
  }

  const showPreviousButton = activeStepId > 1
  const showNextButton = activeStepId <= FORM_STEPS.length

  return (
    <>
      <div className="flex flex-col justify-between w-full h-full">
        <FormContent
          activeStepId={activeStepId}
          completedStepsIds={completedStepsIds}
          formSteps={FORM_STEPS}
          setActiveStepId={setActiveStepId}>
          <StepContent stepId={activeStepId} wallet={wallet} chainId={chainId} />
        </FormContent>
        <FormNavigation
          canGoNext={canGoNext()}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canShowNextButton={showNextButton}
          canShowPreviousButton={showPreviousButton}
          canSkipStep={false}
        />
      </div>
    </>
  )
}

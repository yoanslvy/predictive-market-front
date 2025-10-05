import type { Dispatch, ReactNode, SetStateAction } from 'react'

import { Tick } from '../../../_svg/Tick'
import { XInFilledCircle } from '../../../_svg/XInFilledCircle'
import { useAirdropStore } from '../_hooks/useAirdropStore'
import { useVestingStore } from '../_hooks/useVestingStore'
import { Steps } from './Steps'
import { Title } from './Title'

export function FormContent<T extends { id: number; title: string; name: string }>({
  activeStepId,
  completedStepsIds,
  formSteps,
  children,
  setActiveStepId,
  eventType,
}: {
  activeStepId: number
  completedStepsIds: number[]
  formSteps: T[]
  children: ReactNode
  setActiveStepId: Dispatch<SetStateAction<number>>
  eventType: 'vesting' | 'airdrop'
}) {
  const activeStep = formSteps.find((step) => step.id === activeStepId) ?? formSteps[0]!

  const {
    emissionType: airdropEmissionType,
    tokenSymbol: airdropTokenSymbol,
    mintSettings: airdropMintSettings,

    coverUrl: airdropCoverUrl,
    logoUrl: airdropLogoUrl,
    distributionType,
    airdropTokenAmountUi,
    activeRecipients,
  } = useAirdropStore((state) => ({
    emissionType: state.emissionType,
    tokenSymbol: state.tokenSymbol,
    mintSettings: state.mintSettings,
    coverUrl: state.coverUrl,
    logoUrl: state.logoUrl,
    distributionType: state.distributionType,
    airdropTokenAmountUi: state.airdropTokenAmountUi,
    activeRecipients: state.activeRecipients,
  }))

  const {
    emissionType: vestingEmissionType,
    tokenSymbol: vestingTokenSymbol,
    mintSettings: vestingMintSettings,

    coverUrl: vestingCoverUrl,
    logoUrl: vestingLogoUrl,

    activeFluxes,
  } = useVestingStore((state) => ({
    emissionType: state.emissionType,
    tokenSymbol: state.tokenSymbol,
    mintSettings: state.mintSettings,

    coverUrl: state.coverUrl,
    logoUrl: state.logoUrl,

    activeFluxes: state.activeFluxes,
  }))

  function getSubtitle(stepId: number) {
    if (eventType === 'airdrop') {
      switch (stepId) {
        case 1:
          return 'Airdrop'
        case 2:
          return airdropEmissionType.title
        case 3:
          return airdropMintSettings.isMintAllowed ? (
            <div className="flex items-center gap-x-[0.5rem]">
              <Tick fill="white" width="16" height="16" />
              <p className="text-[13px] text-[#757A8B]">Mint Allowed</p>
            </div>
          ) : (
            <div className="flex items-center gap-x-[0.5rem]">
              <XInFilledCircle stroke="white" fill="transparent" width={24} height={24} />
              <p className="text-[13px] text-[#757A8B]">Mint Not Allowed</p>
            </div>
          )
        case 4:
          return airdropTokenSymbol ? `${airdropTokenSymbol} ${distributionType.title}` : undefined
        case 5:
          return distributionType.title === 'Uniform'
            ? `${airdropTokenAmountUi} ${airdropTokenSymbol}`
            : `${activeRecipients.length} Airdrops`
        case 6:
          return distributionType.title === 'Uniform' ? (
            `${activeRecipients.length} Airdrops`
          ) : (
            <div className="flex items-center gap-x-[0.5rem] mr-[1em]">
              {airdropCoverUrl ? (
                <Tick fill="white" width="16" height="16" />
              ) : (
                <XInFilledCircle stroke="white" fill="transparent" width={24} height={24} />
              )}
              <p className="text-[13px] text-[#757A8B]">Cover</p>
              {airdropLogoUrl ? (
                <Tick fill="white" width="16" height="16" />
              ) : (
                <XInFilledCircle stroke="white" fill="transparent" width={24} height={24} />
              )}
              <p className="text-[13px] text-[#757A8B]">Logo</p>
            </div>
          )
        case 7:
          return distributionType.title === 'Uniform' ? (
            <div className="flex items-center gap-x-[0.5rem] mr-[1em]">
              {airdropCoverUrl ? (
                <Tick fill="white" width="16" height="16" />
              ) : (
                <XInFilledCircle stroke="white" fill="transparent" width={24} height={24} />
              )}
              <p className="text-[13px] text-[#757A8B]">Cover</p>
              {airdropLogoUrl ? (
                <Tick fill="white" width="16" height="16" />
              ) : (
                <XInFilledCircle stroke="white" fill="transparent" width={24} height={24} />
              )}
              <p className="text-[13px] text-[#757A8B]">Logo</p>
            </div>
          ) : undefined
        default:
          return undefined
      }
    } else {
      switch (stepId) {
        case 1:
          return 'Vesting'
        case 2:
          return vestingEmissionType.title
        case 3:
          return vestingMintSettings.isMintAllowed ? (
            <div className="flex items-center gap-x-[0.5rem]">
              <Tick fill="white" width="16" height="16" />
              <p className="text-[13px] text-[#757A8B]">Mint Allowed</p>
            </div>
          ) : (
            <div className="flex items-center gap-x-[0.5rem]">
              <XInFilledCircle stroke="white" fill="transparent" width={24} height={24} />
              <p className="text-[13px] text-[#757A8B]">Mint Not Allowed</p>
            </div>
          )
        case 4:
          return vestingTokenSymbol ?? undefined
        case 5:
          return `${activeFluxes.length} Vesting`
        case 6:
          return (
            <div className="flex items-center gap-x-[0.5rem] mr-[1em]">
              {vestingCoverUrl ? (
                <Tick fill="white" width="16" height="16" />
              ) : (
                <XInFilledCircle stroke="white" fill="transparent" width={24} height={24} />
              )}
              <p className="text-[13px] text-[#757A8B]">Cover</p>
              {vestingLogoUrl ? (
                <Tick fill="white" width="16" height="16" />
              ) : (
                <XInFilledCircle stroke="white" fill="transparent" width={24} height={24} />
              )}
              <p className="text-[13px] text-[#757A8B]">Logo</p>
            </div>
          )
        default:
          return undefined
      }
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

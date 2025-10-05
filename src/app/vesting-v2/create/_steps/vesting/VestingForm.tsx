'use client'

import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'

import { useEffect, useState } from 'react'

import { Address, isAddress } from 'viem'

import { getNormalizedTokenAmount } from '../../../_utils/utils'
import { AddCover } from '../_components/AddCover'
import { FormContent } from '../_components/FormContent'
import { FormNavigation } from '../_components/FormNavigation'
import { SelectEventType } from '../_components/SelectEventType'
import { useVesting } from '../_hooks/useVesting'
import { useVestingStore } from '../_hooks/useVestingStore'
import { Checkout } from './Checkout'
import { CheckoutCliff } from './CheckoutCliff'
import { CheckoutCliffExponential } from './CheckoutCliffExponential'
import { CheckoutModal } from './CheckoutModal'
import { CheckoutMonthlyUnlocks } from './CheckoutMonthlyUnlocks'
import { CheckoutSteps } from './CheckoutSteps'
import { CheckoutTimelock } from './CheckoutTimelock'
import { CheckoutUnlockCliff } from './CheckoutUnlockCliff'
import { MintSettings } from './MintSettings'
import { SelectEmissionType } from './SelectEmissionType'
import { TokenDetails } from './TokenDetails'
import { VestingDetails } from './VestingDetails'
import { VestingDetailsCliff } from './VestingDetailsCliff'
import { VestingDetailsCliffExponential } from './VestingDetailsCliffExponential'
import { VestingDetailsExponential } from './VestingDetailsExponential'
import { VestingDetailsMonthlyUnlocks } from './VestingDetailsMonthlyUnlocks'
import { VestingDetailsSteps } from './VestingDetailsSteps'
import { VestingDetailsTimelock } from './VestingDetailsTimelock'
import { VestingDetailsUnlockCliff } from './VestingDetailsUnlockCliff'

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
  vestingContract: string
}

const FORM_STEPS: Step[] = [
  {
    name: 'Event Type',
    title: 'Select Event Type',
    id: 1,
  },
  {
    name: 'Emission Type',
    title: 'Select Emission Type',
    id: 2,
  },
  {
    name: 'NFT Details',
    title: 'Mint settings for Vesting',
    id: 3,
  },
  {
    name: 'Token Details',
    title: 'Add Token Details',
    id: 4,
  },
  {
    name: 'Vesting Details',
    title: 'Add Vesting Details',
    id: 5,
  },
  {
    name: 'Cover',
    title: 'Add Cover (Optional)',
    id: 6,
    isOptional: true,
    subtitle: 'If you skip this step - airdrop page will be displayed without cover.',
  },
  {
    name: 'Checkout',
    title: 'Checkout',
    id: 7,
  },
]

function StepContent({ stepId, wallet, chainId, vestingContract }: StepContentProps) {
  const {
    coverUrl,
    logoUrl,
    setCoverUrl,
    setLogoUrl,
    tokenAmountUi,
    tokenPriceUsd,
    tokenSymbol,
    tokenAddress,
    emissionType,
    tokenDecimals,
  } = useVestingStore((state) => ({
    coverUrl: state.coverUrl,
    logoUrl: state.logoUrl,
    setCoverUrl: state.setCoverUrl,
    setLogoUrl: state.setLogoUrl,
    tokenSymbol: state.tokenSymbol,
    tokenAmountUi: state.tokenAmountUi,
    tokenPriceUsd: state.tokenPriceUsd,
    tokenAddress: state.tokenAddress,
    emissionType: state.emissionType,
    tokenDecimals: state.tokenDecimals,
  }))

  const getVestingDetailsComponent = () => {
    if (
      !(
        tokenSymbol &&
        tokenAddress &&
        typeof tokenAmountUi === 'number' &&
        typeof tokenDecimals === 'number'
      )
    )
      return null
    switch (emissionType.value) {
      case 'monthlyUnlocks':
        return (
          <VestingDetailsMonthlyUnlocks
            tokenSymbol={tokenSymbol}
            tokenAmountUi={tokenAmountUi}
            tokenPriceUsd={tokenPriceUsd}
            tokenDecimals={tokenDecimals}
          />
        )
      case 'cliff':
        return (
          <VestingDetailsCliff
            tokenSymbol={tokenSymbol}
            tokenAmountUi={tokenAmountUi}
            tokenPriceUsd={tokenPriceUsd}
            tokenDecimals={tokenDecimals}
          />
        )
      case 'unlockInSteps':
        return (
          <VestingDetailsSteps
            tokenSymbol={tokenSymbol}
            tokenAmountUi={tokenAmountUi}
            tokenPriceUsd={tokenPriceUsd}
            tokenDecimals={tokenDecimals}
          />
        )
      case 'timelock':
        return (
          <VestingDetailsTimelock
            tokenSymbol={tokenSymbol}
            tokenAmountUi={tokenAmountUi}
            tokenPriceUsd={tokenPriceUsd}
            tokenDecimals={tokenDecimals}
          />
        )
      case 'exponential':
        return (
          <VestingDetailsExponential
            tokenSymbol={tokenSymbol}
            tokenAmountUi={tokenAmountUi}
            tokenPriceUsd={tokenPriceUsd}
            tokenDecimals={tokenDecimals}
          />
        )
      case 'unlockCliff':
        return (
          <VestingDetailsUnlockCliff
            tokenSymbol={tokenSymbol}
            tokenAmountUi={tokenAmountUi}
            tokenPriceUsd={tokenPriceUsd}
            tokenDecimals={tokenDecimals}
          />
        )
      case 'cliffExponential':
        return (
          <VestingDetailsCliffExponential
            tokenSymbol={tokenSymbol}
            tokenAmountUi={tokenAmountUi}
            tokenPriceUsd={tokenPriceUsd}
            tokenDecimals={tokenDecimals}
          />
        )
      default:
        return (
          <VestingDetails
            tokenSymbol={tokenSymbol}
            tokenAmountUi={tokenAmountUi}
            tokenPriceUsd={tokenPriceUsd}
            tokenDecimals={tokenDecimals}
          />
        )
    }
  }

  const getCheckoutComponent = () => {
    switch (emissionType.value) {
      case 'cliff':
        return (
          <CheckoutCliff
            vestingContract={vestingContract as Address}
            chainId={chainId}
            wallet={wallet as Address}
            tokenAddress={tokenAddress as Address}
          />
        )
      case 'unlockInSteps':
        return (
          <CheckoutSteps
            vestingContract={vestingContract as Address}
            chainId={chainId}
            wallet={wallet as Address}
            tokenAddress={tokenAddress as Address}
          />
        )
      case 'monthlyUnlocks':
        return (
          <CheckoutMonthlyUnlocks
            vestingContract={vestingContract as Address}
            chainId={chainId}
            wallet={wallet as Address}
            tokenAddress={tokenAddress as Address}
          />
        )
      case 'timelock':
        return (
          <CheckoutTimelock
            vestingContract={vestingContract as Address}
            chainId={chainId}
            wallet={wallet as Address}
            tokenAddress={tokenAddress as Address}
          />
        )
      case 'unlockCliff':
        return (
          <CheckoutUnlockCliff
            vestingContract={vestingContract as Address}
            chainId={chainId}
            wallet={wallet as Address}
            tokenAddress={tokenAddress as Address}
          />
        )
      case 'cliffExponential':
        return (
          <CheckoutCliffExponential
            vestingContract={vestingContract as Address}
            chainId={chainId}
            wallet={wallet as Address}
            tokenAddress={tokenAddress as Address}
          />
        )
      default:
        return (
          <Checkout
            vestingContract={vestingContract as Address}
            chainId={chainId}
            wallet={wallet as Address}
            tokenAddress={tokenAddress as Address}
          />
        )
    }
  }

  const stepMap: Record<number, JSX.Element | null> = {
    1: <SelectEventType />,
    2: <SelectEmissionType />,
    3: <MintSettings />,
    4: <TokenDetails wallet={wallet} chainId={chainId} />,
    5: getVestingDetailsComponent(),
    6: (
      <AddCover
        coverUrl={coverUrl}
        setCoverUrl={setCoverUrl}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
      />
    ),
    7: getCheckoutComponent(),
  }

  return stepMap[stepId] ?? null
}

export function VestingForm({
  wallet,
  chainId,
  vestingContract,
}: {
  wallet: string
  chainId: number
  vestingContract: string
}) {
  const [activeStepId, setActiveStepId] = useState(1)
  const completedStepsIds = FORM_STEPS.filter((step) => step.id < activeStepId).map(({ id }) => id)
  const [opened, { close, open }] = useDisclosure()

  const lastStepId = FORM_STEPS.at(-1)!.id

  const {
    tokenAddress,
    tokenSymbol,
    fluxes,
    coverUrl,
    logoUrl,
    tokenDecimals,
    monthlyUnlocksFluxes,
    emissionType,
    cliffFluxes,
    timelockFluxes,
    stepsFluxes,
    exponentialFluxes,
    unlockCliffFluxes,
    cliffExponentialFluxes,
  } = useVestingStore((state) => ({
    tokenAddress: state.tokenAddress,
    tokenSymbol: state.tokenSymbol,
    tokenDecimals: state.tokenDecimals,
    fluxes: state.fluxes,
    coverUrl: state.coverUrl,
    logoUrl: state.logoUrl,
    monthlyUnlocksFluxes: state.monthlyUnlocksFluxes,
    emissionType: state.emissionType,
    cliffFluxes: state.cliffFluxes,
    timelockFluxes: state.timelockFluxes,
    stepsFluxes: state.stepsFluxes,
    exponentialFluxes: state.exponentialFluxes,
    unlockCliffFluxes: state.unlockCliffFluxes,
    cliffExponentialFluxes: state.cliffExponentialFluxes,
  }))

  const { checkout, writeCreateVesting, onClose, status } = useVesting({
    wallet,
    chainId,
    vestingContract,
    openModal: open,
  })

  useEffect(() => {
    if (!wallet) {
      setActiveStepId(1)
    }
  }, [wallet])

  function validateStep4() {
    if (
      !tokenAddress ||
      !tokenSymbol ||
      !isAddress(tokenAddress) ||
      typeof tokenDecimals !== 'number'
    )
      return false
    return true
  }

  function validateStep5() {
    switch (emissionType.value) {
      case 'monthlyUnlocks':
        if (monthlyUnlocksFluxes.length === 0) return false
        if (
          monthlyUnlocksFluxes.some(
            (recipient) => !recipient.amount || !recipient.address || !isAddress(recipient.address)
          )
        )
          return false
        if (typeof tokenDecimals !== 'number') return false
        for (const activeRecipient of monthlyUnlocksFluxes) {
          const amountPerStep =
            ((activeRecipient.amount ?? 0) * 10 ** 18) / (activeRecipient.months ?? 1) / 10 ** 18
          const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)
          if (!amountPerStepNorm) return false
        }
        return true
      case 'cliff':
        if (cliffFluxes.length === 0) return false
        if (
          cliffFluxes.some(
            (recipient) =>
              !recipient.amount ||
              !recipient.address ||
              !isAddress(recipient.address) ||
              dayjs(recipient.cliffDate).isAfter(dayjs(recipient.endDate))
          )
        )
          return false
        return true
      case 'timelock':
        if (timelockFluxes.length === 0) return false
        if (
          timelockFluxes.some(
            (recipient) =>
              !recipient.amount ||
              !recipient.address ||
              !isAddress(recipient.address) ||
              dayjs(recipient.unlockDate).isBefore(dayjs())
          )
        )
          return false
        return true
      case 'unlockInSteps':
        if (stepsFluxes.length === 0) return false
        if (
          stepsFluxes.some(
            (recipient) =>
              !recipient.amount ||
              !recipient.address ||
              !isAddress(recipient.address) ||
              dayjs(recipient.startDate).isAfter(dayjs(recipient.endDate))
          )
        )
          return false
        if (typeof tokenDecimals !== 'number') return false
        for (const activeRecipient of stepsFluxes) {
          const amountPerStep =
            ((activeRecipient.amount ?? 0) * 10 ** 18) / (activeRecipient.steps ?? 1) / 10 ** 18
          const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)
          if (!amountPerStepNorm) return false
        }
        return true
      case 'exponential':
        if (exponentialFluxes.length === 0) return false
        if (
          exponentialFluxes.some(
            (recipient) =>
              !recipient.amount ||
              !recipient.address ||
              !isAddress(recipient.address) ||
              dayjs(recipient.startDate).isAfter(dayjs(recipient.endDate))
          )
        )
          return false
        return true
      case 'unlockCliff':
        if (unlockCliffFluxes.length === 0) return false
        if (
          unlockCliffFluxes.some(
            (recipient) =>
              !recipient.amount ||
              !recipient.initialUnlockedAmount ||
              !recipient.address ||
              !isAddress(recipient.address) ||
              dayjs(recipient.startDate).isAfter(dayjs(recipient.endDate)) ||
              dayjs(recipient.cliffDate).isAfter(dayjs(recipient.endDate)) ||
              dayjs(recipient.cliffDate).isBefore(dayjs(recipient.startDate))
          )
        )
          return false
        return true
      case 'cliffExponential':
        if (cliffExponentialFluxes.length === 0) return false
        if (
          cliffExponentialFluxes.some(
            (recipient) =>
              !recipient.amount ||
              !recipient.initialUnlockedAmount ||
              !recipient.address ||
              !isAddress(recipient.address) ||
              dayjs(recipient.startDate).isAfter(dayjs(recipient.endDate)) ||
              dayjs(recipient.cliffDate).isAfter(dayjs(recipient.endDate)) ||
              dayjs(recipient.cliffDate).isBefore(dayjs(recipient.startDate))
          )
        )
          return false
        return true
      case 'linear':
        if (fluxes.length === 0) return false
        if (
          fluxes.some(
            (recipient) => !recipient.amount || !recipient.address || !isAddress(recipient.address)
          )
        )
          return false
        return true
      default:
        return true
    }
  }

  function canGoNext() {
    try {
      if (activeStepId === 4) return validateStep4()
      if (activeStepId === 5) return validateStep5()
      return true
    } catch (e) {
      return false
    }
  }

  function handlePrevious() {
    setActiveStepId(activeStepId - 1)
  }

  const isLastStep = activeStepId === lastStepId

  function handleNext() {
    if (isLastStep) {
      void checkout()
      return
    }
    setActiveStepId(activeStepId + 1)
  }

  const showPreviousButton = activeStepId > 1
  const showNextButton = activeStepId <= FORM_STEPS.length
  const skipMode = activeStepId === 6 && !coverUrl && !logoUrl

  return (
    <>
      <CheckoutModal
        modalOpened={opened}
        status={status}
        wallet={wallet}
        handleRetry={checkout}
        chainId={chainId}
        txHash={writeCreateVesting.data ?? ''}
        onClose={() => {
          onClose()
          close()
        }}
      />
      <div className="flex flex-col justify-between w-full h-full">
        <FormContent
          eventType="vesting"
          activeStepId={activeStepId}
          completedStepsIds={completedStepsIds}
          formSteps={FORM_STEPS}
          setActiveStepId={setActiveStepId}>
          <StepContent
            stepId={activeStepId}
            wallet={wallet}
            chainId={chainId}
            vestingContract={vestingContract}
          />
        </FormContent>
        <FormNavigation
          canGoNext={canGoNext()}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canShowNextButton={showNextButton}
          canShowPreviousButton={showPreviousButton}
          canSkipStep={skipMode}
        />
      </div>
    </>
  )
}

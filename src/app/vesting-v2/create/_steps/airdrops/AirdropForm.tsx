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
import { useAirdrop } from '../_hooks/useAirdrop'
import { useAirdropApprove } from '../_hooks/useAirdropApprove'
import { useAirdropBatches } from '../_hooks/useAirdropBatches'
import { useAirdropStore } from '../_hooks/useAirdropStore'
import { AddAirdropDetails } from './AddAirdropDetails'
import { AddAirdropDetailsInSteps } from './AddAirdropDetailsInSteps'
import { AddAirdropDetailsLinear } from './AddAirdropDetailsLinear'
import { Checkout } from './Checkout'
import { CheckoutLinear } from './CheckoutLinear'
import { CheckoutModal } from './CheckoutModal'
import { CheckoutModalApproveAirdrop } from './CheckoutModalApproveAirdrop'
import { CheckoutSteps } from './CheckoutSteps'
import { MintSettings } from './MintSettings'
import { RecipientsDetails } from './RecipientsDetails'
import { RecipientsDetailsUniform } from './RecipientsDetailsUniform'
import { SelectEmissionType } from './SelectEmissionType'
import { TokenAmount } from './TokenAmount'

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
    title: 'Mint settings for Airdrop',
    id: 3,
  },
  {
    name: 'Airdrop Details',
    title: 'Add Airdrop Details',
    id: 4,
  },
  {
    name: 'Recipients Details',
    title: 'Recipients Details',
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
    title: 'Airdrop Checkout',
    id: 7,
  },
] as const

const FORM_STEPS_UNIFORM: Step[] = [
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
    title: 'Mint settings for Airdrop',
    id: 3,
  },
  {
    name: 'Airdrop Details',
    title: 'Add Airdrop Details',
    id: 4,
  },
  {
    name: 'Token Amount',
    title: 'Add Token Amount',
    id: 5,
  },
  {
    name: 'Recipients Details',
    title: 'Recipients Details',
    id: 6,
  },
  {
    name: 'Cover',
    title: 'Add Cover (Optional)',
    id: 7,
    isOptional: true,
    subtitle: 'If you skip this step - airdrop page will be displayed without cover.',
  },
  {
    name: 'Checkout',
    title: 'Airdrop Checkout',
    id: 8,
  },
] as const

function StepContent({ stepId, wallet, chainId, vestingContract }: StepContentProps) {
  const {
    coverUrl,
    logoUrl,
    setCoverUrl,
    setLogoUrl,
    tokenSymbol,
    tokenAmountUi,
    tokenPriceUsd,
    distributionType,
    airdropTokenAmountUi,
    emissionType,
    endDate,
    startDate,
    tokenDecimals,
    tokenAddress,
  } = useAirdropStore((state) => ({
    coverUrl: state.coverUrl,
    logoUrl: state.logoUrl,
    setCoverUrl: state.setCoverUrl,
    setLogoUrl: state.setLogoUrl,
    tokenSymbol: state.tokenSymbol,
    tokenAmountUi: state.tokenAmountUi,
    tokenPriceUsd: state.tokenPriceUsd,
    tokenDecimals: state.tokenDecimals,
    distributionType: state.distributionType,
    airdropTokenAmountUi: state.airdropTokenAmountUi,
    emissionType: state.emissionType,
    startDate: state.startDate,
    endDate: state.endDate,
    tokenAddress: state.tokenAddress,
  }))

  const isUniform = distributionType.title === 'Uniform'

  const getAirdropDetailsComponent = () => {
    if (emissionType.value === 'unlockInSteps') {
      return <AddAirdropDetailsInSteps wallet={wallet} chainId={chainId} />
    }
    if (emissionType.value === 'scheduled') {
      return <AddAirdropDetails wallet={wallet} chainId={chainId} />
    }
    return <AddAirdropDetailsLinear wallet={wallet} chainId={chainId} />
  }

  const getCheckoutComponent = () => {
    if (emissionType.value === 'unlockInSteps') {
      return (
        <CheckoutSteps
          chainId={chainId}
          vestingContract={vestingContract}
          wallet={wallet as Address}
          tokenAddress={tokenAddress as Address}
        />
      )
    }
    if (emissionType.value === 'scheduled') {
      return (
        <Checkout
          chainId={chainId}
          vestingContract={vestingContract}
          wallet={wallet as Address}
          tokenAddress={tokenAddress as Address}
        />
      )
    }
    return (
      <CheckoutLinear
        chainId={chainId}
        vestingContract={vestingContract}
        tokenAddress={tokenAddress as Address}
        wallet={wallet as Address}
      />
    )
  }

  const getTokenAmount = () => {
    if (
      typeof tokenSymbol === 'string' &&
      typeof tokenAmountUi === 'number' &&
      typeof tokenDecimals === 'number'
    ) {
      return (
        <TokenAmount
          tokenSymbol={tokenSymbol}
          tokenAmountUi={tokenAmountUi}
          tokenPriceUsd={tokenPriceUsd}
          tokenDecimals={tokenDecimals}
        />
      )
    }
    return null
  }

  const getRecipientsDetailsUniform = () => {
    if (
      typeof tokenSymbol === 'string' &&
      typeof tokenAmountUi === 'number' &&
      typeof airdropTokenAmountUi === 'number' &&
      !!startDate &&
      typeof tokenDecimals === 'number'
    ) {
      return (
        <RecipientsDetailsUniform
          tokenSymbol={tokenSymbol}
          tokenAmountUi={tokenAmountUi}
          tokenPriceUsd={tokenPriceUsd}
          airdropTokenAmountUi={airdropTokenAmountUi}
          startDate={startDate}
          endDate={emissionType.value === 'scheduled' ? null : endDate}
          tokenDecimals={tokenDecimals}
        />
      )
    }
    return null
  }

  const getRecipientsDetailsNonUniform = () => {
    if (
      typeof tokenSymbol === 'string' &&
      typeof tokenAmountUi === 'number' &&
      !!startDate &&
      typeof tokenDecimals === 'number'
    ) {
      return (
        <RecipientsDetails
          tokenSymbol={tokenSymbol}
          tokenAmountUi={tokenAmountUi}
          tokenPriceUsd={tokenPriceUsd}
          startDate={startDate}
          endDate={emissionType.value === 'scheduled' ? null : endDate}
          tokenDecimals={tokenDecimals}
        />
      )
    }
    return null
  }

  const uniformStepMap: Record<number, JSX.Element | null> = {
    1: <SelectEventType />,
    2: <SelectEmissionType />,
    3: <MintSettings />,
    4: getAirdropDetailsComponent(),
    5: getTokenAmount(),
    6: getRecipientsDetailsUniform(),
    7: (
      <AddCover
        coverUrl={coverUrl}
        setCoverUrl={setCoverUrl}
        logoUrl={logoUrl}
        setLogoUrl={setLogoUrl}
      />
    ),
    8: getCheckoutComponent(),
  }

  const nonUniformStepMap: Record<number, JSX.Element | null> = {
    1: <SelectEventType />,
    2: <SelectEmissionType />,
    3: <MintSettings />,
    4: getAirdropDetailsComponent(),
    5: getRecipientsDetailsNonUniform(),
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

  if (isUniform) {
    return uniformStepMap[stepId] ?? null
  }
  return nonUniformStepMap[stepId] ?? null
}

export function AirdropForm({
  wallet,
  chainId,
  vestingContract,
}: {
  wallet: string
  chainId: number
  vestingContract: string
}) {
  const {
    tokenAddress,
    coverUrl,
    logoUrl,
    startDate,
    endDate,
    tokenSymbol,
    tokenDecimals,
    tokenAmountUi,
    distributionType,
    airdropTokenAmountUi,
    emissionType,
    steps,
    activeRecipients,
  } = useAirdropStore((state) => ({
    tokenAddress: state.tokenAddress,
    coverUrl: state.coverUrl,
    logoUrl: state.logoUrl,
    startDate: state.startDate,
    endDate: state.endDate,
    tokenSymbol: state.tokenSymbol,
    tokenDecimals: state.tokenDecimals,
    tokenAmountUi: state.tokenAmountUi,
    distributionType: state.distributionType,
    airdropTokenAmountUi: state.airdropTokenAmountUi,
    emissionType: state.emissionType,
    steps: state.steps,
    activeRecipients: state.activeRecipients,
  }))

  const [activeStepId, setActiveStepId] = useState(1)
  const [opened, { close, open }] = useDisclosure()
  const [approveOpened, { close: closeApprove, open: openApprove }] = useDisclosure()

  const formSteps = distributionType.title === 'Uniform' ? FORM_STEPS_UNIFORM : FORM_STEPS

  const completedStepsIds = formSteps.filter((step) => step.id < activeStepId).map(({ id }) => id)

  const lastStepId = formSteps.at(-1)!.id

  const isLastStep = activeStepId === lastStepId

  useEffect(() => {
    if (!wallet) {
      setActiveStepId(1)
    }
  }, [wallet])

  function validateStep4Uniform() {
    if (
      !tokenAddress ||
      !isAddress(tokenAddress) ||
      !tokenSymbol ||
      typeof tokenDecimals !== 'number'
    )
      return false
    if (!startDate || dayjs(startDate).isBefore(dayjs())) return false
    if (emissionType.value === 'unlockInSteps' && (!steps || !endDate)) return false
    if (emissionType.value === 'linear' && !endDate) return false
    return true
  }

  function validateStep5Uniform() {
    if (!airdropTokenAmountUi || !tokenAmountUi) return false
    if (airdropTokenAmountUi > tokenAmountUi) return false
    if (emissionType.value === 'unlockInSteps') {
      if (!steps || typeof tokenDecimals !== 'number') return false
      const amountPerStep = ((airdropTokenAmountUi ?? 0) * 10 ** 18) / (steps ?? 1) / 10 ** 18
      const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)
      if (!amountPerStepNorm) return false
    }
    return true
  }

  function validateStep6Uniform() {
    if (activeRecipients.length === 0) return false
    if (
      activeRecipients.some(
        (recipient) => !recipient.amount || !recipient.address || !isAddress(recipient.address)
      )
    )
      return false
    return true
  }

  function validateStep4NonUniform() {
    if (
      !tokenAddress ||
      !isAddress(tokenAddress) ||
      !tokenSymbol ||
      typeof tokenDecimals !== 'number'
    )
      return false
    if (!startDate || dayjs(startDate).isBefore(dayjs())) return false
    if (emissionType.value === 'unlockInSteps' && (!steps || !endDate)) return false
    if (emissionType.value === 'linear' && !endDate) return false
    return true
  }

  function validateStep5NonUniform() {
    if (activeRecipients.length === 0) return false
    if (
      activeRecipients.some(
        (recipient) => !recipient.amount || !recipient.address || !isAddress(recipient.address)
      )
    )
      return false
    if (emissionType.value === 'unlockInSteps') {
      if (!steps || typeof tokenDecimals !== 'number') return false
      for (const activeRecipient of activeRecipients) {
        const amountPerStep = ((activeRecipient.amount ?? 0) * 10 ** 18) / (steps ?? 1) / 10 ** 18
        const amountPerStepNorm = getNormalizedTokenAmount(amountPerStep, tokenDecimals)
        if (!amountPerStepNorm) return false
      }
    }
    return true
  }

  function handlePrevious() {
    setActiveStepId(activeStepId - 1)
  }

  const { checkout, writeCreateVesting, onClose, status } = useAirdrop({
    wallet,
    chainId,
    vestingContract,
    openModal: open,
  })

  const {
    approve,
    writeIncreaseAllowance,
    onClose: onCloseAirdropApprove,
    status: statusAirdropApprove,
    needsApprove,
    airdropApproveQuery,
  } = useAirdropApprove({
    wallet,
    chainId,
    vestingContract,
    openModal: openApprove,
    enabled: isLastStep,
  })

  const { airdropBatchesQuery } = useAirdropBatches({
    recipients: activeRecipients,
    vestingContract,
    chainId,
    enabled:
      isLastStep && airdropApproveQuery.status === 'success' && airdropApproveQuery.data === false,
    wallet,
  })

  function validateLastStep() {
    return airdropBatchesQuery.status === 'success' || airdropApproveQuery.status === 'success'
  }

  function canGoNext() {
    try {
      if (distributionType.title === 'Uniform') {
        if (activeStepId === 4) return validateStep4Uniform()
        if (activeStepId === 5) return validateStep5Uniform()
        if (activeStepId === 6) return validateStep6Uniform()
        if (isLastStep) return validateLastStep()
        return true
      } else {
        if (activeStepId === 4) return validateStep4NonUniform()
        if (activeStepId === 5) return validateStep5NonUniform()
        if (isLastStep) return validateLastStep()
        return true
      }
    } catch (e) {
      return false
    }
  }

  async function handleNext() {
    if (isLastStep) {
      const needsApproval = await needsApprove()
      if (needsApproval) {
        await approve()
      } else {
        void checkout()
      }
      return
    }
    setActiveStepId(activeStepId + 1)
  }

  const showPreviousButton = activeStepId > 1
  const showNextButton = activeStepId <= formSteps.length
  const skipMode =
    activeStepId === (distributionType.title === 'Uniform' ? 7 : 6) && !coverUrl && !logoUrl

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
      <CheckoutModalApproveAirdrop
        modalOpened={approveOpened}
        status={statusAirdropApprove}
        wallet={wallet}
        handleRetry={approve}
        chainId={chainId}
        txHash={writeIncreaseAllowance.data ?? ''}
        onClose={() => {
          onCloseAirdropApprove()
          closeApprove()
        }}
      />
      <div className="flex flex-col justify-between w-full h-full">
        <FormContent
          eventType="airdrop"
          activeStepId={activeStepId}
          completedStepsIds={completedStepsIds}
          formSteps={formSteps}
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

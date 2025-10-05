import { VestingByIdQuery } from '@/.graphclient'
import { Modal, Divider } from '@mantine/core'
import Link from 'next/link'
import { toast } from 'react-toastify'

import { useState } from 'react'

import { Address } from 'viem'

import { config } from '@/src/app/(providers)/wagmiConfig'
import { simulateContract, waitForTransactionReceipt } from '@wagmi/core'
import { useChainId, useSwitchChain, useWriteContract } from 'wagmi'

import { shortenEthAddress } from '@/src/app/minter/global'
import { vestingManagerAbi } from '@/src/interfaces/web3/abis/vestingManager'
import { vestingV2Contracts } from '@/src/interfaces/web3/vesting-v2/contracts'
import {
  vestingByIdCachedTag,
  fluxesPagedCachedTag,
  walletStatsCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'
import { chainMetadata } from '@/src/utils/global'

import { Btn } from '../../_components/Btn'
import { useRefresh } from '../../_hooks/useRefresh'
import { Loader } from '../../_svg/Loader'
import { TickInFilledCircle } from '../../_svg/TickInFilledCircle'
import { Warning } from '../../_svg/Warning'
import { XInFilledCircle } from '../../_svg/XInFilledCircle'
import { formatAmount, dateFormatter } from '../../_utils/utils'

function ModalTitle({ status }: { status: string }) {
  const titleConfig = {
    pending: {
      Icon: Loader,
      text: 'Stopping Vesting',
      iconProps: {},
      className: 'animate-spin',
    },
    success: { Icon: TickInFilledCircle, text: 'Vesting stopped', className: '', iconProps: {} },
    error: {
      Icon: XInFilledCircle,
      text: 'Something Went Wrong',
      className: '',
      iconProps: {},
    },
    default: {
      Icon: Warning,
      text: 'Are you sure you want to stop this vesting?',
      className: '',
      iconProps: {},
    },
  }

  const { Icon, text, className, iconProps } =
    titleConfig[status as keyof typeof titleConfig] || titleConfig.default

  return (
    <div className="flex items-center gap-[1rem]">
      {Icon && <Icon className={className} {...iconProps} />}
      <p className="font-bold">{text}</p>
    </div>
  )
}

const PendingContent = () => (
  <div className="flex flex-col items-center justify-center gap-y-[1rem]">
    <p className="text-[16px] text-[#757A8B]">
      Please wait while we process your transaction on the blockchain. This may take a few moments.
      Do not close or refresh the page until the process is complete.
    </p>
  </div>
)

const SuccessContent = ({
  closeModal,
  isPending,
  isMutationPending,
  wallet,
  flux,
}: ActionContentProps & {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
}) => {
  const isAirdrop = typeof flux.airdropVestingId === 'string'

  return (
    <div className="flex flex-col items-center justify-center gap-y-[1rem]">
      <div>
        <span className="contents text-[16px] text-[#757A8B]">
          This {isAirdrop ? 'airdrop' : 'vesting'} has been successfully stopped. All remaining
          token releases have been stopped and
        </span>{' '}
        <span className="contents text-[16px] text-white">
          tokens returned to the creator wallet address.
        </span>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
        <Btn
          loading={isPending || isMutationPending}
          onClick={closeModal}
          variant="white"
          className="w-full">
          <span className=" text-center text-[16px] font-bold">
            Back to {isAirdrop ? 'Airdrop' : 'Vesting'} Details
          </span>
        </Btn>
        <Btn
          as="link"
          href={`/vesting-v2/dashboard/fluxes?wallet=${wallet}&chain=${flux.chainId}`}
          variant="white"
          className="flex w-full">
          <span className="text-center text-[16px] text-black font-bold w-full">
            Back to the dashboard
          </span>
        </Btn>
      </div>
    </div>
  )
}

type ActionContentProps = {
  closeModal: () => void
  isPending: boolean
  isMutationPending: boolean
  wallet: string
}

const ErrorContent = ({
  isPending,
  isMutationPending,
  wallet,
  flux,
  handleStopFlux,
}: ActionContentProps & {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  handleStopFlux: () => Promise<void>
}) => (
  <div className="flex flex-col items-center justify-center gap-y-[1rem]">
    <span className="text-[16px] text-[#757A8B]">
      {"We couldn't process your stop vesting request. Please try again later"}
    </span>
    <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
      <Btn
        loading={isPending || isMutationPending}
        onClick={handleStopFlux}
        variant="white"
        className="w-full">
        <span className=" text-center text-[16px] font-bold">Try again</span>
      </Btn>
      <Btn
        as="link"
        href={`/vesting-v2/dashboard/fluxes?wallet=${wallet}&chainId=${flux.chainId}`}
        variant="transparent"
        className="w-full">
        <span className=" text-center text-[16px] text-white font-bold">Back to the dashboard</span>
      </Btn>
    </div>
  </div>
)

const VestingInfoDisplay = ({
  flux,
}: {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
}) => {
  const distributedAmount = flux.amountReleasedBD
  const totalAmount = flux.amountBD
  const remainingBalance = totalAmount - distributedAmount
  const nextUnlockDate = flux.nextUnlockDate as string | null

  let unlocksLeft = flux.tranches.filter((tranche) => tranche.time * 1000 > Date.now()).length

  if (flux.vestingEmissionType === 'SCHEDULED') {
    unlocksLeft = unlocksLeft === 2 ? 1 : unlocksLeft
  }

  const tokenSymbol = flux.tokenVested.symbol

  const shouldShowNextUnlockAndUnlocksLeft =
    flux.vestingEmissionType === 'SCHEDULED' ||
    flux.vestingEmissionType === 'UNLOCK_IN_STEPS' ||
    flux.vestingEmissionType === 'MONTHLY_UNLOCKS'

  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-[#202228] p-[16px]">
      <div className="flex flex-col items-start w-full">
        <div className="flex w-full items-center gap-x-[2rem]">
          <div>
            <p className="text-[12px] text-[#757A8B]">Recipient</p>
            <Link
              href={`${chainMetadata[flux.chainId].explorer.url}/address/${
                flux.beneficiaryId.split('-')[1]
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[16px] text-[#F0F2FB] underline">
              {shortenEthAddress(flux.beneficiaryId.split('-')[1])}
            </Link>
          </div>
        </div>
        <Divider my="xs" className="w-full" color="#202228" />
        <div className="grid w-full grid-cols-2">
          <div>
            <p className="text-[12px] text-[#757A8B]">Total paid out</p>
            <p className="text-[16px] text-[#F0F2FB]">
              {formatAmount(distributedAmount)} {tokenSymbol}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-[#757A8B]">Remaining Balance</p>
            <p className="text-[16px] text-[#F0F2FB]">
              {formatAmount(remainingBalance)} {tokenSymbol}
            </p>
          </div>
        </div>
        {shouldShowNextUnlockAndUnlocksLeft && (
          <>
            <Divider my="xs" className="w-full" color="#202228" />
            <div className="grid w-full grid-cols-2">
              <div>
                <p className="text-[12px] text-[#757A8B]">Next unlock date</p>
                <p className="text-[16px] text-[#F0F2FB]">
                  {!nextUnlockDate ? '-' : dateFormatter(new Date(Number(nextUnlockDate) * 1000))}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-[#757A8B]">Unlocks left</p>
                <p className="text-[16px] text-[#F0F2FB]">{unlocksLeft}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

type ConfirmationContentProps = {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  closeModal: () => void
  handleStopFlux: () => Promise<void>
  isPending: boolean
  isMutationPending: boolean
}

const ConfirmationContent = ({
  flux,
  closeModal,
  handleStopFlux,
  isPending,
  isMutationPending,
}: ConfirmationContentProps) => {
  const isAirdrop = typeof flux.airdropVestingId === 'string'

  return (
    <div className="flex flex-col items-center justify-center gap-y-[1rem]">
      <p className="text-[16px] text-[#757A8B]">
        Stopping this {isAirdrop ? 'airdrop' : 'vesting'} will immediately stop all future token
        releases. This action is irreversible. Do you wish to proceed?
      </p>
      <div className="flex w-full flex-col gap-y-[1rem]">
        <VestingInfoDisplay flux={flux} />
        <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
          <Btn onClick={closeModal} className="w-full" variant="white">
            <span className=" text-center text-[16px]">No, cancel</span>
          </Btn>
          <Btn
            loading={isPending || isMutationPending}
            onClick={handleStopFlux}
            variant="transparent"
            className="w-full">
            <span className=" text-center text-[16px]">Yes, stop</span>
          </Btn>
        </div>
      </div>
    </div>
  )
}

type StopFluxModalProps = {
  modalOpened: boolean
  closeModal: () => void
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  wallet: Address
}

export function StopFluxModal({ modalOpened, closeModal, flux, wallet }: StopFluxModalProps) {
  const { isPending, refresh } = useRefresh()

  const stopFluxMutation = useWriteContract()
  const [waitStatus, setWaitStatus] = useState<'pending' | 'success' | 'error' | 'idle'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const status = errorMsg ? 'error' : waitStatus !== 'idle' ? waitStatus : stopFluxMutation.status

  const isAirdrop = typeof flux.airdropVestingId === 'string'
  const name = isAirdrop ? 'Airdrop' : 'Vesting'

  const { switchChainAsync, reset: resetSwitchChain } = useSwitchChain()
  const chainId = useChainId()

  const handleStopFlux = async () => {
    try {
      setErrorMsg(null)
      setWaitStatus('pending')
      resetSwitchChain()
      stopFluxMutation.reset()
      if (flux.chainId !== chainId) {
        await switchChainAsync(
          {
            chainId: flux.chainId,
          },
          {
            onError: (error) => {
              throw new Error(error.message)
            },
          }
        )
      }
      const vestingContract: string | undefined =
        vestingV2Contracts[flux.chainId as keyof typeof vestingV2Contracts]
      if (!vestingContract) {
        throw new Error('Vesting contract not found for this chain')
      }
      const simulateCreateVesting = await simulateContract(config, {
        address: vestingContract as Address,
        abi: vestingManagerAbi,
        functionName: 'cancel',
        args: [BigInt(flux.id.split('-')[1])],
        chainId: flux.chainId,
      })
      if (!simulateCreateVesting.request) {
        throw new Error('Failed to simulate stop transaction')
      }
      if (simulateCreateVesting.request) {
        const hash = await stopFluxMutation.writeContractAsync(simulateCreateVesting.request)

        const { status } = await waitForTransactionReceipt(config, {
          hash,
          chainId: flux.chainId,
        })

        if (status === 'reverted') {
          throw new Error('Transaction reverted. Please try again later.')
        }
        if (status === 'success') {
          await new Promise((resolve) => setTimeout(resolve, 3000))
          setWaitStatus('success')
          toast.success(`${name} stopped successfully`)
          customRevalidateTag(vestingByIdCachedTag(flux.id))
          customRevalidateTag(fluxesPagedCachedTag(wallet, flux.chainId))
          customRevalidateTag(walletStatsCachedTag(wallet))
          refresh()
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Error occurred while stopping the ${name}`)
      setErrorMsg(err instanceof Error ? err.message : `Error occurred while stopping the ${name}`)
      setWaitStatus('error')
    }
  }

  const contentProps = {
    closeModal,
    isPending,
    isMutationPending: stopFluxMutation.isPending,
    wallet,
  }

  const content = (() => {
    switch (status) {
      case 'pending':
        return <PendingContent />
      case 'success':
        return <SuccessContent {...contentProps} flux={flux} />
      case 'error':
        return <ErrorContent {...contentProps} flux={flux} handleStopFlux={handleStopFlux} />
      default:
        return <ConfirmationContent {...contentProps} flux={flux} handleStopFlux={handleStopFlux} />
    }
  })()

  const allowClose = (() => {
    switch (status) {
      case 'pending':
        return false
      case 'success':
        return true
      case 'error':
        return true
      default:
        return true
    }
  })()

  return (
    <Modal
      title={<ModalTitle status={status} />}
      size="md"
      padding="sm"
      centered
      onClose={() => {
        stopFluxMutation.reset()
        resetSwitchChain()
        setErrorMsg(null)
        setWaitStatus('idle')
        closeModal()
      }}
      closeOnClickOutside={allowClose}
      withCloseButton={allowClose}
      opened={modalOpened}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 10,
      }}
      classNames={{
        body: 'bg-transparent p-4 ',
        header: 'bg-transparent',
        content: 'border border-[#2C2F3A] rounded-3xl p-[1rem] bg-[#17181C]',
        close: 'text-dim hover:text-white hover:bg-transparent',
        title: 'text-[#F0F2FB]  text-[24px]',
      }}>
      {content}
    </Modal>
  )
}

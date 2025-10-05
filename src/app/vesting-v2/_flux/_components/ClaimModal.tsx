import { VestingByIdQuery } from '@/.graphclient'
import { Modal, Divider } from '@mantine/core'
import Link from 'next/link'
import { toast } from 'react-toastify'

import { useState } from 'react'

import { Address } from 'viem'

import { config } from '@/src/app/(providers)/wagmiConfig'
import { simulateContract, waitForTransactionReceipt } from '@wagmi/core'
import { useChainId, useChains, useSwitchChain, useWalletClient, useWriteContract } from 'wagmi'

import { shortenEthAddress } from '@/src/app/minter/global'
import { vestingManagerAbi } from '@/src/interfaces/web3/abis/vestingManager'
import { vestingV2Contracts } from '@/src/interfaces/web3/vesting-v2/contracts'
import {
  fluxesPagedCachedTag,
  vestingByIdCachedTag,
  walletStatsCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'
import { chainMetadata } from '@/src/utils/global'

import { Btn } from '../../_components/Btn'
import { useRefresh } from '../../_hooks/useRefresh'
import { Loader } from '../../_svg/Loader'
import { TickInFilledCircle } from '../../_svg/TickInFilledCircle'
import { WithdrawInCircle } from '../../_svg/WithdrawInCircle'
import { XInFilledCircle } from '../../_svg/XInFilledCircle'
import { formatAmount } from '../../_utils/utils'

const ModalTitle = ({ status }: { status: string }) => {
  const titleConfig = {
    pending: {
      Icon: Loader,
      text: 'Processing Your Claim',
      className: 'animate-spin',
      iconProps: {},
    },
    success: {
      Icon: TickInFilledCircle,
      text: 'Claim Successful!',
      className: '',
      iconProps: {},
    },
    error: {
      Icon: XInFilledCircle,
      text: 'Something Went Wrong',
      className: '',
      iconProps: {},
    },
    default: {
      Icon: WithdrawInCircle,
      text: 'Confirm Claim',
      className: '',
      iconProps: {
        stroke: 'white',
      },
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
      Please wait while we process your request. This may take a few moments. Do not close or
      refresh the page.
    </p>
  </div>
)

type ActionContentProps = {
  closeModal: () => void
  isPending: boolean
  isMutationPending: boolean
  wallet: string
}

const SuccessContent = ({
  closeModal,
  isPending,
  isMutationPending,
  flux,
  txHash,
}: ActionContentProps & {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  txHash: string
}) => {
  const isAirdrop = typeof flux.airdropVestingId === 'string'
  return (
    <div className="flex flex-col items-center justify-center gap-[2em]">
      <span className="text-[16px] text-[#757A8B]">
        Your claim was successful. Your account has been updated.
      </span>
      <ClaimDisplay flux={flux} />
      <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
        <Btn
          loading={isPending || isMutationPending}
          onClick={closeModal}
          variant="white"
          className="w-full">
          <span className=" text-center text-[16px]">
            Back to {isAirdrop ? 'Airdrop' : 'Vesting'} Details
          </span>
        </Btn>
        <Btn
          as="link"
          href={`${chainMetadata[flux.chainId].explorer.url}/tx/${txHash}`}
          variant="transparent"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full">
          <span className=" text-center text-[16px] text-white">View Transaction details</span>
        </Btn>
      </div>
    </div>
  )
}

const ErrorContent = ({
  closeModal,
  isPending,
  isMutationPending,
  flux,
  handleClaim,
}: Omit<ActionContentProps, 'wallet' | 'amount'> & {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  handleClaim: () => Promise<void>
}) => {
  const isAirdrop = typeof flux.airdropVestingId === 'string'

  return (
    <div className="flex flex-col items-center justify-center gap-y-[1rem]">
      <span className="text-[16px] text-[#757A8B]">
        {"We couldn't process your claim. Please try again later"}
      </span>
      <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
        <Btn
          loading={isPending || isMutationPending}
          onClick={handleClaim}
          variant="white"
          className="w-full">
          <span className=" text-center text-[16px] font-bold">Try again</span>
        </Btn>
        <Btn onClick={closeModal} variant="transparent" className="w-full">
          <span className=" text-center text-[16px] text-white font-bold">
            Back to the {isAirdrop ? 'Airdrop' : 'Vesting'} page
          </span>
        </Btn>
      </div>
    </div>
  )
}

const ClaimDisplay = ({
  flux,
}: {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
}) => {
  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-[#202228] p-[16px]">
      <div className="flex flex-col items-start w-full">
        <div className="flex w-full items-center gap-x-[2rem]">
          <div>
            <p className="text-[12px] text-[#757A8B]">Claimable amount</p>
            <p className="text-[16px] text-[#F0F2FB]">
              {formatAmount(flux.amountWithdrawableBD)} {flux.tokenVested.symbol}
            </p>
          </div>
        </div>
        <Divider my="xs" className="w-full" color="#202228" />
        <div className="flex w-full items-center gap-x-[2rem]">
          <div>
            <p className="text-[12px] text-[#757A8B]">To</p>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`${chainMetadata[flux.chainId].explorer.url}/address/${
                flux.beneficiaryId.split('-')[1]
              }`}
              className="text-[16px] text-[#F0F2FB] underline">
              {shortenEthAddress(flux.beneficiaryId.split('-')[1])}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

type ConfirmationContentProps = ActionContentProps & {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  handleClaim: () => Promise<void>
  amount: number | null
}

const ConfirmationContent = ({
  flux,
  handleClaim,
  isPending,
  isMutationPending,
  amount,
}: ConfirmationContentProps) => {
  const isDisabled = amount === null || amount <= 0

  return (
    <div className="flex flex-col items-center justify-center gap-y-[1rem]">
      <p className="w-full text-[16px] text-[#757A8B]">Please confirm the transaction.</p>
      <div className="flex w-full flex-col gap-y-[1rem]">
        <ClaimDisplay flux={flux} />
        <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
          <Btn
            disabled={isDisabled}
            loading={isPending || isMutationPending}
            onClick={handleClaim}
            variant="white"
            className="w-full">
            <span className=" text-center text-[16px]">Confirm</span>
          </Btn>
        </div>
      </div>
    </div>
  )
}

type ClaimModalProps = {
  modalOpened: boolean
  closeModal: () => void
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  wallet: string
}

export function ClaimModal({ modalOpened, closeModal, flux, wallet }: ClaimModalProps) {
  const { isPending, refresh } = useRefresh()
  const writeClaim = useWriteContract()
  const [waitStatus, setWaitStatus] = useState<'pending' | 'success' | 'error' | 'idle'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const status = errorMsg ? 'error' : waitStatus !== 'idle' ? waitStatus : writeClaim.status
  const isAirdrop = typeof flux.airdropVestingId === 'string'
  const name = isAirdrop ? 'Airdrop' : 'Vesting'
  const { switchChainAsync, reset: resetSwitchChain } = useSwitchChain()
  const chainId = useChainId()

  const handleClaim = async () => {
    try {
      setErrorMsg(null)
      setWaitStatus('pending')
      resetSwitchChain()
      writeClaim.reset()
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
        functionName: 'release',
        args: [BigInt(flux.id.split('-')[1])],
        chainId: flux.chainId,
      })
      if (!simulateCreateVesting.request) {
        throw new Error('Failed to simulate claim transaction')
      }
      if (simulateCreateVesting.request) {
        const hash = await writeClaim.writeContractAsync(simulateCreateVesting.request)

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
          toast.success(`${name} claimed successfully`)
          customRevalidateTag(vestingByIdCachedTag(flux.id))
          customRevalidateTag(fluxesPagedCachedTag(wallet, flux.chainId))
          customRevalidateTag(walletStatsCachedTag(wallet))
          refresh()
        }
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'An error occurred while processing the claim'
      )
      setErrorMsg(
        err instanceof Error ? err.message : 'An error occurred while processing the claim'
      )
      setWaitStatus('error')
    }
  }

  const commonProps = {
    closeModal,
    isPending,
    isMutationPending: writeClaim.isPending,
    wallet,
  }

  const content = (() => {
    switch (status) {
      case 'pending':
        return <PendingContent />
      case 'success':
        return <SuccessContent {...commonProps} flux={flux} txHash={writeClaim.data ?? ''} />
      case 'error':
        return <ErrorContent {...commonProps} flux={flux} handleClaim={handleClaim} />
      default:
        return (
          <ConfirmationContent
            {...commonProps}
            flux={flux}
            handleClaim={handleClaim}
            amount={flux.amountWithdrawableBD}
          />
        )
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
        writeClaim.reset()
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

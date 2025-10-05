import { VestingByIdQuery } from '@/.graphclient'
import { Modal } from '@mantine/core'
import { toast } from 'react-toastify'

import { useState } from 'react'

import { Address, isAddress } from 'viem'

import { config } from '@/src/app/(providers)/wagmiConfig'
import { simulateContract, waitForTransactionReceipt } from '@wagmi/core'
import { useChainId, useSwitchChain, useWriteContract } from 'wagmi'

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
import { RecipientAddressInput } from '../../_components/RecipientAddressInput'
import { useRefresh } from '../../_hooks/useRefresh'
import { Loader } from '../../_svg/Loader'
import { TickInFilledCircle } from '../../_svg/TickInFilledCircle'
import { WithdrawInCircle } from '../../_svg/WithdrawInCircle'
import { XInFilledCircle } from '../../_svg/XInFilledCircle'

const ModalTitle = ({ status }: { status: string }) => {
  const titleConfig = {
    pending: {
      Icon: Loader,
      text: 'Processing Your Transfer',
      className: 'animate-spin',
      iconProps: {},
    },
    success: {
      Icon: TickInFilledCircle,
      text: 'Transfer Successful!',
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
      text: 'Confirm Transfer',
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
        Your transfer was successful. Your account has been updated.
      </span>
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
  handleTransferVesting,
  flux,
}: Omit<ActionContentProps, 'wallet' | 'amount'> & {
  handleTransferVesting: () => Promise<void>
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
}) => {
  const isAirdrop = typeof flux.airdropVestingId === 'string'

  return (
    <div className="flex flex-col items-center justify-center gap-y-[1rem]">
      <span className="text-[16px] text-[#757A8B]">
        {"We couldn't process your transfer. Please try again later"}
      </span>
      <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
        <Btn
          loading={isPending || isMutationPending}
          onClick={handleTransferVesting}
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

type ConfirmationContentProps = ActionContentProps & {
  handleTransferVesting: () => Promise<void>
  setNewBeneficiary: (address: Address | null) => void
  newBeneficiary: Address | null
}

const ConfirmationContent = ({
  handleTransferVesting,
  isPending,
  isMutationPending,
  setNewBeneficiary,
  newBeneficiary,
}: ConfirmationContentProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-[1rem]">
      <p className="w-full text-[16px] text-[#757A8B]">Set up the new beneficary</p>
      <div className="flex w-full flex-col gap-y-[1rem]">
        <RecipientAddressInput
          placeholder="Enter new beneficiary address"
          onChange={(e) => {
            const address = e.currentTarget.value as Address
            setNewBeneficiary(address)
          }}
          recipient={newBeneficiary ?? ''}
        />
        <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
          <Btn
            disabled={!newBeneficiary}
            loading={isPending || isMutationPending}
            onClick={handleTransferVesting}
            variant="white"
            className="w-full">
            <span className=" text-center text-[16px]">Confirm</span>
          </Btn>
        </div>
      </div>
    </div>
  )
}

type TopUpModalProps = {
  modalOpened: boolean
  closeModal: () => void
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  wallet: Address
}

export function TransferModal({ modalOpened, closeModal, flux, wallet }: TopUpModalProps) {
  const { isPending, refresh } = useRefresh()
  const [newBeneficiary, setNewBeneficiary] = useState<null | Address>(null)

  const writeWithdraw = useWriteContract()
  const [waitStatus, setWaitStatus] = useState<'pending' | 'success' | 'error' | 'idle'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const status = errorMsg ? 'error' : waitStatus !== 'idle' ? waitStatus : writeWithdraw.status
  const isAirdrop = typeof flux.airdropVestingId === 'string'
  const name = isAirdrop ? 'Airdrop' : 'Vesting'
  const { switchChainAsync, reset: resetSwitchChain } = useSwitchChain()
  const chainId = useChainId()

  const handleTransferVesting = async () => {
    try {
      setErrorMsg(null)
      setWaitStatus('pending')
      resetSwitchChain()
      writeWithdraw.reset()
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
      if (!newBeneficiary || !isAddress(newBeneficiary)) {
        throw new Error('Please enter a valid address')
      }
      const simulateCreateVesting = await simulateContract(config, {
        address: vestingContract as Address,
        abi: vestingManagerAbi,
        functionName: 'transferVesting',
        args: [BigInt(flux.id.split('-')[1]), newBeneficiary],
        chainId: flux.chainId,
      })
      if (!simulateCreateVesting.request) {
        throw new Error('Failed to simulate transfer transaction')
      }
      if (simulateCreateVesting.request) {
        const hash = await writeWithdraw.writeContractAsync(simulateCreateVesting.request)

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
          toast.success(`${name} transferred successfully`)
          customRevalidateTag(vestingByIdCachedTag(flux.id))
          customRevalidateTag(fluxesPagedCachedTag(wallet, flux.chainId))
          customRevalidateTag(walletStatsCachedTag(wallet))
          refresh()
        }
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : `An error occurred while transferring the ${name}`
      )
      setErrorMsg(
        err instanceof Error ? err.message : `An error occurred while transferring the ${name}`
      )
      setWaitStatus('error')
    }
  }

  const commonProps = {
    closeModal,
    isPending,
    isMutationPending: writeWithdraw.isPending,
    wallet,
  }

  const content = (() => {
    switch (status) {
      case 'pending':
        return <PendingContent />
      case 'success':
        return <SuccessContent {...commonProps} flux={flux} txHash={writeWithdraw.data ?? ''} />
      case 'error':
        return (
          <ErrorContent
            handleTransferVesting={handleTransferVesting}
            {...commonProps}
            flux={flux}
          />
        )
      default:
        return (
          <ConfirmationContent
            {...commonProps}
            handleTransferVesting={handleTransferVesting}
            setNewBeneficiary={setNewBeneficiary}
            newBeneficiary={newBeneficiary}
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
        resetSwitchChain()
        writeWithdraw.reset()
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

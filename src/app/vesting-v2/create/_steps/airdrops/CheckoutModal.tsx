import { Modal } from '@mantine/core'
import type { MutationStatus } from '@tanstack/react-query'

import { chainMetadata } from '@/src/utils/global'

import { Btn } from '../../../_components/Btn'
import { Loader } from '../../../_svg/Loader'
import { TickInFilledCircle } from '../../../_svg/TickInFilledCircle'
import { XInFilledCircle } from '../../../_svg/XInFilledCircle'

function ModalTitle({ status }: { status: string }) {
  const titleConfig = {
    pending: {
      Icon: Loader,
      text: 'Creating Your Airdrop',
      className: 'animate-spin',
    },
    success: {
      Icon: TickInFilledCircle,
      text: 'Airdrop created',
      className: '',
    },
    error: {
      Icon: XInFilledCircle,
      text: 'Something Went Wrong',
      className: '',
    },
  }

  const { Icon, text, className } =
    titleConfig[status as keyof typeof titleConfig] || titleConfig.pending

  return (
    <div className="flex items-center gap-[1rem]">
      <Icon className={className} />
      <p className="font-bold">{text}</p>
    </div>
  )
}

const PendingContent = () => (
  <div className="flex flex-col items-center justify-center gap-y-[1rem]">
    <p className="text-[16px] text-[#757A8B]">
      Please wait while we process and set up your airdrop. This might take a few moments. Do not
      close or refresh the page.
    </p>
  </div>
)

const PendingIncreaseAllowanceContent = () => (
  <div className="flex flex-col items-center justify-center gap-y-[1rem]">
    <p className="text-[16px] text-[#757A8B]">
      Increasing your allowance. Please wait while we process and set up your airdrop. This might
      take a few moments. Do not close or refresh the page.
    </p>
  </div>
)

type ActionContentProps = {
  closeModal: () => void
  wallet: string
  chainId: number
}

const SuccessContent = ({
  wallet,
  chainId,
  txHash,
}: ActionContentProps & {
  txHash: string
}) => (
  <div className="flex flex-col items-center justify-center gap-y-[1rem]">
    <div>
      <span className="contents text-[16px] text-[#757A8B]">
        Your setup is complete. You can now manage your airdrop.
      </span>
    </div>
    <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
      <Btn
        as="link"
        href={`/vesting-v2/dashboard/fluxes?wallet=${wallet}&chain=${chainId}`}
        variant="white"
        className="flex w-full">
        <span className="text-center text-[16px] text-black font-bold w-full">
          Back to the dashboard
        </span>
      </Btn>
      <Btn
        as="link"
        href={`${chainMetadata[chainId].explorer.url}/tx/${txHash}`}
        variant="transparent"
        rel="noopener noreferrer"
        target="_blank"
        className="w-full">
        <span className=" text-center text-[16px] text-white">View Transaction details</span>
      </Btn>
    </div>
  </div>
)

const ErrorContent = ({
  wallet,
  handleRetry,
  chainId,
}: ActionContentProps & { handleRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center gap-y-[1rem]">
    <span className="text-[16px] text-[#757A8B]">
      An error occurred while processing your request. Please try again.
    </span>
    <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
      <Btn onClick={handleRetry} variant="white" className="w-full">
        <span className="text-center text-[16px] font-bold">Try again</span>
      </Btn>
      <Btn
        as="link"
        href={`/vesting-v2/dashboard/fluxes?wallet=${wallet}&chain=${chainId}`}
        variant="white"
        className="flex w-full">
        <span className="text-center text-[16px] text-black font-bold w-full">
          Back to the dashboard
        </span>
      </Btn>
    </div>
  </div>
)

type CheckoutModalProps = {
  modalOpened: boolean
  onClose: () => void
  wallet: string
  status: MutationStatus | 'increaseAllowancePending'
  handleRetry: () => void
  chainId: number
  txHash: string
}

export function CheckoutModal({
  modalOpened,
  onClose,
  wallet,
  status,
  handleRetry,
  chainId,
  txHash,
}: CheckoutModalProps) {
  const contentProps = {
    closeModal: onClose,
    isMutationPending: status === 'pending',
    wallet,
    chainId,
  }

  const content = (() => {
    switch (status) {
      case 'increaseAllowancePending':
        return <PendingIncreaseAllowanceContent />
      case 'pending':
        return <PendingContent />
      case 'success':
        return <SuccessContent {...contentProps} txHash={txHash} />
      case 'error':
        return <ErrorContent {...contentProps} handleRetry={handleRetry} />
      default:
        return <PendingContent />
    }
  })()

  const allowClose = (() => {
    switch (status) {
      case 'increaseAllowancePending':
        return false
      case 'pending':
        return false
      case 'success':
        return true
      case 'error':
        return true
      default:
        return false
    }
  })()

  return (
    <Modal
      title={<ModalTitle status={status} />}
      size="md"
      padding="sm"
      centered
      onClose={() => {
        onClose?.()
      }}
      opened={modalOpened}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 10,
      }}
      closeOnClickOutside={allowClose}
      withCloseButton={allowClose}
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

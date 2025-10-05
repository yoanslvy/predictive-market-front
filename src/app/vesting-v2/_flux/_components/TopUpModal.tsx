import { VestingByIdQuery } from '@/.graphclient'
import { Modal } from '@mantine/core'
import { toast } from 'react-toastify'

import { type Dispatch, type SetStateAction, useState } from 'react'

import { Address, erc20Abi } from 'viem'

import { chains, config } from '@/src/app/(providers)/wagmiConfig'
import { readContracts, simulateContract, waitForTransactionReceipt } from '@wagmi/core'
import { useChainId, useReadContracts, useSwitchChain, useWriteContract } from 'wagmi'

import { vestingManagerAbi } from '@/src/interfaces/web3/abis/vestingManager'
import { vestingV2Contracts } from '@/src/interfaces/web3/vesting-v2/contracts'
import {
  vestingByIdCachedTag,
  fluxesPagedCachedTag,
  walletStatsCachedTag,
} from '@/src/server/fetchers/vesting-v2/tags'
import { customRevalidateTag } from '@/src/server/revalidateTag'

import { Btn } from '../../_components/Btn'
import { NumberInputWithBalanceAndQueryStatus } from '../../_components/NumberInputWithBalanceAndQueryStatus'
import { useRefresh } from '../../_hooks/useRefresh'
import { Loader } from '../../_svg/Loader'
import { ThreeGreenArrows } from '../../_svg/ThreeGreenArrows'
import { TickInFilledCircle } from '../../_svg/TickInFilledCircle'
import { XInFilledCircle } from '../../_svg/XInFilledCircle'
import { formatAmount } from '../../_utils/utils'

const ModalTitle = ({ status }: { status: string }) => {
  const titleConfig = {
    pending: {
      Icon: Loader,
      text: 'Confirming Your Transaction',
      className: 'animate-spin',
      iconProps: {},
    },
    increaseAllowancePending: {
      Icon: Loader,
      text: 'Confirming Your Transaction',
      className: 'animate-spin',
      iconProps: {},
    },
    success: { Icon: TickInFilledCircle, text: 'Success!', className: '', iconProps: {} },
    error: {
      Icon: XInFilledCircle,
      text: 'Something Went Wrong',
      className: '',
      iconProps: {},
    },
    default: {
      Icon: null,
      text: 'Enter Top-Up Details',
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
      Please confirm the transaction in your wallet. Do not close or refresh the page while the
      transaction is being processed.
    </p>
  </div>
)

const PendingIncreaseAllowanceContent = ({
  flux,
}: {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
}) => {
  const isAirdrop = typeof flux.airdropVestingId === 'string'

  return (
    <div className="flex flex-col items-center justify-center gap-y-[1rem]">
      <p className="text-[16px] text-[#757A8B]">
        Increasing your allowance. Please wait while we process and set up your{' '}
        {isAirdrop ? 'airdrop' : 'vesting'}. This might take a few moments. Do not close or refresh
        the page.
      </p>
    </div>
  )
}

type ActionContentProps = {
  closeModal: () => void
  isPending: boolean
  isMutationPending: boolean
  wallet: Address
  amount?: number | null
  chainId: number
}

const SuccessContent = ({
  closeModal,
  isPending,
  isMutationPending,
  wallet,
  amount,
  chainId,
  tokenSymbol,
  flux,
}: ActionContentProps & {
  tokenSymbol: string
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
}) => {
  const isAirdrop = typeof flux.airdropVestingId === 'string'

  return (
    <div className="flex flex-col items-center justify-center gap-[2em]">
      <span className="text-[16px] text-[#757A8B]">
        Your top-up has been successfully completed. The updated balance is now available.
      </span>
      <div className="flex w-full flex-col items-start gap-[0.5em]">
        <span className="text-[16px] text-[#757A8B]">Topped up</span>
        <span className="text-[42px] text-[#F0F2FB]">
          {amount ? formatAmount(amount) : ''} {tokenSymbol}
        </span>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
        <Btn
          loading={isPending || isMutationPending}
          onClick={closeModal}
          variant="white"
          className="w-full">
          <span className=" text-center text-[16px] font-bold">
            Back to {isAirdrop ? 'Airdrop' : 'Vesting'} Page
          </span>
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
}

const ErrorContent = ({
  closeModal,
  flux,
  handleTopUp,
  isPending,
  isMutationPending,
}: Omit<ActionContentProps, 'wallet' | 'amount'> & {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  handleTopUp?: () => Promise<void>
}) => {
  const isAirdrop = typeof flux.airdropVestingId === 'string'

  return (
    <div className="flex flex-col items-center justify-center gap-y-[1rem]">
      <span className="text-[16px] text-[#757A8B]">
        {"We couldn't process your top-up. Please try again later"}
      </span>
      <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
        <Btn
          loading={isPending || isMutationPending}
          onClick={handleTopUp}
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

const TopUpDisplay = ({
  flux,
  amount,
}: {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  amount: number | null
}) => {
  const totalAmount = flux.amountBD
  const newTotal = totalAmount + (amount ?? 0)
  const isAirdrop = typeof flux.airdropVestingId === 'string'

  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-[#202228] p-[16px]">
      <div className="flex flex-col items-start w-full">
        <div className="flex w-full items-center gap-x-[2rem]">
          <div>
            <p className="text-[12px] text-[#757A8B]">
              {isAirdrop ? 'Airdrop' : 'Vesting '} Amount
            </p>
            <div className="flex items-center gap-[1em]">
              <p className="text-[16px] text-[#F0F2FB]">{formatAmount(totalAmount)}</p>
              <ThreeGreenArrows />
              <p className="text-[16px] text-[#F0F2FB]">{formatAmount(newTotal)}</p>
            </div>
          </div>
        </div>
        {/* <Divider my="xs" className="w-full" color="#202228" /> */}
        {/* <div className="flex w-full items-center gap-x-[2rem]">
          <div>
            <p className="text-[12px] text-[#757A8B]">Next Unlock Amount</p>
            <div className="flex items-center gap-[1em]">
              <p className="text-[16px] text-[#F0F2FB]">{formatAmount(totalAmount)}</p>
              <ThreeGreenArrows />
              <p className="text-[16px] text-[#F0F2FB]">{formatAmount(totalAmount)}</p>
            </div>
          </div>
        </div>
        <Divider my="xs" className="w-full" color="#202228" />
        <div className="flex w-full items-center gap-x-[2rem]">
          <div>
            <p className="text-[12px] text-[#757A8B]">Vesting Completion Date</p>
            <div className="flex items-center gap-[1em]">
              <p className="text-[16px] text-[#F0F2FB]">{formatAmount(totalAmount)}</p>
              <ThreeGreenArrows />
              <p className="text-[16px] text-[#F0F2FB]">{formatAmount(totalAmount)}</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

type ConfirmationContentProps = ActionContentProps & {
  flux: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  handleTopUp: () => Promise<void>
  amount: number | null
  setAmount: Dispatch<SetStateAction<number | null>>
}

const ConfirmationContent = ({
  flux,
  handleTopUp,
  isPending,
  isMutationPending,
  wallet,
  amount,
  setAmount,
}: ConfirmationContentProps) => {
  const chainId = flux.chainId

  const mintQuery = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: flux.tokenVested.tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [wallet],
        chainId,
      },
      {
        abi: vestingManagerAbi,
        address: flux.vestingManagerId.split('-')[1] as Address,
        functionName: 'flatFee',
        chainId,
      },
    ],
    query: {
      enabled: !!flux.tokenVested.tokenAddress && !!wallet,
    },
  })

  const hasInsufficientFunds = !!amount && !!((mintQuery.data?.[0] ?? 0) < amount)

  const isDisabled = mintQuery.isSuccess ? !amount || hasInsufficientFunds : true

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.currentTarget.value
    if (num === '') {
      setAmount(null)
      return
    }
    setAmount(Number(num))
  }

  const nativeCurrency = chains.find((e) => e.id === chainId)?.nativeCurrency?.symbol || 'ETH'
  const nativeCurrencyDecimals =
    chains.find((e) => e.id === chainId)?.nativeCurrency?.decimals || 18

  return (
    <div className="flex flex-col items-center justify-center gap-y-[1rem]">
      <p className="text-[16px] text-[#757A8B]">
        Specify the amount of tokens you want to add to this vesting schedule.
      </p>
      <div className="flex w-full flex-col gap-y-[1rem]">
        <NumberInputWithBalanceAndQueryStatus
          mintQueryStatus={mintQuery.status}
          hasInsufficientFunds={hasInsufficientFunds}
          balance={
            mintQuery.data?.[0] ? Number(mintQuery.data?.[0]) / 10 ** flux.tokenVested.decimals : 0
          }
          tokenSymbol={flux.tokenVested.symbol}
          amount={amount}
          onChange={handleAmountChange}
        />

        {hasInsufficientFunds && <p className="font-bold text-red-500">Insufficient funds</p>}
        <TopUpDisplay flux={flux} amount={amount} />
        <p className="text-[14px] text-[#757A8B]">
          Fee:{' '}
          {mintQuery.data?.[1]
            ? formatAmount(Number(mintQuery.data?.[1]) / 10 ** nativeCurrencyDecimals)
            : '-'}{' '}
          {nativeCurrency}
        </p>
        <div className="flex w-full flex-col items-center justify-between gap-[1rem]">
          <Btn
            disabled={isDisabled}
            loading={isPending || isMutationPending}
            onClick={handleTopUp}
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

export function TopUpModal({ modalOpened, closeModal, flux, wallet }: TopUpModalProps) {
  const { isPending, refresh } = useRefresh()
  const [amount, setAmount] = useState<number | null>(null)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const topUpMutation = useWriteContract()
  const writeIncreaseAllowance = useWriteContract()
  const [waitStatus, setWaitStatus] = useState<'pending' | 'success' | 'error' | 'idle'>('idle')
  const status = errorMsg
    ? 'error'
    : waitStatus !== 'idle' && waitStatus !== 'pending'
      ? waitStatus
      : writeIncreaseAllowance.status === 'pending'
        ? 'increaseAllowancePending'
        : writeIncreaseAllowance.status === 'error'
          ? 'error'
          : writeIncreaseAllowance.status === 'success'
            ? 'pending'
            : topUpMutation.status

  const { switchChainAsync, reset: resetSwitchChain } = useSwitchChain()
  const chainId = useChainId()

  const handleTopUp = async () => {
    try {
      setErrorMsg(null)
      setWaitStatus('pending')
      resetSwitchChain()
      topUpMutation.reset()
      writeIncreaseAllowance.reset()
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
      if (amount == null) {
        throw new Error('Please enter a valid amount to top up')
      }

      const [allowance] = await readContracts(config, {
        contracts: [
          {
            address: flux.tokenVested.tokenAddress as Address,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [wallet as Address, vestingContract as Address],
            chainId: flux.chainId,
          },
        ],
      })

      if (allowance.error) {
        throw new Error('Failed to get token allowance')
      }

      const { decimals } = flux.tokenVested
      const tokenAllowance = allowance.result
      const [lastTranche] = flux.tranches.sort((a, b) => Number(b.time) - Number(a.time))
      const topUpAmountBI = BigInt(Math.floor(amount * 10 ** decimals)) + BigInt(lastTranche.amount)
      const needsApproval = tokenAllowance < topUpAmountBI
      if (needsApproval) {
        const approveTransaction = await writeIncreaseAllowance.writeContractAsync({
          address: flux.tokenVested.tokenAddress as Address,
          abi: erc20Abi,
          functionName: 'approve',
          args: [vestingContract as Address, topUpAmountBI],
          chainId: flux.chainId,
        })

        const { status } = await waitForTransactionReceipt(config, {
          hash: approveTransaction,
          chainId: flux.chainId,
        })
        if (status === 'reverted') {
          throw new Error('Transaction reverted. Please try again later.')
        }
      }
      const simulateCreateVesting = await simulateContract(config, {
        address: vestingContract as Address,
        abi: vestingManagerAbi,
        functionName: 'topUpVesting',
        args: [
          BigInt(flux.id.split('-')[1]),
          [
            {
              amount: topUpAmountBI,
              eqType: lastTranche.eqType,
              time: BigInt(Number(lastTranche.time) + 1),
            },
            {
              amount: topUpAmountBI,
              eqType: lastTranche.eqType,
              time: BigInt(Number(lastTranche.time) + 2),
            },
          ],
        ],
        chainId: flux.chainId,
      })
      if (!simulateCreateVesting.request) {
        throw new Error('Failed to simulate top-up transaction')
      }
      if (simulateCreateVesting.request) {
        const hash = await topUpMutation.writeContractAsync(simulateCreateVesting.request)

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
          toast.success('Top-up successful')
          customRevalidateTag(vestingByIdCachedTag(flux.id))
          customRevalidateTag(fluxesPagedCachedTag(wallet, flux.chainId))
          customRevalidateTag(walletStatsCachedTag(wallet))
          refresh()
        }
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'An unexpected error occurred during the top-up'
      )
      setErrorMsg(
        err instanceof Error ? err.message : 'An unexpected error occurred during the top-up'
      )
      setWaitStatus('error')
    }
  }

  const commonProps = {
    closeModal,
    isPending,
    isMutationPending: topUpMutation.isPending,
    wallet,
    chainId: flux.chainId,
  }

  const content = (() => {
    switch (status) {
      case 'increaseAllowancePending':
        return <PendingIncreaseAllowanceContent flux={flux} />
      case 'pending':
        return <PendingContent />
      case 'success':
        return (
          <SuccessContent
            {...commonProps}
            amount={amount}
            tokenSymbol={flux.tokenVested.symbol}
            flux={flux}
          />
        )
      case 'error':
        return <ErrorContent {...commonProps} flux={flux} handleTopUp={handleTopUp} />
      default:
        return (
          <ConfirmationContent
            {...commonProps}
            flux={flux}
            handleTopUp={handleTopUp}
            amount={amount}
            setAmount={setAmount}
          />
        )
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
        topUpMutation.reset()
        writeIncreaseAllowance.reset()
        resetSwitchChain()
        setErrorMsg(null)
        setWaitStatus('idle')
        setAmount(null)
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

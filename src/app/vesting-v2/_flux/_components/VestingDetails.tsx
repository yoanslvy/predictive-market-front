'use client'

import { VestingByIdQuery } from '@/.graphclient'
import { Divider, Menu, Popover } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'

import { Address } from 'viem'

import { ChainsData } from '@/src/components/modules/ChainAsset/constants'

import { CalendarWithGreenDays } from '../../_svg/CalendarWIthGreenDays'
import { ThreeGreenArrows } from '../../_svg/ThreeGreenArrows'
import { dateFormatter, emissionTypeMapper, formatAmount } from '../../_utils/utils'
import { StopFluxModal } from './StopFluxModal'
import { TopUpModal } from './TopUpModal'
import { TransferModal } from './TransferModal'
import { DetailCard, VestingDetailsPopover } from './VestingDetailsPopover'

export function VestingDetails({
  data,
  wallet,
}: {
  data: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  wallet?: string
}) {
  const startDate = dateFormatter(new Date(Number(data.startTime as bigint) * 1000))

  const endDate = dateFormatter(new Date(Number(data.endTime as bigint) * 1000))

  const nextUnlockDate = data.nextUnlockDate as string | null

  let unlocksLeft = data.tranches.filter((tranche) => tranche.time * 1000 > Date.now()).length

  let totalDuration = dayjs(data.endTime * 1000).diff(dayjs(data.startTime * 1000), 'day')

  if (data.vestingEmissionType === 'SCHEDULED') {
    unlocksLeft = unlocksLeft === 2 ? 1 : unlocksLeft
    totalDuration = -1
  }

  const isStopped = !!data.cancelDate

  const emissionType = data.vestingEmissionType

  const beneficiaryAddress = data.beneficiaryId.split('-')[1]

  const [transferModalOpened, { close: closeTransferModal, open: openTransferModal }] =
    useDisclosure()

  const [stopFluxModalOpened, { close: closeStopFluxModal, open: openStopFluxModal }] =
    useDisclosure()

  const [topUpFluxModalOpened, { close: closeTopUpFluxModal, open: openTopUpFluxModal }] =
    useDisclosure()

  const isAirdrop = !!data.airdropVestingId

  const fluxType = isAirdrop ? 'Airdrop' : 'Vesting'

  const unlockProgress = Math.min(
    1,
    Math.max(0, (data.amountWithdrawableBD + data.amountReleasedBD) / data.amountBD)
  )

  return (
    <>
      {wallet && (
        <TransferModal
          wallet={wallet as Address}
          flux={data}
          modalOpened={transferModalOpened}
          closeModal={closeTransferModal}
        />
      )}

      {wallet && (
        <StopFluxModal
          wallet={wallet as Address}
          flux={data}
          modalOpened={stopFluxModalOpened}
          closeModal={closeStopFluxModal}
        />
      )}

      {wallet && (
        <TopUpModal
          wallet={wallet as Address}
          flux={data}
          modalOpened={topUpFluxModalOpened}
          closeModal={closeTopUpFluxModal}
        />
      )}

      <div className="h-full w-full rounded-xl bg-[#17181C] px-[34px] py-[32px]">
        <div className="flex items-center justify-between">
          <p className="text-[24px] font-bold text-[#F0F2FB]">Details</p>
          <div>
            <Menu
              classNames={{
                dropdown: 'bg-[#202228] border-[#202228]',
              }}
              width={140}
              position="bottom-start"
              shadow="md">
              <Menu.Target>
                <div className="ml-[1em] mt-[0.1em]">
                  <button
                    className="px-3 py-1 bg-[#2C2F3A] hover:bg-[#30333C] border border-[#30333C] hover:border-[#01EB5A40] rounded-lg text-[#F0F2FB] hover:text-[#01EB5A] text-sm font-medium transition-all duration-200 flex items-center gap-2"
                    type="button">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                    Options
                  </button>
                </div>
              </Menu.Target>
              <Menu.Dropdown>
                {/* <Menu.Label>Creator</Menu.Label> */}
                {
                  <Menu.Item
                    color="green"
                    onClick={openStopFluxModal}
                    disabled={
                      !wallet ||
                      wallet.toLowerCase() !== data.creator.walletAddress.toLowerCase() ||
                      !data.isSoft ||
                      !!data.cancelDate ||
                      new Date(Number(data.endTime as bigint) * 1000) < new Date()
                    }>
                    Stop {fluxType}
                  </Menu.Item>
                }
                {/* <Menu.Label>Beneficiary</Menu.Label> */}
                {
                  <Menu.Item
                    color="green"
                    onClick={openTransferModal}
                    disabled={
                      !wallet ||
                      beneficiaryAddress.toLowerCase() !== wallet.toLowerCase() ||
                      !data.isTransferable
                    }>
                    Transfer {fluxType}
                  </Menu.Item>
                }
                {
                  <Menu.Item
                    color="green"
                    onClick={openTopUpFluxModal}
                    disabled={
                      !wallet ||
                      wallet.toLowerCase() !== data.creator.walletAddress.toLowerCase() ||
                      !data.isTopable
                    }>
                    Top Up {fluxType}
                  </Menu.Item>
                }
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
        <div className="flex flex-col items-start gap-[0.7rem] mt-[0.5em]">
          <div className="grid items-center w-full grid-cols-5 grid-rows-1 gap-4">
            <div className="col-span-2">
              <DetailCard label="Start Date">
                <div className="flex items-center gap-x-[0.6rem]">
                  <CalendarWithGreenDays />
                  <span className="text-sm font-semibold text-white">
                    {dateFormatter(new Date(startDate))}
                  </span>
                </div>
              </DetailCard>
            </div>
            <div className="flex justify-center col-span-1">
              <ThreeGreenArrows />
            </div>
            <div className="col-span-2">
              <DetailCard label="End Date">
                <div className="flex items-center gap-x-[0.6rem]">
                  <CalendarWithGreenDays />
                  <span className="text-sm font-semibold text-white">
                    {dateFormatter(new Date(endDate))}
                  </span>
                </div>
              </DetailCard>
            </div>
          </div>
          <Popover
            width="target"
            position="bottom"
            withArrow={false}
            shadow="md"
            radius="md"
            closeOnClickOutside={true}
            closeOnEscape={true}
            offset={0}
            transitionProps={{
              transition: 'scale-y',
              duration: 200,
              timingFunction: 'ease-in-out',
            }}
            classNames={{
              dropdown: 'bg-[#1A1B23] border-[#30333C] min-h-[300px] shadow-xl animate-fold-in',
            }}>
            <Popover.Target>
              <div className="w-full">
                <Divider
                  color="#30333C"
                  labelPosition="center"
                  className="w-full my-2"
                  label={
                    <button className="px-3 py-1 bg-[#01EB5A29] border border-[#01EB5A40] rounded-md text-[#01EB5A] text-sm font-medium hover:bg-[#01EB5A40] transition-colors">
                      More Details
                    </button>
                  }
                />
              </div>
            </Popover.Target>
            <Popover.Dropdown>
              <VestingDetailsPopover
                data={data}
                beneficiaryAddress={beneficiaryAddress}
                isStopped={isStopped}
                unlockProgress={unlockProgress}
                emissionType={emissionType}
                nextUnlockDate={nextUnlockDate}
                unlocksLeft={unlocksLeft}
              />
            </Popover.Dropdown>
          </Popover>

          <div className="grid w-full grid-cols-2 grid-rows-2 gap-4">
            <DetailCard label="Emission Type">
              <span className="text-sm font-semibold text-white">
                {emissionTypeMapper[emissionType as keyof typeof emissionTypeMapper] || 'Unknown'}
              </span>
            </DetailCard>
            <DetailCard label="Token Symbol">
              <span className="text-sm font-semibold text-white">{data.tokenVested.symbol}</span>
            </DetailCard>
            <DetailCard label="Vested Amount">
              <span className="text-sm font-semibold text-white">
                {formatAmount(data.amountBD)} {data.tokenVested.symbol}
              </span>
            </DetailCard>
            <DetailCard label="Chain">
              <div className="flex items-center gap-2">
                <div className="[&>svg]:size-[1.6em] [&>img]:size-[1.6em] [&>img]:rounded-full [&>svg]:rounded-full">
                  {ChainsData[data.chainId].logo}
                </div>
                <p className="text-sm font-semibold text-white">
                  {ChainsData[data.chainId].displayName}
                </p>
              </div>
            </DetailCard>
          </div>
        </div>
      </div>
    </>
  )
}

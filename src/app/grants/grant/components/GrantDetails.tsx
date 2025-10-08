'use client'

import { Menu, Popover } from '@mantine/core'
import Link from 'next/link'

import { formatEther, formatUnits } from 'viem'

import { useAccount } from 'wagmi'

import { ChainsData } from '@/src/components/modules/ChainAsset/constants'
import Etherscan from '@/src/images/apps/etherscan.svg'

import { CalendarWithGreenDays } from '../../_svg/CalendarWIthGreenDays'
import { ThreeGreenArrows } from '../../_svg/ThreeGreenArrows'
import { Grants } from '../../explore/latest/_modules/tokenTable/data'

export const truncate = (fullStr: string, strLen: number, separator: string) => {
  if (fullStr.length <= strLen) return fullStr

  separator = separator || '&hellip;'

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2)

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars)
}

export const DetailCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] min-h-[72px] flex flex-col justify-between">
    <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">{label}</span>
    <div className="mt-1">{children}</div>
  </div>
)

export function GrantDetails({ grant, resolved }: { grant: Grants; resolved: boolean }) {
  const { address: wallet } = useAccount()

  const { grantId, amount, questionEntity, recipient, creator, txnHash, creationTimestamp } = grant

  const collateralToken = '0x5dfcfc9693f98e4deb942657d51a6bc0fce02036'

  const now = new Date()
  const creationTimeDate = creationTimestamp ? new Date(Number(creationTimestamp)) : null
  const openingTimeDate = questionEntity.openingTs
    ? new Date(Number(questionEntity.openingTs))
    : null
  const isOpeningTimePassed = openingTimeDate ? openingTimeDate < now : false

  const status = resolved ? 'Resolved' : isOpeningTimePassed ? 'Open' : 'Not Open'
  const statusColor = resolved ? '#ff4063' : isOpeningTimePassed ? '#01EB5A' : '#ff9900'

  const GrantDetailsPopover = () => (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-[#01EB5A] rounded-full"></div>
        <h3 className="text-[18px] font-bold text-[#F0F2FB]">Grant Details</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <DetailCard label="Grant ID">
          <span className="text-sm font-mono text-white break-all">{grantId}</span>
        </DetailCard>

        {recipient && (
          <DetailCard label="Grant creator">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://sepolia.etherscan.io/address/${creator.walletAddress}`}
              className="flex items-center gap-x-[0.5rem]">
              <Etherscan className="size-[1.4em]" />
              <span className="text-[#F0F2FB] underline">
                {truncate(creator.walletAddress, 14, '...')}
              </span>
            </Link>
          </DetailCard>
        )}

        {questionEntity.minBond.toString() && (
          <DetailCard label="Minimum Bond">
            <span className="text-sm font-semibold text-white">
              {formatEther(BigInt(questionEntity.minBond.toString()))} ETH
            </span>
          </DetailCard>
        )}

        <DetailCard label="Resolution Status">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
            <span className="text-sm font-semibold text-white">{status}</span>
          </div>
        </DetailCard>
      </div>
    </div>
  )

  return (
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
            <Menu.Dropdown>
              <Menu.Item color="green" disabled={!wallet || resolved}>
                Submit Answer
              </Menu.Item>
              <Menu.Item color="green" disabled={!wallet || !isOpeningTimePassed || resolved}>
                Challenge Answer
              </Menu.Item>
              <Menu.Item color="green" disabled={!wallet || resolved}>
                View on Explorer
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>

      <div className="flex flex-col items-start gap-[0.7rem] mt-[0.5em]">
        <div className="grid items-center w-full grid-cols-5 grid-rows-1 gap-4">
          <div className="col-span-2">
            <DetailCard label="Creation Time">
              <div className="flex items-center gap-x-[0.6rem]">
                <CalendarWithGreenDays />
                <span className="text-sm font-semibold text-white">
                  {creationTimeDate ? creationTimeDate.toLocaleString() : 'Not set'}
                </span>
              </div>
            </DetailCard>
          </div>
          <div className="flex justify-center col-span-1">
            <div className="scale-150">
              <ThreeGreenArrows />
            </div>
          </div>
          <div className="col-span-2">
            <DetailCard label="Opening Time">
              <div className="flex items-center gap-x-[0.6rem]">
                <CalendarWithGreenDays />
                <span className="text-sm font-semibold text-white">
                  {openingTimeDate ? openingTimeDate.toLocaleString() : 'Not set'}
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
            <div className="w-full relative my-2">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                <div className="w-full border-t border-[#30333C]"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-[#17181C] px-2">
                  <button className="px-3 py-1 bg-[#01EB5A29] border border-[#01EB5A40] rounded-md text-[#01EB5A] text-sm font-medium hover:bg-[#01EB5A40] transition-colors">
                    More Details
                  </button>
                </div>
              </div>
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <GrantDetailsPopover />
          </Popover.Dropdown>
        </Popover>

        <div className="grid w-full grid-cols-2 grid-rows-2 gap-4">
          <DetailCard label="Grant amount">
            <span className="text-sm font-medium text-white line-clamp-3">
              {amount ? `${formatUnits(BigInt(amount), 18)}` : 'No amount provided'}
            </span>
          </DetailCard>

          <DetailCard label="Grant token">
            <span className="text-sm font-semibold text-white">
              {collateralToken ? (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://sepolia.etherscan.io/address/${collateralToken}`}
                  className="flex items-center gap-x-[0.5rem]">
                  <Etherscan className="size-[1.4em]" />
                  <span className="text-[#F0F2FB] underline">
                    {truncate(collateralToken, 14, '...')}
                  </span>
                </Link>
              ) : (
                'No collateral token set'
              )}
            </span>
          </DetailCard>

          <DetailCard label="Grant recipient">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={`https://sepolia.etherscan.io/address/${recipient.walletAddress}`}
              className="flex items-center gap-x-[0.5rem]">
              <Etherscan className="size-[1.4em]" />
              <span className="text-[#F0F2FB] underline">
                {truncate(recipient.walletAddress, 14, '...')}
              </span>
            </Link>
          </DetailCard>

          <DetailCard label="Chain">
            <div className="[&>svg]:size-[1.6em] [&>img]:size-[1.6em] [&>img]:rounded-full [&>svg]:rounded-full">
              {ChainsData[11155111].logo}
            </div>
          </DetailCard>
        </div>
      </div>
    </div>
  )
}

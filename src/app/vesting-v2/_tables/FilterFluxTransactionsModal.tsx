'use client'

import { Divider, Input, Modal, MultiSelect } from '@mantine/core'

import { useState } from 'react'

import { cn } from '@/src/src/utils'

import { Btn } from '../_components/Btn'
import { Clock } from '../_svg/Clock'
import { Forbidden } from '../_svg/Forbidden'
import { Payout } from '../_svg/Payout'
import { TickInCircle } from '../_svg/TickInCircle'
import { Transfer } from '../_svg/Transfer'
import { Withdrawal } from '../_svg/Withdrawal'

function TypeIcon({
  type,
  stroke,
}: {
  type: 'payout' | 'withdrawal' | 'transfer'
  stroke?: string
}) {
  if (type === 'payout') {
    return <Payout stroke={stroke} />
  }
  if (type === 'withdrawal') {
    return <Withdrawal stroke={stroke} />
  }
  return <Transfer stroke={stroke} />
}

function StatusIcon({
  status,
  stroke,
}: {
  status: 'completed' | 'pending' | 'cancelled'
  stroke?: string
}) {
  if (status === 'completed') {
    return <TickInCircle stroke={stroke} />
  }
  if (status === 'cancelled') {
    return <Forbidden stroke={stroke} />
  }
  return <Clock stroke={stroke} />
}

export function FilterFluxTransactionsModal({
  opened,
  close,
}: {
  opened: boolean
  close: () => void
}) {
  const [minTxAmount, setMinTxAmount] = useState(0)
  const [maxTxAmount, setMaxTxAmount] = useState(0)
  const [tokens, setTokens] = useState<string[]>([])
  const [txTypes, setTxTypes] = useState<string[]>([])
  const [txStatuses, setTxStatuses] = useState<string[]>([])

  return (
    <Modal
      title="Filters"
      size="md"
      padding="sm"
      centered
      onClose={close}
      opened={opened}
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
      <div className="flex flex-col items-center justify-center gap-y-[2rem]">
        <form className="flex w-full flex-col items-center gap-y-[2rem]">
          <div className="flex w-full items-center justify-between gap-[0.8rem]">
            <div className="flex w-full flex-col items-start gap-y-[0.4rem]">
              <label className="text-[16px] text-[#757A8B]">Transaction amount</label>
              <div className="flex w-full gap-x-[1rem] rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] py-[12px] text-white">
                <Input
                  classNames={{
                    input: 'bg-transparent border-transparent text-white p-0 m-0 text-[16px]',
                  }}
                  onChange={(e) => {
                    setMinTxAmount(Number(e.currentTarget.value))
                  }}
                  className="m-0 w-full border-transparent bg-transparent text-[20px]"
                  placeholder={'0'}
                />
              </div>
            </div>
            <p className="mt-[2em]">To</p>
            <div className="flex w-full flex-col items-start gap-y-[0.4rem]">
              <label className="text-[16px] text-[#757A8B] opacity-0">Transaction amount</label>
              <div className="flex w-full gap-x-[1rem] rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] py-[12px] text-white">
                <Input
                  classNames={{
                    input: 'bg-transparent border-transparent text-white p-0 m-0 text-[16px]',
                  }}
                  onChange={(e) => {
                    setMaxTxAmount(Number(e.currentTarget.value))
                  }}
                  className="m-0 w-full border-transparent bg-transparent text-[20px]"
                  placeholder={'1'}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-[0.8rem]">
            <div className="flex w-full flex-col items-start gap-y-[0.4rem]">
              <label className="text-[16px] text-[#757A8B]">Select token(s)</label>
              <div className="flex w-full gap-x-[1rem] rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] py-[12px] text-white">
                <MultiSelect
                  clearable
                  classNames={{
                    input:
                      'bg-transparent border-transparent text-white p-0 m-0 text-[16px] min-h-[2.7em]',
                    pill: 'bg-[#2C2E36] border-transparent text-white text-[15px]  rounded-md   py-[8px] px-[8px] h-full',
                    dropdown: 'bg-[#17181C] border-[#2C2F3A] rounded',
                    option: 'text-[#757A8B] hover:bg-[#2C2E36] [&>span]:pt-[var(--pt-apk-value)]',
                  }}
                  onChange={setTokens}
                  value={tokens}
                  data={['SOL', 'USDC', 'USDT', 'BTC', 'ETH']}
                  className="m-0 w-full border-transparent bg-transparent text-[20px]"
                />
              </div>
            </div>
          </div>
          <Divider color="#30333C" labelPosition="center" className="w-full" />
          <div className="flex w-full items-center justify-between gap-[0.8rem]">
            <div className="flex w-full flex-col items-start gap-y-[0.6rem]">
              <label className="text-[16px] text-[#757A8B]">Transaction type</label>
              <div className="flex w-full flex-wrap items-center gap-[1rem]">
                {(['withdrawal', 'payout', 'transfer'] as const).map((type) => {
                  const isActive = txTypes.includes(type)
                  return (
                    <Btn
                      key={type}
                      variant="transparent"
                      onClick={() => {
                        setTxTypes((prev) =>
                          prev.includes(type) ? prev.filter((i) => i !== type) : [...prev, type]
                        )
                      }}
                      className={cn('w-fit', isActive ? 'border-white' : '')}>
                      <div className="flex w-full items-center gap-[0.8rem]">
                        <div className="size-[20px]">
                          <TypeIcon type={type} stroke={isActive ? '#fff' : undefined} />
                        </div>
                        <span
                          className={cn(
                            'pt-apk min-w-max capitalize',
                            isActive ? 'text-white' : 'text-[#757A8B]'
                          )}>
                          {type}
                        </span>
                      </div>
                    </Btn>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-between gap-[0.8rem]">
            <div className="flex w-full flex-col items-start gap-y-[0.6rem]">
              <label className="text-[16px] text-[#757A8B]">Transaction status</label>
              <div className="flex w-full flex-wrap items-center gap-[1rem]">
                {(['completed', 'pending', 'cancelled'] as const).map((type) => {
                  const isActive = txStatuses.includes(type)
                  return (
                    <Btn
                      key={type}
                      variant="transparent"
                      onClick={() => {
                        setTxStatuses((prev) =>
                          prev.includes(type) ? prev.filter((i) => i !== type) : [...prev, type]
                        )
                      }}
                      className={cn('w-fit', isActive ? 'border-white' : '')}>
                      <div className="flex w-full items-center gap-[0.8rem]">
                        <div className="size-[20px]">
                          <StatusIcon status={type} stroke={isActive ? '#fff' : '#30333C'} />
                        </div>
                        <span
                          className={cn(
                            'pt-apk min-w-max capitalize',
                            isActive ? 'text-white' : 'text-[#757A8B]'
                          )}>
                          {type}
                        </span>
                      </div>
                    </Btn>
                  )
                })}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  )
}

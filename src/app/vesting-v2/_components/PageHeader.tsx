'use client'

import { toast } from 'react-toastify'

import { ReactNode } from 'react'

import { cn } from '@/src/src/utils'

import { Caret } from '../_svg/Caret'
import { Copy } from '../_svg/Copy'
import { Btn } from './Btn'

type PageHeaderProps = {
  leftHref?: string
  title: string | ReactNode
  rightHref?: string
  leftLabel?: string
  className?: string
  rightSide?: ReactNode
}

export function PageHeader({ title, leftHref, rightHref, leftLabel, rightSide }: PageHeaderProps) {
  return (
    <div className={cn('grid w-full grid-cols-3 items-center')}>
      {typeof leftHref === 'string' && typeof leftLabel === 'string' ? (
        <Btn
          variant="transparent"
          as="link"
          href={leftHref}
          className="group w-fit px-3 py-2 rounded-lg bg-white/5 hover:bg-white/8 transition-colors duration-200">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="rotate-180 group-hover:opacity-80 transition-opacity duration-200">
              <Caret stroke="#757A8B" />
            </span>
            <p className="text-sm md:text-[16px] text-[#F0F2FB] font-bold group-hover:text-white/90 transition-colors duration-200">
              {leftLabel}
            </p>
          </div>
        </Btn>
      ) : (
        <div />
      )}
      {typeof title === 'string' ? (
        <p className="text-center text-xl sm:text-2xl md:text-[32px] font-bold text-[#F0F2FB]">
          {title}
        </p>
      ) : (
        <div>{title}</div>
      )}
      {typeof rightHref === 'string' ? (
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(window.location.href)
            toast.success('Link copied to clipboard!')
          }}>
          <div className="flex items-center justify-end gap-1 sm:gap-3">
            <p className="block text-sm md:text-[16px] text-[#757A8B]">Share page link</p>
            <Copy className="flex-shrink-0" />
          </div>
        </button>
      ) : (
        <>
          {rightSide ? <div className="flex items-center justify-end">{rightSide}</div> : <div />}
        </>
      )}
    </div>
  )
}

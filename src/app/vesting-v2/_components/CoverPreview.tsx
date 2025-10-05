/* eslint-disable @next/next/no-img-element */
import { Input } from '@mantine/core'

import type { ReactNode } from 'react'

export function CoverPreview({
  coverUrl,
  setCoverUrl,
  logoUrl,
  setLogoUrl,
  floatingElement,
}: {
  coverUrl: string | null
  setCoverUrl?: (url: string) => void
  logoUrl: string | null
  setLogoUrl?: (url: string) => void
  floatingElement: ReactNode
}) {
  return (
    <>
      <div className="mt-[2em] flex w-full flex-col items-start gap-y-[2rem] md:gap-y-[4rem]">
        <div className="flex w-full flex-col gap-y-[1rem]">
          <div className="flex w-full flex-col gap-y-[1rem]">
            {coverUrl ? (
              <div className="relative flex w-full items-start justify-start rounded-[16px] bg-gradient-to-t from-[#202228] to-[#17181C]">
                <div className="aspect-[700/176] w-full overflow-hidden rounded-xl">
                  <img alt="cover-image" src={coverUrl} className="object-cover w-full h-full" />
                </div>
                {floatingElement}
                {logoUrl ? (
                  <div className="absolute bottom-[-20px] left-[16px] size-[48px] md:size-[64px] rounded-full border border-dashed border-[#FFFFFF3D]">
                    <img
                      alt="logo-image"
                      src={logoUrl}
                      className="size-[48px] md:size-[64px] rounded-full border border-dashed border-[#FFFFFF3D]"
                    />
                  </div>
                ) : (
                  <div className="absolute bottom-[-20px] left-[16px] size-[48px] md:size-[64px] rounded-full border border-dashed border-[#FFFFFF3D] bg-[#17181C]"></div>
                )}
              </div>
            ) : (
              <div className="relative flex w-full items-start justify-start rounded-[16px] bg-gradient-to-t from-[#202228] to-[#17181C]">
                <div className="aspect-[700/176] w-full overflow-hidden rounded-xl"></div>
                {floatingElement}
                {logoUrl ? (
                  <div className="absolute bottom-[-20px] left-[16px] size-[48px] md:size-[64px] rounded-full border border-dashed border-[#FFFFFF3D]">
                    <img
                      alt="logo-image"
                      src={logoUrl}
                      className="size-[48px] md:size-[64px] rounded-full border border-dashed border-[#FFFFFF3D]"
                    />
                  </div>
                ) : (
                  <div className="absolute bottom-[-20px] left-[16px] size-[48px] md:size-[64px] rounded-full border border-dashed border-[#FFFFFF3D] bg-[#17181C]"></div>
                )}
              </div>
            )}
          </div>
        </div>
        {setCoverUrl && setLogoUrl && (
          <div className="flex w-full flex-col md:flex-row justify-between gap-y-[2rem] md:gap-y-0">
            <div className="flex w-full flex-col gap-y-[1rem] md:pr-[1rem]">
              <p className="text-[18px] md:text-[20px] font-[500] text-white">Upload Cover (Optional)</p>
              <p className="text-[14px] md:text-[16px] font-[400] text-[#757A8B]">
                Backgroud image must be 1200x400 px
              </p>
              <Input
                classNames={{
                  input:
                    'bg-transparent border-transparent text-white p-0 m-0 text-[14px] md:text-[16px]',
                }}
                value={coverUrl ?? ''}
                onChange={(e) => {
                  setCoverUrl(e.currentTarget.value)
                }}
                className="w-full rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] text-white hover:bg-[#26282E] transition-all"
                placeholder={'Cover image URL'}
              />
            </div>
            <div className="hidden md:block h-[162px] border-[1px] border-[#FFFFFF17]" />
            <div className="flex w-full flex-col gap-y-[1rem] md:pl-[1rem]">
              <p className="text-[18px] md:text-[20px] font-[500] text-white">Upload Logo (Optional)</p>
              <p className="text-[14px] md:text-[16px] font-[400] text-[#757A8B]">
                Logo image must be 300x300 px
              </p>
              <Input
                classNames={{
                  input:
                    'bg-transparent border-transparent text-white p-0 m-0 text-[14px] md:text-[16px]',
                }}
                value={logoUrl ?? ''}
                onChange={(e) => {
                  setLogoUrl(e.currentTarget.value)
                }}
                className="w-full rounded-xl border border-[#2C2F3A] bg-[#202228] px-[16px] text-white hover:bg-[#26282E] transition-all"
                placeholder={'Logo image URL'}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

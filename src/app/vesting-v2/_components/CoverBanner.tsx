'use client'

import { VestingByIdQuery } from '@/.graphclient'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { toast } from 'react-toastify'

import { useState } from 'react'

import { useRefresh } from '../_hooks/useRefresh'
import { useSign } from '../_hooks/useSign'
import { useUpdateImages } from '../_hooks/useUpdateImages'
import { Btn } from './Btn'
import { CoverPreview } from './CoverPreview'

export function CoverBanner({
  coverUrl,
  logoUrl,
  chainId,
  wallet,
  fluxData,
}: {
  coverUrl: string | null
  logoUrl: string | null
  wallet?: string
  chainId?: number
  fluxData: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
}) {
  const [opened, { close, open }] = useDisclosure()

  const [newCoverUrl, setCoverUrl] = useState<string | null>(coverUrl)
  const [newLogoUrl, setLogoUrl] = useState<string | null>(logoUrl)

  const { signUpdateImages } = useSign()
  const updateImagesMutation = useUpdateImages()
  const { refresh } = useRefresh()

  return (
    <>
      <Modal
        title="Change Cover"
        size="70%"
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
        <CoverPreview
          coverUrl={newCoverUrl}
          setCoverUrl={setCoverUrl}
          logoUrl={newLogoUrl}
          setLogoUrl={setLogoUrl}
          floatingElement={
            <div className="absolute left-0 top-0 m-[1rem] rounded-xl bg-black px-[16px] text-white">
              Preview Image
            </div>
          }
        />
        <div className="flex w-full items-center justify-center mt-[2em]">
          <Btn
            onClick={async () => {
              if (!wallet) return
              let toastId = crypto.randomUUID()
              try {
                toast.loading('Updating images...', {
                  toastId,
                  isLoading: true,
                })
                const vestingId = Number(fluxData.id.split('-')[1])
                const chainId = fluxData.chainId
                const signature = await signUpdateImages({
                  chainId,
                  vestingId,
                })
                if (!signature) throw new Error('Signature not found')
                await updateImagesMutation.mutateAsync({
                  coverPicture: newCoverUrl,
                  profilePicture: newLogoUrl,
                  vestingId,
                  signature,
                  chainId,
                  wallet,
                })
                await new Promise((resolve) => setTimeout(resolve, 3000))
                close()
                refresh()
                toast.update(toastId, {
                  render: 'Images updated successfully',
                  type: 'success',
                  isLoading: false,
                  autoClose: 2000,
                })
              } catch (err) {
                toast.update(toastId, {
                  render: err instanceof Error ? err.message : 'Error',
                  type: 'error',
                  isLoading: false,
                  autoClose: 2000,
                })
              }
            }}
            loading={updateImagesMutation.isPending}
            variant="white">
            Update
          </Btn>
        </div>
      </Modal>
      <CoverPreview
        coverUrl={coverUrl}
        logoUrl={logoUrl}
        floatingElement={
          <button
            onClick={open}
            className="absolute right-0 top-0 m-[1rem] rounded-xl bg-black px-[16px] py-[0.7em] text-white">
            <p>Change cover</p>
          </button>
        }
      />
    </>
  )
}

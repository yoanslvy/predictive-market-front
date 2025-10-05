'use client'

import { VestingByIdQuery } from '@/.graphclient'
import { useDisclosure } from '@mantine/hooks'
import { Copy } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'

import { shortenEthAddress } from '@/src/app/minter/global'
import { ChainsData } from '@/src/components/modules/ChainAsset/constants'
import { chainMetadata } from '@/src/utils/global'

import { Btn } from '../../_components/Btn'
import { MintNftModal } from './MintNftModal'

export function NftDetails({
  vesting,
  wallet,
}: {
  vesting: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
  wallet?: string
}) {
  const beneficiaryAddress = vesting.beneficiaryId.split('-')[1]

  const vestingId = vesting.id.split('-')[1]

  const nftAddress = vesting.vestingManagerId.split('-')[1]

  const [topUpFluxModalOpened, { close: closeTopUpFluxModal, open: openTopUpFluxModal }] =
    useDisclosure()

  const isNftNotMintable = !vesting.apiParams.isAllowedMint

  return (
    <>
      {wallet && (
        <MintNftModal
          modalOpened={topUpFluxModalOpened}
          closeModal={closeTopUpFluxModal}
          flux={vesting}
          wallet={wallet}
        />
      )}
      <div className="h-full w-full rounded-xl bg-[#17181C] px-4 sm:px-6 md:px-[34px] py-6 md:py-[32px]">
        <div className="flex h-full w-full flex-col items-start justify-start gap-[1.2em]">
          <div className="flex items-start gap-[0.6rem] flex-col">
            <p className="text-[24px] text-[#F0F2FB] font-bold">NFT</p>
          </div>
          <div className="flex flex-col md:flex-row h-auto w-full items-start gap-4 md:gap-[1.5rem] md:gap-x-[3em]">
            <div className="flex flex-col items-center flex-shrink-0 gap-4">
              <div className="w-[170px] h-[170px] rounded-xl relative flex-shrink-0 overflow-hidden bg-gray-100 border border-green-500">
                <Image
                  src="/assets/images/vesting-nft-placeholder.png"
                  alt="Vesting NFT"
                  width={170}
                  height={170}
                  className="object-contain"
                />
              </div>
            </div>
            {vesting.isMinted ? (
              <div className="flex flex-col items-start justify-start h-full gap-[1em] w-full">
                <div className="bg-[#252831] rounded-lg p-3 border border-[#30333C] flex flex-col justify-between h-[170px] w-full">
                  <div className="flex flex-col justify-between w-full h-full gap-3">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
                        Chain
                      </span>
                      <div className="flex items-center gap-x-[0.4rem]">
                        <div className="[&>svg]:size-[1.6em] [&>img]:size-[1.6em] [&>img]:rounded-full [&>svg]:rounded-full">
                          {ChainsData[vesting.chainId].logo}
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {ChainsData[vesting.chainId].displayName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
                        NFT Address
                      </span>
                      <div className="flex items-center gap-x-[0.4rem]">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${
                            chainMetadata[vesting.chainId].explorer.url
                          }/nft/${nftAddress}/${vestingId}`}
                          className="flex items-center gap-x-[0.5rem]">
                          <span className="text-sm font-semibold text-white underline">
                            {shortenEthAddress(nftAddress)}
                          </span>
                        </Link>
                        <button
                          onClick={() => {
                            void navigator.clipboard.writeText(nftAddress)
                            toast.success('Copied to clipboard')
                          }}>
                          <Copy
                            className="size-[1rem] min-w-[1rem] flex-shrink-0"
                            color="#757A8B"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[#757A8B] text-xs uppercase tracking-wide font-medium">
                        Vesting ID
                      </span>
                      <div className="flex items-center gap-x-[0.4rem]">
                        <span className="text-sm font-semibold text-white">{vestingId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {!isNftNotMintable ? (
                  <div className="flex flex-col items-start justify-start h-full gap-[1em] w-full">
                    <div className="bg-[#252831] rounded-lg p-4 border border-[#30333C] flex flex-col justify-evenly items-center h-[170px] w-full">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        <p className="text-[#F0F2FB] font-semibold">NFT Not Minted</p>
                      </div>
                      <p className="text-[#757A8B] text-sm text-center">
                        This vesting position hasn't been minted as an NFT yet.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-start justify-start h-full gap-[1em] w-full">
                    <div className="bg-[#252831] rounded-lg p-4 border border-[#30333C] flex flex-col justify-evenly items-center h-[170px] w-full">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        <p className="text-[#F0F2FB] font-semibold">NFT Not Mintable</p>
                      </div>
                      <p className="text-[#757A8B] text-sm text-center">
                        This vesting position cannot mint an NFT.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex items-center justify-center w-full">
            {vesting.isMinted ? (
              <Btn
                href={`${chainMetadata[vesting.chainId].explorer.url}/nft/${nftAddress}/${
                  vesting.vestingId
                }`}
                target="_blank"
                as="link"
                rel="noopener noreferrer"
                variant="green"
                className="flex items-center gap-[0.5em]">
                <p className="text-white">View NFT</p>
              </Btn>
            ) : beneficiaryAddress.toLowerCase() === wallet?.toLowerCase() ? (
              <Btn
                variant="green"
                onClick={() => {
                  if (!!isNftNotMintable) {
                    toast.error('This vesting position cannot mint an NFT.')
                    return
                  }
                  openTopUpFluxModal()
                }}
                className="flex items-center gap-[0.5em]">
                <p className="text-white">Mint NFT</p>
              </Btn>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

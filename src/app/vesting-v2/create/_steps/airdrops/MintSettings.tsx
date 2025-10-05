'use client'

import { Divider } from '@mantine/core'

import Message from '@/src/components/modules/Message'

import { Forbidden } from '../../../_svg/Forbidden'
import { PlusInCircle } from '../../../_svg/PlusInCircle'
import { mintNftWarning } from '../../../_utils/utils'
import { FluxSettingOption } from '../_components/FluxSettingOption'
import { MintOptionCard } from '../_components/MintOptionCard'
import { RecipientMintOption } from '../_components/RecipientMintOption'
import { useAirdropStore } from '../_hooks/useAirdropStore'

export function MintSettings() {
  const { mintSettings, fluxSettings, setFluxSettings, setMintSettings } = useAirdropStore((s) => ({
    mintSettings: s.mintSettings,
    setMintSettings: s.setMintSettings,
    fluxSettings: s.fluxSettings,
    setFluxSettings: s.setFluxSettings,
  }))

  return (
    <div className="flex h-full w-full lg:w-[700px] flex-col items-start gap-[2rem]">
      <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-[1rem]">
        <MintOptionCard
          isActive={mintSettings.isMintAllowed}
          icon={<PlusInCircle />}
          title="Mint NFT"
          description={
            <div className="flex flex-col items-start gap-[0.4rem]">
              <Message
                className="text-start"
                type="warn"
                title="Minting NFT concerns"
                text={mintNftWarning}
              />
            </div>
          }
          onClick={() => {
            setMintSettings({
              isMintAllowed: true,
              isMintForRecipientsAllowed: mintSettings.isMintForRecipientsAllowed,
            })
          }}
          tooltip="If checked, the NFT can be minted by either the owner of the vesting or its recipients."
        />

        <MintOptionCard
          isActive={!mintSettings.isMintAllowed}
          icon={<Forbidden stroke="#D24C74" width={42} height={42} />}
          title="Mint not allowed"
          description="Don't allow the recipient to mint an NFT"
          onClick={() => {
            setMintSettings({
              isMintAllowed: false,
              isMintForRecipientsAllowed: false,
            })
          }}
          tooltip="If checked, neither the owner of the vesting nor the recipients will be able to mint the NFT."
        />
      </div>

      <div className="flex w-full flex-col items-start gap-[1rem]">
        <p className="text-[20px] text-white">Allowing recipient(s) to mint</p>
        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-[1rem]">
          <RecipientMintOption
            isSelected={!mintSettings.isMintForRecipientsAllowed && mintSettings.isMintAllowed}
            label="Mint now"
            onClick={() => {
              setMintSettings({
                isMintAllowed: mintSettings.isMintAllowed,
                isMintForRecipientsAllowed: false,
              })
            }}
            disabled={!mintSettings.isMintAllowed}
            tooltip="If enabled, the recipient(s) will mint the NFT immediately"
          />

          <RecipientMintOption
            isSelected={mintSettings.isMintForRecipientsAllowed && mintSettings.isMintAllowed}
            label="Allow user to mint later"
            onClick={() => {
              setMintSettings({
                isMintAllowed: mintSettings.isMintAllowed,
                isMintForRecipientsAllowed: true,
              })
            }}
            disabled={!mintSettings.isMintAllowed}
            tooltip="If enabled, the recipient(s) will be able to mint the NFT at a later time"
          />
        </div>
      </div>

      <Divider color="#30333C" labelPosition="center" className="w-full" />

      <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-[1rem]">
        <FluxSettingOption
          checked={fluxSettings.isFluxCancellable}
          onChange={(checked) => {
            setFluxSettings({
              isFluxCancellable: checked.target.checked,
              isFluxTransferrable: fluxSettings.isFluxTransferrable,
            })
          }}
          label="Make the vesting cancellable"
          tooltip="If enabled, the vesting can be cancelled by the owner of the vesting"
        />

        <FluxSettingOption
          checked={fluxSettings.isFluxTransferrable}
          onChange={(checked) => {
            setFluxSettings({
              isFluxTransferrable: checked.target.checked,
              isFluxCancellable: fluxSettings.isFluxCancellable,
            })
          }}
          label="Make the vesting transferrable"
          tooltip="If enabled, the vesting can be transferred to another address"
        />
      </div>
    </div>
  )
}

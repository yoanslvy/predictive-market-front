import { VestingByIdQuery } from '@/.graphclient'
import { useDisclosure } from '@mantine/hooks'
import { toast } from 'react-toastify'

import { Btn } from '../../_components/Btn'
import { ClaimModal } from './ClaimModal'

export function ClaimButton({
  wallet,
  fluxData,
}: {
  wallet?: string
  fluxData: NonNullable<VestingByIdQuery['vestingV2_vestingById']>
}) {
  const [modalOpened, { close, open }] = useDisclosure()
  return (
    <>
      {wallet && (
        <ClaimModal wallet={wallet} flux={fluxData} modalOpened={modalOpened} closeModal={close} />
      )}
      <Btn
        as="button"
        variant="green"
        onClick={() => {
          if (!wallet) {
            toast.error('Please connect your wallet to claim.')
            return
          }
          if (wallet.toLowerCase() !== fluxData.beneficiaryId.split('-')[1].toLowerCase()) {
            toast.error('You are not the beneficiary of this vesting.')
            return
          }
          open()
        }}
        className="flex items-center gap-[0.5em]">
        <p className="text-white">Claim</p>
      </Btn>
    </>
  )
}

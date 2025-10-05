import Buyback from '../../../../minter/_assets/icons/blueprint/Buyback-Tax-Token.png'
import ERC20 from '../../../../minter/_assets/icons/blueprint/ERC-20-Basic.png'
import ERC404 from '../../../../minter/_assets/icons/blueprint/ERC-404.png'

export function IncorrectParams({
  title = 'No vesting yet!',
  subtitle = 'Connect your wallet and select a valid chain',
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className={'flex items-center justify-center gap-2'}>
        <img src={ERC20.src} alt="" />
        <img src={ERC404.src} alt="" />
        <img src={Buyback.src} alt="" />
      </div>
      <h2 className={'text-lg text-white font-semibold'}>{title}</h2>
      <p className={'text-base text-gray-500'}>{subtitle}</p>
    </div>
  )
}

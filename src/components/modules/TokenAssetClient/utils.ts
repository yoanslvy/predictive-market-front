import { getAddress, isAddress } from 'viem'

import { ChainsData } from '../ChainAsset/constants'

export const getTokenIconUrl = async (
  address: string,
  chain: number | string
): Promise<string | null> => {
  if (!chain || !address || !isAddress(address)) {
    return null
  }

  const checkedAddress = getAddress(address)

  const chainId = Number(chain) || 1

  const sources = [
    `https://raw.githubusercontent.com/dex-guru/assets/main/tokens/${chainId}/${checkedAddress}.svg`,
    `https://raw.githubusercontent.com/dex-guru/assets/main/tokens/${chainId}/${checkedAddress}.png`,
    `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${ChainsData[chainId].trustWalletName}/assets/${checkedAddress}/logo.png`,
    `https://www.dextools.io/resources/tokens/logos/${
      ChainsData[chainId].dexToolsName
    }/${checkedAddress.toLowerCase()}.png`,
    `https://www.dextools.io/resources/tokens/logos/3/${
      ChainsData[chainId].dexToolsName
    }/${checkedAddress.toLowerCase()}.png`,
  ]

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]

    try {
      const response = await fetch(source, {
        method: 'HEAD',
        mode: 'no-cors',
        next: { revalidate: 24 * 60 * 60 },
      })

      if (response.ok) {
        return source
        break
      }
    } catch {
      return null
    }
  }

  return null
}

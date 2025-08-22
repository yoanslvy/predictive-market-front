import { getAddress, isAddress, zeroAddress } from 'viem'

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
    `https://www.dextools.io/resources/tokens/logos/${ChainsData[chainId].dexToolsName
    }/${checkedAddress.toLowerCase()}.png`,
    `https://www.dextools.io/resources/tokens/logos/${ChainsData[chainId].dexToolsName
    }/${checkedAddress.toLowerCase()}.jpg`,
    `https://www.dextools.io/resources/tokens/logos/3/${ChainsData[chainId].dexToolsName
    }/${checkedAddress.toLowerCase()}.png`,
    `https://www.dextools.io/resources/tokens/logos/3/${ChainsData[chainId].dexToolsName
    }/${checkedAddress.toLowerCase()}.jpg`,
    `https://dd.dexscreener.com/ds-data/tokens/${ChainsData[chainId].trustWalletName
    }/${checkedAddress.toLowerCase()}.png`
  ]

  // TODO arnau / this is dragonswap domain, maybe we can look for a better one, but the above ones don't respond to SEI 
  if (chainId === 1329) {
    sources.push(`https://dzyb4dm7r8k8w.cloudfront.net/prod/logos/${checkedAddress}/logo.png`)
  }

  if (address === zeroAddress) {
    sources.push("https://www.dextools.io/resources/chains/med/ether.png")
  }

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

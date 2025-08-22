'server-only'

import IconSuccess from '@images/emoji/lock.svg'

import OpenGraphImage from '@/src/components/modules/OpenGraphImage'
import { OGPSection } from '@/src/components/modules/OpenGraphImage/OGPSection'
import { OGPStats, TokenData } from '@/src/components/modules/OpenGraphImage/OGPStats'
import { OGPTvl } from '@/src/components/modules/OpenGraphImage/OGPTvl'
import { getTokenIconUrl } from '@/src/components/modules/TokenAsset/utils'

export const revalidate = 600

// Route segment config
export const runtime = 'edge'
const formatter = Intl.NumberFormat('en', { notation: 'compact' })

// Image metadata
export const alt = 'Explore UNCX Locks'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/jpeg'

export default async function Image() {
  const imageData = await fetch(
    new URL('@src/app/(metadata)/opengraph_background.png', import.meta.url)
  ).then((res) => res.arrayBuffer())

  // const tokens: TokenData[] = [
  //   { address: '0x14feE680690900BA0ccCfC76AD70Fd1b95D10e16', symbol: '$PAAL', iconUrl: '' },
  //   { address: '0x89d584a1edb3a70b3b07963f9a3ea5399e38b136', symbol: 'AIT', iconUrl: '' },
  // ]

  // for (const token of tokens) {
  //   token.iconUrl = (await getTokenIconUrl(token.address, 1)) || ''
  // }

  return OpenGraphImage(
    <OGPTvl>
      <div
        style={{
          width: '95px',
          display: 'flex',
          placeItems: 'center',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <strong
          style={{
            fontSize: '46px',
            fontWeight: 400,
            display: 'block',
            lineHeight: '48px',
            color: '#80838f',
            textTransform: 'uppercase',
          }}>
          TVL
        </strong>
        {/* <IconSuccess /> */}
      </div>
      <span
        style={{
          fontSize: '100px',
        }}></span>
    </OGPTvl>,
    imageData
  )

  // return OpenGraphImage(
  //   <OGPSection>
  //     <span style={{fontSize: '100px'}}>UNCX Network</span>
  //     <span>Lock, Vest, Verify</span>
  //   </OGPSection>,
  //   imageData
  // )

  // return OpenGraphImage(
  //   <OGPStats
  //     chainId="1"
  //     tokens={tokens}
  //     metric={{ title: 'Locked', value: '329.34M', prefix: '$' }}
  //   />,
  //   imageData
  // )

  // return OpenGraphImage(
  //   <OGPSection>Uniswap V3 NFT Lockers with UNCX Proof of Reserves</OGPSection>,
  //   imageData
  // )

  // return OpenGraphImage(
  //   <OGPStats
  //     chainId="1"
  //     tokens={tokens}
  //     metric={{ title: 'Locked', value: '329.34M', prefix: '$' }}
  //   />,
  //   imageData
  // )

  // return OpenGraphImage(
  //   <OGPStats chainId="1" tokens={tokens} metric={{ title: 'Locked', percent: 50, value: '100' }} />,
  //   imageData
  // )

  // return OpenGraphImage(
  //   <OGPStats
  //     chainId="1"
  //     tokens={tokens}
  //     metric={{ title: 'Locked', percent: 50 }}
  //     stats={[
  //       { title: 'TVL', value: '23.4M', prefix: '$' },
  //       { title: 'Period', value: '3 year' },
  //     ]}
  //   />,
  //   imageData
  // )
}

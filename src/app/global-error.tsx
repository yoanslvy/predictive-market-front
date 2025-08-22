'use client'

import stakingImage from 'public/brand/unicrypt-liquidity-locking-image-3d.png'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation';

import Page from '@modules/Page'
import PageState from '@modules/Page/PageState'

import IconReload from '@images/icons/reload.svg'

import TextBlock from '../components/modules/TextBlock'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])


  const router = useRouter()
  
  return (
    <Page hasWallet={false} appTitle="Select App">
      <PageState
        title="An Error Has Occurred"
        img={stakingImage}
        error={error}
        // actions={[
        //   {
        //     caption: 'Reload Page',
        //     icon: <IconReload />,
        //     onClick: (() =>   
        //     {
        //       router.refresh()
        //       reset()
        //     }),
        //     type: 'primary',
        //   },
        // ]
      // }
        >
        <TextBlock align="center">
          <p>There is an unexpected error.</p>
          <p>
            We are working to resolve this issue. Please try reloading the page or check back later.
          </p>
        </TextBlock>
      </PageState>
    </Page>
  )
}

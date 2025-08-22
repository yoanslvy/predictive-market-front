'server-only'

import '@styles/main.scss'
import imageNotFound from 'public/assets/images/not-found.webp'

import Page from '@modules/Page'
import PageState from '@modules/Page/PageState'
import TextBlock from '@modules/TextBlock'
import { Suspense } from 'react'

export default async function NotFound() {
  return (
    <Suspense>
      <Page hasWallet={false} appTitle="Select App">
        <PageState title="Page Not Found" img={imageNotFound}>
          <TextBlock type="dark" align="center">
            Cannot find the page you are looking for.
          </TextBlock>
        </PageState>
      </Page>
    </Suspense>
  )
}

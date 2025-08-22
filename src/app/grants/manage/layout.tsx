import { Suspense } from 'react'

import Frame from '@modules/Frame'

import WalletConnectionManager from './_components/wallet-connection-manager'
import styles from './page.module.scss'

// use router nav to highlight the buttons (segments), probably need to put the buttons on the side to retain the SSR of the layout

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Frame
        title="Manage Grants"
        // tools={tools}
        className={styles.container}>
        <Suspense>{children}</Suspense>
      </Frame>
      <Suspense>
        <WalletConnectionManager />
      </Suspense>
    </>
  )
}

import { Suspense } from 'react'

import Frame from '@modules/Frame'

import WalletConnectionManager from '../explore/_components/wallet-connection-manager'
import styles from './page.module.scss'

export default function CreateLayout({ children }: { children: React.ReactNode }) {
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

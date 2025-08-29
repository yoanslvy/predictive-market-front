import { Suspense } from 'react'

import Frame from '@modules/Frame'

import WalletConnectionManager from '../manage/_components/wallet-connection-manager'
import styles from './page.module.scss'

export default function GrantLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Frame title="Grant" className={styles.container}>
        <Suspense>{children}</Suspense>
      </Frame>
      <Suspense>
        <WalletConnectionManager />
      </Suspense>
    </>
  )
}

import { FC, ReactNode } from 'react'

import clsx from 'clsx'

import { ButtonProps } from '../Button/Button'
import styles from './Page.module.scss'
import { PageBanner, PageBannerProps } from './PageBanner/PageBanner'
import PageFooter from './PageFooter'
import PageHeader from './PageHeader'

export type PageProps = {
  className?: string
  isEmbeddedApp?: boolean
  headerLinks?: ButtonProps[]
  appTitle: string
  children?: ReactNode | ReactNode[]
  banner?: PageBannerProps
  hasWallet?: boolean
}

export const Page: FC<PageProps> = ({
  headerLinks,
  className,
  children,
  appTitle,
  isEmbeddedApp,
  banner,
  hasWallet = true,
}) => {
  return (
    <div id="page" className={clsx(styles.container, className)}>
      < div className={styles.header}>
        <PageHeader isEmbedded={isEmbeddedApp ? isEmbeddedApp : false} links={headerLinks} appTitle={appTitle} hasWallet={hasWallet} />
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          {(!!banner && !isEmbeddedApp) && <PageBanner {...banner} />}
          {children}
        </div>
      </div>
      <div className={styles.footer}>
        <PageFooter />
      </div>
    </div >
  )
}

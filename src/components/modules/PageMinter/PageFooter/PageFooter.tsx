import Link from 'next/link'

import { FC } from 'react'

import IconDiscord from '@images/icons/discord.svg'
import IconTelegram from '@images/icons/telegram.svg'
import IconTwitter from '@images/icons/twitter.svg'
import IconLogo from '@images/uncx/logo-image.svg'
import IconTrustpilot from '@images/uncx/trustpilot.svg'

import Separated from '../../Separated'
import styles from './PageFooter.module.scss'

export const PageFooter: FC = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.info}>
        <Separated className={styles.infoData}>
          <Link href="https://www.uncx.network/" className={styles.copyright}>
            <IconLogo className={styles.copyrightIcon} />
            UNCX Network © 2021-2025
          </Link>
          <Link
            className={styles.link}
            target="_blank"
            href="https://app.uncx.network/terms-conditions">
            Terms & Conditions
          </Link>
        </Separated>
      </div>

      <div className={styles.info}>
        <Separated className={styles.infoLinks}>
          <Link
            target="_blank"
            href="https://www.trustpilot.com/review/uncx.network"
            className={styles.link}>
            <div className={styles.trustpilot}>
              Trustpilot <IconTrustpilot className={styles.trustpilotIcon} />
            </div>
          </Link>

          <nav className={styles.links}>
            <ul className={styles.linksList}>
              <li className={styles.linksItem}>
                <Link
                  target="_blank"
                  href="https://discord.com/invite/S2FXPawJWw"
                  className={styles.link}>
                  <IconDiscord className={styles.linkIcon} />
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link target="_blank" href="https://t.me/uncx_token" className={styles.link}>
                  <IconTelegram className={styles.linkIcon} />
                </Link>
              </li>
              <li className={styles.linksItem}>
                <Link target="_blank" href="https://twitter.com/UNCX_token" className={styles.link}>
                  <IconTwitter className={styles.linkIcon} />
                </Link>
              </li>
            </ul>
          </nav>

          <nav className={styles.links}>
            <Link
              target="_blank"
              href="https://docs.uncx.network/documentation/getting-started"
              className={styles.link}>
              Docs
            </Link>
          </nav>
        </Separated>
      </div>
    </footer>
  )
}

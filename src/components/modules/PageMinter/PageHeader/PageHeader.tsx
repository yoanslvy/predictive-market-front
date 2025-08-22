'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { format } from 'url'

import { FC, useEffect, useRef, useState } from 'react'

import clsx from 'clsx'

import WalletButton from '@modules//WalletButton'
import Button from '@modules/Button'
import { ButtonProps } from '@modules/Button/Button'

import IconSearch from '@images/icons/search.svg'
import LogoText from '@images/uncx/logo-punched-out-text.svg'
import LogoImg from '@images/uncx/logo-punched-out.svg'

// import { getRootElement } from '@/src/src/utils'
import Box from '../../Box'
import PageAppSelector from '../PageAppSelector'
import { PageSearch } from '../PageSearch/PageSearch'
import styles from './PageHeader.module.scss'

type PageNavLink = ButtonProps
type PageHeaderProps = {
  links?: PageNavLink[]
  appTitle: string
  isEmbedded: boolean
  hasWallet?: boolean
}

// export function getRootElement() {
//   if (typeof window !== "undefined") {
//     return document?.getElementById('page') || document?.body || null
//   }
// }

export const PageHeader: FC<PageHeaderProps> = ({ links, appTitle, isEmbedded, hasWallet }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const refDialog = useRef<HTMLDivElement>(null)
  // const [mounted, setMounted] = useState(false);

  const handleSearchOpen = () => {
    setIsSearchOpen(true)
  }
  const handleSearchClose = () => {
    setIsSearchOpen(false)
  }

  const handleClick = (event: Event): void => {
    const targetElement = event.target as Element
    if (!event.target || !refDialog.current?.contains(targetElement)) {
      handleSearchClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)

    return (): void => {
      document.removeEventListener('mousedown', handleClick)
    }
  })

  const searchParamsObject = Array.from(searchParams.entries()).reduce(
    (acc: { [key: string]: string }, [key, value]) => {
      acc[key] = value
      return acc
    },
    {}
  )

  return (
    <>
      <header className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.app}>
            <Link href="/stealth/explore" className={styles.logo}>
              <LogoImg className={styles.logoImg} />
              <LogoText className={styles.logoText} />
            </Link>
            {!isEmbedded && <PageAppSelector title={appTitle} className={styles.link} />}
          </div>
          {!isEmbedded && (
            <>
              <nav className={styles.nav}>
                <ul className={styles.navList}>
                  {links?.map((link, idx) => (
                    <li className={styles.navItem} key={idx}>
                      <Button
                        type="link"
                        size="lg"
                        caption={link.caption}
                        {...link}
                        isActive={
                          !!(
                            link.activators &&
                            link.activators.find((activator) =>
                              pathname.startsWith(format(activator))
                            )
                          ) || pathname.startsWith(format(link.href || ''))
                        }
                        className={clsx(styles.link, link.className)}
                      />
                    </li>
                  ))}
                </ul>
                {/*  <Button
                  // href={{ pathname, query: { modal: 'search', ...searchParamsObject } }}
                  href={'/stealth/search'}
                  // type={'action'}
                  type={pathname.includes('search') ? 'tertiary' : 'action'}
                  scroll={false}
                  className={styles.search}
                  onClick={handleSearchOpen}
                  icon={<IconSearch className={styles.searchIcon} />}
                /> */}
              </nav>
              {hasWallet && (
                <div className={styles.personal}>
                  <WalletButton className={styles.connect} />
                </div>
              )}
            </>
          )}
        </div>
      </header>

      {/* {createPortal(
        <dialog className={styles.dialog} open={isSearchOpen}>
          <Box className={styles.dialogContent} ref={refDialog}>
            {!!isSearchOpen && (
              <PageSearch className={styles.dialogSearch} onClose={handleSearchClose} />
            )}
          </Box>
        </dialog>,
        document.body
      )} */}
    </>
  )
}

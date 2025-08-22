'use client'

import cookie from 'js-cookie'
import Link from 'next/link'
import Script from 'next/script'

import { useEffect, useState, useCallback } from 'react'

import CookieIcon from '@images/icons/cookie.svg'

import Button from '../components/modules/Button'
import Heading from '../components/modules/Heading'

const cookieConsentArg = 'cookieConsent'

enum Consent {
  Accepted = 'accepted',
  Rejected = 'rejected',
  NotSet = '',
}

const isDevelopment = process.env.NODE_ENV === 'development'

const log = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args)
  }
}

export default function Cookies() {
  const [getShowBanner, setShowBanner] = useState(false)
  const [getCookies, setCookies] = useState<Consent>(Consent.NotSet)

  useEffect(() => {
    const consentCookies = cookie.get(cookieConsentArg) as Consent
    log('Initial cookie value:', consentCookies)

    if (!consentCookies) {
      log('No consent cookie found, showing banner')
      setShowBanner(true)
    } else {
      log('Consent cookie found:', consentCookies)
      setCookies(consentCookies)
    }
  }, [])

  const handleReject = useCallback(() => {
    log('Rejecting cookies')
    setShowBanner(false)
    cookie.set(cookieConsentArg, Consent.Rejected, { expires: 365 })
    setCookies(Consent.Rejected)
  }, [])

  const handleAccept = useCallback(() => {
    log('Accepting cookies')
    setShowBanner(false)
    cookie.set(cookieConsentArg, Consent.Accepted, { expires: 365 })
    setCookies(Consent.Accepted)
  }, [])

  useEffect(() => {
    log('Cookies state changed:', getCookies)
    log('Banner visibility changed:', getShowBanner)
  }, [getCookies, getShowBanner])

  return (
    <>
      {getShowBanner && (
        <div className="fixed bottom-20 border-zinc-700 border-[1px] left-4 z-50 mr-4 w-fit min-[960px]:max-w-md rounded-3xl shadow-2xl p-4 bg-black min-[960px]:bottom-4 min-[960px]:p-5">
          <div className="flex flex-col space-y-4">
            <div>
              <div className="flex w-full justify-between">
                <Heading className="my-auto" size="xs" title="Cookie Policy" />
                <div className="w-8 h-8 pr-1 pt-1">
                  <CookieIcon />
                </div>
              </div>
              <p className="text-sm pt-2">
                In order to improve the operation of our app, we use cookies. By using the website
                without changing cookie settings, you consent to their storage or use. The cookie
                settings can be changed in the web browser. More details about cookies can be found
                in our
                <Link
                  target="_blank"
                  className="ml-1 underline"
                  href="https://app.uncx.network/terms-conditions">
                  cookie policy
                </Link>
                .
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={handleReject} size="xs" type="link">
                Decline
              </Button>
              <Button onClick={handleAccept} size="xs" type="primary">
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
      {getCookies === Consent.Accepted && (
        <Script
          src="https://cdn.markfi.xyz/scripts/analytics/0.11.16/cookie3.analytics.min.js"
          integrity="sha384-lp8ATuGdLnhwAutE0SOVmSINtZ4DObSNjODmbbjYxaX92FOPBLyZjN+wVIaoK4Qy"
          crossOrigin="anonymous"
          async
          strategy="lazyOnload"
          site-id="c444cd9e-0ae9-4f73-8d56-f82410aacf1c"
          data-consent-required="true"
          onLoad={() => log('Analytics script loaded')}
          onError={() => isDevelopment && console.error('Failed to load analytics script')}
        />
      )}
    </>
  )
}

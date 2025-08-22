"use client"
import { FC } from 'react'
import Heading from '../Heading'
import Button from '../Button'

import styles from './Cookie.module.scss'

import CookieIcon from '@images/icons/cookie.svg'

export const Cookie: FC<{
  accept: () => void,
  decline: () => void,
}> = ({
  accept, decline
}) => {
    return (
      <div className={styles.container}>
        <CookieIcon />
        <Heading size="md">Cookie Policy</Heading>
        <p className={styles.description}>In order to improve the operation of our app, we use cookies. By using the website without changing cookie settings, you consent to their storage or use. The cookie settings can be changed in the web browser. More details about cookies can be found in our Privacy Policy.</p>
        <div className={styles.action}>
          <Button size="md" type="action" caption="Decline" onClick={decline} />
          <Button size="md" type="primary" caption="Accept" onClick={accept} />
        </div>
      </div>
    )
  }

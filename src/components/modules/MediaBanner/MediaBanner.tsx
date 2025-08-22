import Image from 'next/image'

import { FC, ReactNode, useRef } from 'react'

import clsx from 'clsx'

import styles from './MediaBanner.module.scss'
import { MediaBannerImage } from './MediaBannerImage'

export type MediaBannerProps = {
  img: string
  video?: string
  text?: ReactNode
  children?: ReactNode
  className?: string
}

export const Banner: FC<MediaBannerProps> = ({ img, video, text, className, children }) => {
  return (
    <div className={clsx(styles.container, className)}>
      {!!video && (
        <video className={styles.illustration} poster={img} playsInline autoPlay muted loop>
          <source src={video} type="video/mp4" />
        </video>
      )}
      <MediaBannerImage img={img} />
      <div className={styles.content}>{text || children}</div>
    </div>
  )
}

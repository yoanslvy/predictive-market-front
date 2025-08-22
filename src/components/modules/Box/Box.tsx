import { clsx } from 'clsx'
import Image, { StaticImageData } from 'next/image'
import { forwardRef, HTMLProps, ReactNode } from 'react'

import styles from './Box.module.scss'

type BoxType = 'light' | 'dark' | 'shade'

export type BoxProps = Omit<HTMLProps<HTMLDivElement>, 'title'> & {
  className?: string
  type?: BoxType
  children?: ReactNode | ReactNode[]
  image?: string | StaticImageData
  isGlass?: boolean
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
  { className, type = 'shade', children, image, isGlass, ...props },
  ref
) {
  const imgProps = image
    ? typeof image === 'string'
      ? { src: image, width: 100, height: 100 }
      : image
    : undefined

  return (
    <div
      {...props}
      className={clsx(styles.container, styles[type], { [styles.glass]: isGlass }, className)}
      ref={ref}>
      {!!imgProps && <Image className={styles.image} src={imgProps} alt="" />}
      <div className={styles.content}>{children}</div>
    </div>
  )
})

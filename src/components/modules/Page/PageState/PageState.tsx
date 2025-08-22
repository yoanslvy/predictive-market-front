import Box from '@modules/Box'
import Button from '@modules/Button'
import { ButtonProps } from '@modules/Button/Button'
import Heading from '@modules/Heading'
import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import { FC, ReactNode } from 'react'

import TextBlock from '../../TextBlock'
import styles from './PageState.module.scss'

type PageStateProps = {
  title: ReactNode
  className?: string
  img: string | StaticImageData
  actions?: ButtonProps[]
  children?: ReactNode | ReactNode[]
  error?: Error
}

export const PageState: FC<PageStateProps> = ({
  title,
  className,
  img,
  actions,
  error,
  children,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      <Box type="shade" className={styles.box}>
        <div className={styles.header}>
          <Image src={img} height={200} width={240} alt="Not found" className={styles.image} />
        </div>
        <div className={styles.body}>
          <Heading size="md" className={styles.title}>
            {title}
          </Heading>
          {!!children && (
            <TextBlock type="dark" align="center" className={styles.content}>
              {children}
            </TextBlock>
          )}
        </div>
        {!!actions && (
          <div className={styles.footer}>
            {actions.map((action) => (
              <Button {...action} className={clsx(styles.action, action.className)} size="md" />
            ))}
          </div>
        )}
      </Box>
      {process.env.NODE_ENV === 'development' && !!error && (
        <details className={styles.details}>
          <summary>Error details</summary>
          <div className={styles.error}>
            {!!error.message && <pre>{error.message}</pre>}

            {!!error.stack && (
              <details>
                <summary>Error stack</summary>
                <div className={styles.stack}>
                  <pre>{error.stack}</pre>
                </div>
              </details>
            )}
          </div>
        </details>
      )}
    </div>
  )
}

import { FC, forwardRef, ReactNode } from 'react'

import { Box, BoxProps } from '../Box/Box'
import Heading from '../Heading'
import Tools from '../Tools'
import styles from './Card.module.scss'

type CardProps = BoxProps & { title?: ReactNode; tools?: ReactNode; icon?: ReactNode }

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { title, className, tools, icon, children, ...props },
  ref
) {
  return (
    <Box {...props} className={(styles.container, className)} ref={ref}>
      {(!!title || !!icon || !!tools) && (
        <div className={styles.header}>
          {!!icon && <span className={styles.icon}>{icon}</span>}
          {!!title && (
            <Heading size="md" className={styles.heading}>
              {title}
            </Heading>
          )}
          <Tools className={styles.tools}>{tools}</Tools>
        </div>
      )}
      {children}
    </Box>
  )
})

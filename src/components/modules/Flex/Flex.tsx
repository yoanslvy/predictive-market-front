import { FC, ReactNode } from 'react'

import styles from './Flex.module.scss'
import clsx from 'clsx'

type FlexSize = 'sm' | 'md' | 'lg'

type FlexProps = {
  size?: FlexSize
  children?: ReactNode;

};

export const Flex: FC<FlexProps> = ({ children, size = 'xs' }) => {
  return (
    <div className={clsx(styles.container, styles[size])}> 
      {children}
    </div>
  )
}

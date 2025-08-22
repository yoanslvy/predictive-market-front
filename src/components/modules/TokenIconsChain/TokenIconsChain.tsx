import { FC } from 'react'

import clsx from 'clsx'

import TokenIcon from '../TokenIcon'
import { TokenIconProps, TokenIconSize } from '../TokenIcon/TokenIcon'
import styles from './TokenIconsChain.module.scss'

export type TokenIconsChainProps = {
  className?: string
  tokens?: TokenIconProps[]
  size?: TokenIconSize
}

export const TokenIconsChain: FC<TokenIconsChainProps> = ({ tokens, className, size = 'md' }) => {
  if (!tokens) {
    return null
  }

  return (
    <div className={clsx(styles.container, className)}>
      {tokens.map((token, idx) => {
        return (
          <TokenIcon
            {...token}
            key={idx}
            className={clsx(styles.token, { [styles[size]]: !!size })}
            size={size}
          />
        )
      })}
    </div>
  )
}

"use client";

import Flex from '@/src/components/modules/Flex';
import Tag from '@/src/components/modules/Tag';
import Value from '@/src/components/modules/Value';

import styles from "./Tokens.module.scss";
import TokenIcon from '@/src/components/images/tokenIcon';
import { UrlObject } from 'url';

interface TokenProps {
  symbol: string
  ratio: number
  value: string
  address: string
}

interface TokensProps {
  token0: TokenProps
  token1?: TokenProps
  href?: string | UrlObject
  prefetch?: boolean,
  scroll?: boolean
  chainId: string
}
import IconDropdown from '@images/icons/chevronD.svg'
import Link from 'next/link';


export function Tokens<T>({ token0, token1, chainId, href, prefetch, scroll }: TokensProps) {

  const content = (
    <div className={styles.container}>
      <div className={styles.tokens}>
        <div className={styles.token}>
          <TokenIcon tokenAddress={token0.address} chainId={chainId} classNames={{ unknown: styles.iconToken, button:styles.iconToken }} />
          <div>
            <div className={styles.symbol}>{token0.symbol}</div>
            <Flex>
              <Value value={token0.value} size='md' />
              <Tag type='info' caption={`${token0.ratio}%`} />
            </Flex>
          </div>
        </div>
        {
          token1 &&
          <div className={styles.token}>
            <TokenIcon tokenAddress={token1.address} chainId={chainId} classNames={{ unknown: styles.iconToken, button:styles.iconToken }} />
            <div>
              <div className={styles.symbol}>{token1.symbol}</div>
              <Flex>
                <Value value={token1.value} size='md' />
                <Tag type='info' caption={`${token1.ratio}%`} />
              </Flex>
            </div>
          </div>
        }
      </div>
      <IconDropdown className={styles.iconArrow} />
    </div>
  )

  if (href) {
    return (
      <Link prefetch={prefetch} scroll={scroll} href={href}>
        {content}
      </Link>
    )
  }

  return (
    content
  )
}




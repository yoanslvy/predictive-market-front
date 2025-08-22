'use client'

import clsx from 'clsx'

import { formatUnits } from 'viem'

import Flex from '@components/modules/Flex'

import Icon from '@images/icons/ok.svg'

import { Heading } from '@/src/components/modules/Heading/Heading'
import { Fee, FeeOptionName } from '@/src/server/fetchers/lockers-v3/viem/getFeesV3Viem'
import { getNativeToken } from '@/src/utils/global'

import styles from './FeeOptions.module.scss'

interface FeeOptionsProps {
  items: Fee[]
  chainId: string
  active: FeeOptionName
  onClick: (item: Fee) => void
}
export function FeeOptions<T>({ items, chainId, active, onClick }: FeeOptionsProps) {
  return (
    <>
      <Heading size="sm" tooltip="UNCX protocol fee options." title="Fee Options" />
      <Flex>
        {items.map((item: Fee, index: number) => {
          const {
            name,
            lpFee,
            collectFee,
            flatFee,
            customFee,
            customFeeDecimals,
            customFeeSymbol,
          } = item
          return (
            <div
              key={index}
              className={clsx(styles.item, { [styles.activeItem]: name === active })}
              onClick={() => onClick(item)}>
              {name === active && (
                <div className={styles.icon}>
                  <Icon />
                </div>
              )}

              <div className={styles.title}>{name}</div>
              <Flex>
                {lpFee !== BigInt(0) && (
                  <span className={styles.details}>
                    <span className={styles.value}>{Number(lpFee) / 100}%</span>
                    <span className={styles.footer}>
                      {name === 'VESTING' ? 'Token Fee' : 'Liquidity'}{' '}
                    </span>
                  </span>
                )}
                {collectFee !== BigInt(0) && (
                  <span className={styles.details}>
                    <span className={styles.value}>{Number(collectFee) / 100}%</span>
                    <span className={styles.footer}>collect fee</span>
                  </span>
                )}
                {flatFee !== BigInt(0) && (
                  <span className={styles.details}>
                    <span className={styles.value}>
                      {Number(
                        formatUnits(BigInt(flatFee), getNativeToken(chainId).decimals)
                      ).toFixed(3)}
                    </span>
                    <span className={styles.footer}>{getNativeToken(chainId).symbol}</span>
                  </span>
                )}
                {customFee != undefined &&
                  customFee !== BigInt(0) &&
                  customFeeDecimals != undefined && (
                    <span className={styles.details}>
                      <span className={styles.value}>
                        {Number(formatUnits(BigInt(customFee), Number(customFeeDecimals))).toFixed(
                          3
                        )}
                      </span>
                      <span className={styles.footer}>{customFeeSymbol}</span>
                    </span>
                  )}
              </Flex>
            </div>
          )
        })}
      </Flex>
    </>
  )
}

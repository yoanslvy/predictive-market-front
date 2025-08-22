"use client";

import clsx from "clsx";

import styles from "./FeeOptions.module.scss";

import Icon from '@images/icons/ok.svg'


import Flex from "@components/modules/Flex";

import amountFormatter from "@/src/interfaces/web3/univ3/amountFormatter";
import { Heading } from "@/src/components/modules/Heading/Heading";
import { getNativeToken } from "@/src/utils/global";

interface FeeOptionsProps {
  items: Fee[]
  chainId: string
  active: FeeOptionName
  onClick: (item: Fee) => void
}

export type FeeOptionName = 'YES' | 'NO'

export type Fee = {
  name: FeeOptionName,
  lpFee: bigint,
  collectFee: bigint,
  flatFee: bigint,
  flatFeeToken: `0x${string}`
  customFee?: bigint
  customFeeDecimals?: bigint
  customFeeSymbol?: string
}


export function FeeOptions<T>({ items, chainId, active, onClick }: FeeOptionsProps) {
  return (
    <>
      <Heading size="sm" 
      tooltip="Apply a fee to each lock, or pay it once seperately, paying the fee seperately helps ensure the amount of the lock matches the amount you entered." 
      title="Charge Fee Separately?" />
      <Flex>
        {items.map((item: Fee, index: number) => {
          const { name, lpFee, collectFee, flatFee, customFee, customFeeDecimals, customFeeSymbol } = item
          return (
            <div key={index} className={clsx(styles.item, { [styles.activeItem]: name === active })} onClick={() => onClick(item)}>
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
                    <span className={styles.footer}>{name} </span>
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
                    <span className={styles.value}>{amountFormatter.fUnits(BigInt(flatFee), getNativeToken(chainId).decimals)}</span>
                    <span className={styles.footer}>{getNativeToken(chainId).symbol}</span>
                  </span>
                )}
                {((customFee != undefined) && (customFee !== BigInt(0) && (customFeeDecimals != undefined))) && (
                  <span className={styles.details}>
                    <span className={styles.value}>{amountFormatter.fUnits(BigInt(customFee), Number(customFeeDecimals))}</span>
                    <span className={styles.footer}>{customFeeSymbol}</span>
                  </span>
                )}
              </Flex>
            </div>)
        })}
      </Flex>
    </>

  )
}




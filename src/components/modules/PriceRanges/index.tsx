
'use client'

import { useEffect, useState } from 'react'

import Heading from '@/src/components/modules/Heading'
import Grid from '@/src/components/modules/Grid';
import Tabs from '@/src/components/modules/Tabs';
import LockInRange from '@/src/components/modules/LockInRange';
import { tickToPriceRatioAsString } from '@/src/interfaces/web3/univ3/math/TickToPrice';
import { LockType, Pool } from '@/src/app/lockers/univ3/chain/[chain]/address/[address]/_fetchers/lockedPoolDataChainGql'
import { ContractLockV3Extended } from '@/src/server/fetchers/lockers-v3/fetchLocksforUserV3';

export default function PriceRanges(
  { params }: {
    params: {
      lock: ContractLockV3Extended    
    }
  }

) {

  let lock = params.lock

  const [priceRangeInToken0, setPriceRangeInToken0] = useState(true);
  const [oldSwitchItem, setOldSwitchItem] = useState('');

  useEffect(() => {
    setOldSwitchItem(lock.token0!.symbol)
  }, [])


  return (
    <>
      <Grid>
        <Heading size="sm" title={'Price Range'} />
        {/* <Heading size="sm" title={!lockFormState.lockInFullRange ? "Lock in Range" : "Lock in Full Range"} /> */}
        <Tabs
          type="switch"
          size='xs'
          items={[
            {
              caption: lock.token0!.symbol,
              value: lock.token0!.symbol,
              scroll: false,
            },
            {
              caption: lock.token1!.symbol,
              value: lock.token1!.symbol,
              scroll: false,
            },
          ]}
          value="3212"
          className="newLockV3 justify-end mr-4"
        onChange={(item) => {
          if (item.value !== oldSwitchItem) {
            setPriceRangeInToken0(!priceRangeInToken0)
          }
          setOldSwitchItem(item.value)
        }}
        />
      </Grid>
      {/* lockFormState.priceRangeInToken0 */}
      <Grid>
        <LockInRange
          minPrice={Number(lock.position?.tickLower) < -887150 ? '0' : tickToPriceRatioAsString(priceRangeInToken0 ? Number(lock.position?.tickLower) : Number(lock!.position?.tickUpper), !priceRangeInToken0, lock.token0!.decimals, lock.token1!.decimals).toString()}
          currentPrice={tickToPriceRatioAsString(Number(lock.slot0?.currentTick), !priceRangeInToken0, lock.token0!.decimals, lock.token1!.decimals)}
          maxPrice={Number(lock.position?.tickUpper) > 887150 ? '∞' : tickToPriceRatioAsString(priceRangeInToken0 ? Number(lock.position?.tickUpper) : Number(lock?.position?.tickLower), !priceRangeInToken0, lock.token0!.decimals, lock.token1!.decimals).toString()}
          inRange={Number(lock.slot0?.currentTick) >= Number(lock.position?.tickLower) && Number(lock.slot0?.currentTick) <= Number(lock.position?.tickUpper)}
        />
      </Grid>
    </>
  )
}




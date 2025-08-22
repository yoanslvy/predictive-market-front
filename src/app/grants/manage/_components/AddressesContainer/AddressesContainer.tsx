'use client'

import Copy from '@/src/components/modules/Copy'
import styles from './Addresses.module.scss'
import { truncate } from '@/src/utils/global'

interface Address{
  title: string
  address?: string

}

interface Addresses {
  addresses: Address[]
}

export default function AddressesContainer({ addresses }: Addresses) {
  
  if(addresses.filter(({ address }) => address).length === 0) return null
  
  return (
    <div className={styles.addressessContainer}>
      {addresses.map(({ title, address }, index) => {
        if(!address) return null
        return (          
          <div className={styles.addressessItem} key={index}> 
            <span className={styles.addressessTitle}>{title}:</span>
            <div className={styles.addressessCopy}>
              <Copy text={address} caption={truncate(address, 12, '...')} />
            </div>
          </div>
        )
      })}
    </div>
  )
}



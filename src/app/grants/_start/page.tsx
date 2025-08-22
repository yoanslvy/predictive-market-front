import Image from 'next/image';

import IconLockV3 from '@images/apps/lock-v3.svg'
import IconLockV2 from '@images/apps/lock-v2.svg'
import IconVesting from '@images/apps/vesting.svg'

import Battery from '@images/start/battery.svg'
import BannerLogo from '@images/start/logo.svg'
import Banner from '@images/start/banner.png'

import Heading from "@/src/components/modules/Heading";
import Card from './Card';

import styles from './page.module.scss'


export default async function StartLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.containerBanner}>
        <div className={styles.title}>
          <Heading size='xxl'>UNCX Network</Heading>
          <p className={styles.description}>Lorem ipsum dolor sit amet consectetur. Quis sem non nunc nulla at. </p>
        </div>
        <BannerLogo className={styles.bannerLogo} />
      </div>
      <Image src={Banner} alt="banner" className={styles.banner} />

      <div className={styles.containerCards}>
        <div className={styles.rowCards}>
          <Heading size="xl">Lockers</Heading>
          <div className={styles.cards}>
            <Card 
              title="V2 liquidity" 
              description="Lock your V2 liquidity, improve your token's safety score"
              icon={<IconLockV2 className={styles.iconCards} />}
              flow="column"
            />
            <Card 
              title="V3 liquidity"
              description="Secure base liquidity, earn fees"
              icon={<IconLockV3 className={styles.iconCards} />}
              flow="column"
            />
            <Card 
              title="V4 liquidity"
              description="Lock your custom Uniswap V4 positions"
              icon={<IconLockV3 className={styles.iconCards} />}
              flow="column"
            />
          </div>

        </div>
        <div className={styles.rowCards}>
          <Heading size="xl">Vesting</Heading>
          <div className={styles.containerCards}>
            <Card 
              title="Token Vesting"
              description='Lorem ipsum dolor sit amet consectetur. Quis sem non nunc nulla at.' 
              icon={<Battery />}
              flow="row"
            />
            <Card 
              title="Arrakis"
              description='Lorem ipsum dolor sit amet consectetur. Quis sem non nunc nulla at.' 
              icon={<IconVesting className={styles.iconCards} />}
              flow="column"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

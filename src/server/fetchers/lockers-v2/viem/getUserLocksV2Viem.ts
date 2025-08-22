import { PublicClient, formatUnits, getContract } from 'viem'


import erc20basic from '@/src/interfaces/web3/abis/erc20basic'
import serverWeb3Client from "@/src/app/(providers)/serverWeb3Client"

import lockers_V2_1_Basic from '@/src/interfaces/web3/abis/lockers_V2_1_Basic'
import lockers_V2_Basic from '@/src/interfaces/web3/abis/lockers_V2_Basic'

import { chainFactoryLockerMap, getValuesStartingWith, lockerAerodrome } from '@/src/utils/global'
import poolV2basic from '@/src/interfaces/web3/abis/poolV2basic'
import { getUserLocks } from '@/src/server/queries/lock/liquidity-v2/getUserLocks'




export interface LPToken {
  locker_id: string,
  pool_id: string,
  total_supply: string,
  token0_id: string,
  token0_symbol: string,
  token1_id: string,
  token1_symbol: string,
  lock_number: number,
  locks: TokenLock[]
}

interface TokenLock {
  lpToken: string; // Assuming address is a string representing an Ethereum address
  lockDate: bigint; // Assuming dates and amounts can be represented as bigints
  amount: string;
  initialAmount: bigint;
  unlockDate: bigint;
  lockID: bigint;
  owner: string; // Assuming address is a string representing an Ethereum address
  index: number
}


// TODO: check and adjust so that v2 only works on set old contracts

export async function getUserLocksV2Viem(chain: string, wallet: `0x${string}`) {



  try {


    let publicClient: PublicClient = serverWeb3Client.getClient(chain)

    if (chain === '8453') {
      publicClient = serverWeb3Client.getBaseClient(chain) as PublicClient
    }



    let pools = await getLocks(

      publicClient,
      {
        chainID: chain,
        wallet: wallet
      })


    return {
      success: true,
      result: pools


    }

  } catch (error: any) {
    return { success: false, error: error.message }; // Rejected error
  }
}


const getLocks = async (client: PublicClient, params: {
  chainID: string,
  wallet: `0x${string}`
}) => {



  function symbolPopulatedPools(tempPools: LPToken[]) {
    return tempPools.map(tempPool => {

      let token0Contract = getContract({
        address: tempPool.token0_id as `0x${string}`,
        client,
        abi: poolV2basic
      })
      let token1Contract = getContract({
        address: tempPool.token1_id as `0x${string}`,
        client,
        abi: poolV2basic
      })

      let token0_symbol = token0Contract.read.symbol()
      let token1_symbol = token1Contract.read.symbol()

      return {
        token0: token0_symbol,
        token1: token1_symbol
      }
    })
  }




  let pools: LPToken[] = []

  let lockerV2Contracts = getValuesStartingWith(chainFactoryLockerMap['lockers-v2'], params.chainID + '-')
  let lockerV2_2Contracts = getValuesStartingWith(chainFactoryLockerMap['lockers-v2_1'], params.chainID + '-')
  let lockerAerodromeV2Contracts = lockerAerodrome['V2']


  for (let i = 0; i < lockerV2Contracts.length; i++) {
    let lockerContract_V2 = getContract({
      address: lockerV2Contracts[i] as `0x${string}`,
      client,
      abi: lockers_V2_Basic
    })

    let numberOfLockedTokens = await lockerContract_V2.read.getUserNumLockedTokens([params.wallet])

    if (numberOfLockedTokens > 0n) {

      let lockedTokensCalls = Array.from({ length: Number(numberOfLockedTokens) }, (_, index) => {
        return lockerContract_V2.read.getUserLockedTokenAtIndex([params.wallet, BigInt(index)])
      })

      const lockedTokens = await Promise.all(
        lockedTokensCalls,
      )

      let tokensCalls = lockedTokens.map((token, index) => {

        let poolContract = getContract({
          address: token,
          client,
          abi: poolV2basic
        })

        let token0_id = poolContract.read.token0()
        let token1_id = poolContract.read.token1()
        let total_supply = poolContract.read.totalSupply()

        return {
          token0: token0_id,
          token1: token1_id,
          total_supply: total_supply
        }
      })

      const tokenPromises: Promise<`0x${string}` | bigint>[] = tokensCalls.map(pair => [pair.token0, pair.token1, pair.total_supply]).flat();

      let result = await Promise.all(tokenPromises)

      const tokenPairs = [];

      for (let i = 0; i < result.length; i += 3) {
        tokenPairs.push({
          token0: result[i],
          token1: result[i + 1],
          total_supply: result[i + 2]
        });
      }

      // let tempPool: LPToken

      let tempPools: LPToken[] = tokenPairs.map((pair, index) => {

        return {
          locker_id: lockerV2Contracts[i],
          pool_id: lockedTokens[index],
          token0_id: pair.token0 as `0x${string}`,
          token1_id: pair.token1 as `0x${string}`,
          total_supply: formatUnits(pair.total_supply as bigint, 18),
          token0_symbol: '',
          token1_symbol: '',
          lock_number: 0,
          locks: []
        }
      })


      let poolSymbolCalls = symbolPopulatedPools(tempPools)


      const symbolPromises = poolSymbolCalls.map(pair => [pair.token0, pair.token1]).flat();

      let symbolResult = await Promise.all(symbolPromises)

      const symbolPairs: { symbol0: string, symbol1: string }[] = [];

      for (let i = 0; i < symbolResult.length; i += 2) {
        symbolPairs.push({
          symbol0: symbolResult[i],
          symbol1: symbolResult[i + 1]
        });
      }

      let tempPoolsSymbols: LPToken[] = tempPools.map((pool, index) => {

        let t = pool

        t.token0_symbol = symbolPairs[index].symbol0
        t.token1_symbol = symbolPairs[index].symbol1

        return t

      })


      for (let i = 0; i < lockedTokens.length; i++) {

        let numberOfLocksForToken = await lockerContract_V2.read.getUserNumLocksForToken([params.wallet, lockedTokens[i]])

        if (numberOfLocksForToken > 0n) {
          let userLockCalls = Array.from({ length: Number(numberOfLocksForToken) }, (_, index) => {
            return lockerContract_V2.read.getUserLockForTokenAtIndex([params.wallet, lockedTokens[i], BigInt(index)])
          })

          let userLocks = await Promise.all(
            userLockCalls
          )



          userLocks.map((lock, index) => {

            tempPoolsSymbols[i].locks.push({
              lpToken: lockedTokens[i],
              lockDate: lock[0],
              amount: formatUnits((lock[1]), 18),
              initialAmount: lock[2],
              unlockDate: lock[3],
              lockID: lock[4],
              owner: lock[5],
              index: index
            })

          })
        }
      }
      tempPoolsSymbols.map(pool => {

        pools.push(pool)


      })
    }
  }

  for (let i = 0; i < lockerV2_2Contracts.length; i++) {


    let lockerContract_V2_1 = getContract({
      address: lockerV2_2Contracts[i] as `0x${string}`,
      client,
      abi: lockers_V2_1_Basic
    })

    let numberOfLockedTokens = await lockerContract_V2_1.read.getUserNumLockedTokens([params.wallet])


    if (numberOfLockedTokens > 0n) {


      let lockedTokensCalls = Array.from({ length: Number(numberOfLockedTokens) }, (_, index) => {
        return lockerContract_V2_1.read.getUserLockedTokenAtIndex([params.wallet, BigInt(index)])
      })

      const lockedTokens = await Promise.all(
        lockedTokensCalls,
      )



      let tokensCalls = lockedTokens.map((token, index) => {

        let poolContract = getContract({
          address: token,
          client,
          abi: poolV2basic
        })

        let token0_id = poolContract.read.token0()
        let token1_id = poolContract.read.token1()
        let total_supply = poolContract.read.totalSupply()


        return {
          token0: token0_id,
          token1: token1_id,
          total_supply: total_supply
        }
      })

      const tokenPromises: Promise<`0x${string}` | bigint>[] = tokensCalls.map(pair => [pair.token0, pair.token1, pair.total_supply]).flat();

      let result = await Promise.all(tokenPromises)

      const tokenPairs = [];

      for (let i = 0; i < result.length; i += 3) {
        tokenPairs.push({
          token0: result[i],
          token1: result[i + 1],
          total_supply: result[i + 2]
        });
      }

      // let tempPool: LPToken

      let tempPools: LPToken[] = tokenPairs.map((pair, index) => {

        return {
          locker_id: lockerV2_2Contracts[i],
          pool_id: lockedTokens[index],
          token0_id: pair.token0 as `0x${string}`,
          token1_id: pair.token1 as `0x${string}`,
          total_supply: formatUnits(pair.total_supply as bigint, 18),
          token0_symbol: '',
          token1_symbol: '',
          lock_number: 0,
          locks: []
        }
      })



      let poolSymbolCalls = symbolPopulatedPools(tempPools)

      const symbolPromises = poolSymbolCalls.map(pair => [pair.token0, pair.token1]).flat();

      let symbolResult = await Promise.all(symbolPromises)

      const symbolPairs: { symbol0: string, symbol1: string }[] = [];

      for (let i = 0; i < symbolResult.length; i += 2) {
        symbolPairs.push({
          symbol0: symbolResult[i],
          symbol1: symbolResult[i + 1]
        });
      }

      let tempPoolsSymbols: LPToken[] = tempPools.map((pool, index) => {

        let t = pool

        t.token0_symbol = symbolPairs[index].symbol0
        t.token1_symbol = symbolPairs[index].symbol1

        return t

      })


      for (let i = 0; i < lockedTokens.length; i++) {

        let numberOfLocksForToken = await lockerContract_V2_1.read.getUserNumLocksForToken([params.wallet, lockedTokens[i]])

        if (numberOfLocksForToken > 0n) {
          let userLockCalls = Array.from({ length: Number(numberOfLocksForToken) }, (_, index) => {
            return lockerContract_V2_1.read.getUserLockForTokenAtIndex([params.wallet, lockedTokens[i], BigInt(index)])
          })

          let userLocks = await Promise.all(
            userLockCalls
          )


          userLocks.map((lock, index) => {

            tempPoolsSymbols[i].locks.push({
              lpToken: lock.lpToken,
              lockDate: lock.lockDate,
              amount: formatUnits((lock.amount), 18),
              initialAmount: lock.initialAmount,
              unlockDate: lock.unlockDate,
              lockID: lock.lockID,
              owner: lock.owner,
              index: index
            })
          })
        }
      }

      tempPoolsSymbols.map(pool => {

        pools.push(pool)

      })
    }
  }


  let walletLocks = await getUserLocks(params.chainID, params.wallet)

  const locks = walletLocks.lockersV2_wallets[0].locks



  if (locks.length > 0) {

    // Filter to only get Aerodrome locks
    const aerodromeLocks = locks.filter((lock: any) =>
      lock.locker.lockerAddress.toLowerCase() === lockerAerodromeV2Contracts.toLowerCase()
    )

    if (aerodromeLocks.length > 0) {
      let tokensCalls = aerodromeLocks.map((lock: any, index: any) => {

        let poolContract = getContract({
          address: lock.pool.poolAddress,
          client,
          abi: poolV2basic
        })

        let token0_id = poolContract.read.token0()
        let token1_id = poolContract.read.token1()
        let total_supply = poolContract.read.totalSupply()

        return {
          token0: token0_id,
          token1: token1_id,
          total_supply: total_supply
        }
      })


      const tokenPromises: Promise<`0x${string}` | bigint>[] = tokensCalls.map((pair: any) => [pair.token0, pair.token1, pair.total_supply]).flat();

      let result = await Promise.all(tokenPromises)

      const tokenPairs = [];

      for (let i = 0; i < result.length; i += 3) {
        tokenPairs.push({
          token0: result[i],
          token1: result[i + 1],
          total_supply: result[i + 2]
        });
      }


      let tempPools: LPToken[] = tokenPairs.map((pair, index) => {

        return {
          locker_id: lockerAerodromeV2Contracts,
          pool_id: aerodromeLocks[index].pool.poolAddress,
          token0_id: pair.token0 as `0x${string}`,
          token1_id: pair.token1 as `0x${string}`,
          total_supply: formatUnits(pair.total_supply as bigint, 18),
          token0_symbol: '',
          token1_symbol: '',
          lock_number: 0,
          locks: []
        }
      })


      let poolSymbolCalls = symbolPopulatedPools(tempPools)

      const symbolPromises = poolSymbolCalls.map(pair => [pair.token0, pair.token1]).flat();

      let symbolResult = await Promise.all(symbolPromises)

      const symbolPairs: { symbol0: string, symbol1: string }[] = [];

      for (let i = 0; i < symbolResult.length; i += 2) {
        symbolPairs.push({
          symbol0: symbolResult[i],
          symbol1: symbolResult[i + 1]
        });
      }

      let tempPoolsSymbols: LPToken[] = tempPools.map((pool, index) => {

        let t = pool
        t.token0_symbol = symbolPairs[index].symbol0
        t.token1_symbol = symbolPairs[index].symbol1

        return t
      })


      for (let i = 0; i < aerodromeLocks.length; i++) {
        tempPoolsSymbols[i].locks.push({
          lpToken: aerodromeLocks[i].pool.poolAddress,
          lockDate: aerodromeLocks[i].lockDate,
          amount: formatUnits((aerodromeLocks[i].liquidity), 18),
          initialAmount: aerodromeLocks[i].liquidity,
          unlockDate: aerodromeLocks[i].unlockDate,
          lockID: aerodromeLocks[i].lockID,
          owner: aerodromeLocks[i].ownerAddress,
          index: i
        })
      }


      tempPoolsSymbols.map(pool => {
        pools.push(pool)
      })
    }
  }

  return pools

}














export default async function sitemap() {
  const baseUrl = "https://beta.uncx.network"


  // explore, token

  // explore page

  // get all tokens and map


  async function getBscTokenLocks() {
    const bsc_url = process.env['NODE_ENV'] == 'production' ? process.env['GRAPH_BSC_LOCKERSV3_NETWORK']! : process.env['GRAPH_BSC_LOCKERSV3_LOCAL']!

    const result = await fetch(bsc_url, {

      method: 'POST',
      // next: { revalidate: 1 },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
        {
          tokens {
            id
            lockedUSD
            symbol
            name
          }
        }
  `
      })
    })

    // error handle
    if (!result.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch poolTableSuspense data');
    }
    return result.json()
  }


  async function getEthTokenLocks() {
    const eth_url = process.env['NODE_ENV'] == 'production' ? process.env['GRAPH_ETH_LOCKERSV3_NETWORK']! : process.env['GRAPH_ETH_LOCKERSV3_LOCAL']!

    const result = await fetch(eth_url, {

      method: 'POST',
      // next: { revalidate: 1 },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
        
        {
          tokens {
            id
            lockedUSD
            symbol
            name
          }
        }
  `
      })
    })

    // error handle
    if (!result.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch poolTableSuspense data');
    }
    return result.json()
  }

  async function getArbTokenLocks() {
    const arb_url = process.env['NODE_ENV'] == 'production' ? process.env['GRAPH_ARB_LOCKERSV3_NETWORK']! : process.env['GRAPH_ARB_LOCKERSV3_LOCAL']!

    const result = await fetch(arb_url, {

      method: 'POST',
      // next: { revalidate: 1 },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
        
        {
          tokens {
            id
            lockedUSD
            symbol
            name
          }
        }
    `
      })
    })

    // error handle
    if (!result.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch poolTableSuspense data');
    }
    return result.json()
  }
  const arbTokenDataCall = getArbTokenLocks()
  const ethTokenDataCall = getEthTokenLocks()
  const bscTokenDataCall = getBscTokenLocks()

  const [arbTokenData, ethTokenData, bscTokenData] = await Promise.all([arbTokenDataCall, ethTokenDataCall, bscTokenDataCall])




  let multiChainLocksAll =
    ethTokenData.data.tokens.map((item: any, index: number) => ({ ...item, chainID: 1 }))
      .concat(bscTokenData.data.tokens.map((item: any, index: number) => ({ ...item, chainID: 56 })))
      .concat(arbTokenData.data.tokens.map((item: any, index: number) => ({ ...item, chainID: 42161 })))
  // .sort((a: any, b: any) => parseFloat(b.lockedCoreUSD) - parseFloat(a.lockedCoreUSD))



  let tokenMap = multiChainLocksAll.map((token: any) => {
    return {
      url: baseUrl.concat(`/lockers/univ3/explore/tokens/chain/${token.chainID}/address/${token.id}`),
      lastModified: new Date()
    }
  }) ?? []


  return [
    ...tokenMap,

    {
      url: baseUrl.concat('/grants/explore/latest'),
      lastModified: new Date()
    },
    {
      url: baseUrl,
      lastModified: new Date()
    }
  ]
}
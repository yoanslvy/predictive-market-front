
export const baseExploreUrl = '/vesting-v2/explore'

export type LockExploreType = {
  page: string | null;
  locks: string | null;
  filter: string | null;
  chain: string | null;
  view?: string;
  ts?: string;
  modal?: string
  chainFilter?: number;
};


export type GraphQLError = {
  message: string;
};

export type QueryResponse = {
  data?: {
    tokens: Token[];
  };
  errors?: GraphQLError[];
};

export type Token = {
  id: string;
  name: string;
  symbol: string;
  tvlUSD: string;
  lockedUSD: string;
  mainTokenReserves: MainTokenReserve[];
};

export type MainTokenReserve = {
  tvl?: string;
  nextUnlock?: string;
  lockedPercent?: string;
  chainID: string;
  locker: string;
  mainToken: string;
  baseToken: string;
  mainSymbol: string;
  baseSymbol: string;
  pool: {
    id: string;
    totalSupply: string;
  };
  locks: Lock[];
};

export type Lock = {
  lockedCoreUSD: string;
  lockID: string;
  amount0: string;
  amount1: string;
  coreTotalUSD: string;
  lockedPercent: string;
  liquidity: string;
  lockedAmount0: string;
  lockedAmount1: string;
  unlockDate: string;
  lockedPool: {
    pool: {
      totalSupply: string;
    };
  };
};

export type ChainTokenData = {
  id: string;
  name: string;
  symbol: string;
  tvlUSD: string;
  // locks: Lock[];
  lockedUSD: string;
  mainTokenReserves: MainTokenReserve[];
  chainID: string;
};

export type ChainTokenDataParsed = {
  [key: string]: {
    id: string;
    name: string;
    symbol: string;
    tvlUSD: string;
    lockedUSD: string;
    mainTokenReserves: MainTokenReserve[];
    chainID: string;
  };
};

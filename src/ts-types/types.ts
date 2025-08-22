export type Pool = {
  locker: string,
  lockedUSD: string,
  chain: string,
  id: string,
  lockedPercent: string,
  token0_id?: string,
  token1_id?: string,
  token0_symbol?: string,
  token1_symbol?: string,
  token0_name?: string,
  token1_name?: string,
  version: string,
  feeTier?: string
}

import { chainIdsSupported, ChainIdSupported } from './constants'

export const isChainIdSupported = (value: string | number): value is ChainIdSupported =>
  chainIdsSupported.includes(Number(value))

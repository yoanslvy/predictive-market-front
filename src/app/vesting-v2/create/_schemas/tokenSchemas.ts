import * as z from 'zod'

// Token schema for reuse across components
const TokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
})

// DexScreener API response schema
const DexScreenerPairSchema = z.array(
  z.object({
    chainId: z.string(),
    dexId: z.string(),
    url: z.string().url(),
    baseToken: TokenSchema,
    quoteToken: TokenSchema,
    priceNative: z.string(),
    priceUsd: z.string().optional(),
  })
)

export const tokenSchemas = {
  TokenSchema,
  DexScreenerPairSchema,
}
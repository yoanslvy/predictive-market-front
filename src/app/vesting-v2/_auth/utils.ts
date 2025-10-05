import { randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'
import * as z from 'zod'

import { Address, isAddress } from 'viem'

import { config } from '../../(providers)/wagmiConfig'
import { verifyTypedData } from '@wagmi/core'

export function createAccessToken(signer: string): string {
  return jwt.sign({ signer }, process.env.JWT_SECRET!, { expiresIn: '1h' })
}

export function createRefreshToken(): string {
  return randomBytes(40).toString('hex')
}

export const AuthBodySchema = z.object({
  wallet: z.string().refine((e) => isAddress(e)),
})

interface Domain {
  name: string
}

interface VerifyMessageSignatureParams {
  domain: Domain
  types: Record<string, Array<{ name: string; type: string }>>
  message: Record<string, unknown>
  signature: Address
  owner: Address
}

export const verifyMessageSignature = async ({
  domain,
  types,
  message,
  signature,
  owner,
}: VerifyMessageSignatureParams) => {
  try {
    return verifyTypedData(config, {
      domain,
      types,
      message,
      primaryType: 'Message',
      signature,
      address: owner,
    })
  } catch (error) {
    console.error('Error verifying signature:', error)
    return false
  }
}

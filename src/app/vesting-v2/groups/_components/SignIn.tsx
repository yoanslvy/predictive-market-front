'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import { useEffect, useRef } from 'react'

import { useAccount } from 'wagmi'

import { useRefresh } from '../../_hooks/useRefresh'
import { useSign } from '../../_hooks/useSign'

export function SignIn() {
  const { address } = useAccount()
  const { refresh, isPending } = useRefresh()
  const isSigningIn = useRef(false)
  const router = useRouter()
  const { signSignIn } = useSign()

  useEffect(() => {
    if (address && !isPending && !isSigningIn.current) {
      isSigningIn.current = true

      const signInProcess = async () => {
        try {
          const signature = await signSignIn({ wallet: address })
          const response = await fetch('/api/signin', {
            body: JSON.stringify({
              wallet: address,
              signature,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })
          if (!response.ok) {
            throw new Error('An error occurred')
          }
          await response.json()
          refresh()
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'An error occurred')
          router.push(`/vesting-v2/dashboard/fluxes?wallet=${address}`)
        } finally {
          isSigningIn.current = false
        }
      }

      void signInProcess()
    }
  }, [address, refresh, isPending, router, signSignIn])

  return (
    <div className="page-content flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <p className="text-center text-[24px] font-[500] text-[#F0F2FB]">Sign In</p>
      <p className="max-w-[360px] text-center text-[16px] font-[500] text-[#757A8B]">
        Open your wallet to sign in and access your groups. If you are already signed in, please
        refresh the page.
      </p>
    </div>
  )
}

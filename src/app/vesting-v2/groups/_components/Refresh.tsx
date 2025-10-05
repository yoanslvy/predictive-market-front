'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import { useEffect, useRef } from 'react'

import { useAccount } from 'wagmi'

import LogoSpinner from '@components/spinners/logoSpinnerAnimated'

import { useRefresh } from '../../_hooks/useRefresh'

export function Refresh() {
  const { address } = useAccount()
  const { refresh, isPending } = useRefresh()
  const isSigningIn = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (address && !isPending && !isSigningIn.current) {
      isSigningIn.current = true

      const signInProcess = async () => {
        try {
          const response = await fetch('/api/refresh', {
            body: JSON.stringify({
              wallet: address,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })
          if (!response.ok) {
            refresh()
          }
          await response.json()
          refresh()
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'An error occurred')
          router.push(`/vesting-v2/groups?wallet=${address}`)
        } finally {
          isSigningIn.current = false
        }
      }

      void signInProcess()
    }
  }, [address, refresh, isPending, router])

  return (
    <div className="page-content flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <div className="page-content flex h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="p-2 rounded-full h-44 w-44 bg-dark-base-999">
            <LogoSpinner />
          </div>
        </div>
      </div>
    </div>
  )
}

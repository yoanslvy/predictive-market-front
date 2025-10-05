'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function ClientWrapper({ children, href }: { children: React.ReactNode, href: string }) {
  const router = useRouter()

  const handleClick = useCallback(() => {
    router.back()
    // Wait for the modal to close before navigating
    setTimeout(() => {
      router.push(href)
    }, 100)
  }, [router, href])

  return (
    <div className="cursor-pointer" onClick={handleClick}>
      {children}
    </div>
  )
} 
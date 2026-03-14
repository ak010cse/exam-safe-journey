"use client"

import { ReactNode, useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { useUserStore } from '@/store/userStore'

export function Providers({ children }: { children: ReactNode }) {
  const hydrateUser = useUserStore((s) => s.hydrateUser)

  useEffect(() => {
    hydrateUser()
  }, [hydrateUser])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

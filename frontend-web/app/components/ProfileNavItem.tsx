"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

export default function ProfileNavItem({ icon, label }: { icon: string; label: string }) {
  const router = useRouter()

  function handleClick() {
    try {
      const u = localStorage.getItem('user')
      if (u) router.push('/profile')
      else router.push('/auth')
    } catch (e) {
      router.push('/auth')
    }
  }

  return (
    <button onClick={handleClick} className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-600">
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  )
}

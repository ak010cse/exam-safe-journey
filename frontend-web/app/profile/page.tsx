"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import Link from 'next/link'
import Button from '@/components/Button'
import { useUserStore } from '@/store/userStore'
import { STAY_OPTIONS } from '@/lib/stays'
import { TRAVEL_ROUTES } from '@/lib/travel'

function initials(name?: string) {
  if (!name) return 'U'
  return name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()
}

export default function ProfilePage() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const hydrated = useUserStore((state) => state.hydrated)
  const setUser = useUserStore((state) => state.setUser)
  const toggleSavedRoute = useUserStore((state) => state.toggleSavedRoute)
  const toggleSavedStay = useUserStore((state) => state.toggleSavedStay)

  useEffect(() => {
    if (!hydrated) return

    if (!user) {
      router.replace('/auth')
    }
  }, [hydrated, user, router])

  function logout() {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/auth')
  }

  if (!hydrated || !user) {
    return <div className="min-h-screen flex items-center justify-center p-4">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-start justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden mt-8">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
              {initials(user.name)}
            </div>
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email || user.phone || 'No contact information'}</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-sm text-gray-600">Account</div>
              <div className="mt-1 text-sm">
                Signed in via <span className="font-medium">{user.provider || 'local'}</span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="mt-1 font-medium">{user.email || '—'}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Mobile</div>
              <div className="mt-1 font-medium">{user.phone || '—'}</div>
            </div>

            {(user.savedRoutes?.length || 0) + (user.savedStays?.length || 0) > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">Saved</div>

                {user.savedRoutes && user.savedRoutes.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-medium text-gray-500">Saved travel routes</div>
                    <div className="mt-2 space-y-2">
                      {user.savedRoutes.map((routeId) => {
                        const route = TRAVEL_ROUTES.find((r) => r.id === routeId)
                        if (!route) return null
                        return (
                          <div key={routeId} className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg">
                            <Link href={`/travel/${route.id}`} className="text-sm text-blue-600 truncate">
                              {route.title}
                            </Link>
                            <button
                              className="text-xs text-gray-500 hover:text-red-600"
                              onClick={() => toggleSavedRoute(route.id)}
                            >
                              Remove
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {user.savedStays && user.savedStays.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs font-medium text-gray-500">Saved stays</div>
                    <div className="mt-2 space-y-2">
                      {user.savedStays.map((stayId) => {
                        const stay = STAY_OPTIONS.find((s) => s.id === stayId)
                        if (!stay) return null
                        return (
                          <div key={stayId} className="flex items-center justify-between gap-2 bg-gray-50 p-2 rounded-lg">
                            <Link href={`/stay/${stay.id}`} className="text-sm text-blue-600 truncate">
                              {stay.name}
                            </Link>
                            <button
                              className="text-xs text-gray-500 hover:text-red-600"
                              onClick={() => toggleSavedStay(stay.id)}
                            >
                              Remove
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => router.push('/')}>Back home</Button>
            <Button variant="ghost" className="flex-1" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from 'next/link'
import { useMemo } from 'react'

import { getTravelRouteById } from '@/lib/travel'
import { useUserStore } from '@/store/userStore'
import Button from '@/components/Button'

export default function TravelRoutePage({ params }: { params: { id: string } }) {
  const { id } = params
  const route = useMemo(() => getTravelRouteById(id), [id])

  const savedRoutes = useUserStore((s) => s.user?.savedRoutes ?? [])
  const toggleSavedRoute = useUserStore((s) => s.toggleSavedRoute)

  if (!route) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">Route not found</h2>
        <p className="text-sm text-gray-600 mt-2">We couldn't find a route for &quot;{id}&quot;.</p>
        <Link href="/travel" className="text-blue-600 mt-4 block">
          ← Back to travel options
        </Link>
      </div>
    )
  }

  const isSaved = savedRoutes.includes(route.id)

  return (
    <div className="p-4 pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{route.title}</h1>
          <p className="text-sm text-gray-500">
            {route.time} • {route.price}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isSaved ? 'secondary' : 'primary'}
            onClick={() => toggleSavedRoute(route.id)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Link href="/travel" className="px-4 py-2 bg-gray-100 text-sm rounded-lg text-gray-700 hover:bg-gray-200">
            Back
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-white border rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800">Why this route works</h2>
        <ul className="mt-3 list-disc list-inside text-sm text-gray-700 space-y-2">
          {route.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <div className="text-sm font-medium text-blue-900">Need directions?</div>
        <p className="text-sm text-blue-800 mt-1">
          Open this route in Google Maps for quick navigation.
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(route.title)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          Open in Maps
        </a>
      </div>
    </div>
  )
}

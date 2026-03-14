"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { TRAVEL_ROUTES } from '@/lib/travel'
import RouteCard from '@/components/RouteCard'

export default function TravelPage() {
  const modeOptions = ['all', 'train', 'bus', 'taxi'] as const
  type Mode = (typeof modeOptions)[number]

  const [mode, setMode] = useState<Mode>('all')

  const routes = useMemo(() => {
    if (mode === 'all') return TRAVEL_ROUTES
    return TRAVEL_ROUTES.filter((r) => r.mode === mode)
  }, [mode])

  return (
    <div className="pb-10">
      <div className="flex items-center gap-3 p-4">
        <h2 className="font-semibold text-gray-800">Travel Options</h2>
      </div>

      <div className="px-4">
        <Image src="/hero.png" alt="Travel" width={400} height={180} className="rounded-xl" />
      </div>

      <div className="mx-4 mt-6">
        <div className="flex flex-wrap gap-2">
          {modeOptions.map((value) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                mode === value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value === 'all' ? 'All' : value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-gray-800">Recommended Routes</h3>
          <p className="text-xs text-gray-500 mb-4">
            Fast, safe & reasonable options suggested by aspirants
          </p>

          {routes.map((route) => (
            <Link key={route.id} href={`/travel/${route.id}`} className="block">
              <RouteCard {...route} />
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-8 bg-orange-50 p-4 rounded-2xl">
        <h4 className="font-semibold text-gray-800 text-sm">Finding a train or bus hard?</h4>
        <p className="text-xs text-gray-600 mt-1">
          Experienced aspirants often travel together.
        </p>

        <button className="mt-3 w-full bg-orange-500 text-white py-2 rounded-xl text-sm">
          🤝 Find a Journey Partner
        </button>
      </div>
    </div>
  )
}

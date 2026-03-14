"use client"

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { getStayOptionById } from '@/lib/stays'
import { useUserStore } from '@/store/userStore'
import Button from '@/components/Button'

const EMPTY_ARRAY: string[] = []

export default function StayDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const stay = id ? getStayOptionById(id) : null

  const savedStays = useUserStore((s) => s.user?.savedStays ?? EMPTY_ARRAY)
  const toggleSavedStay = useUserStore((s) => s.toggleSavedStay)

  if (!stay) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">Stay not found</h2>
        <p className="text-sm text-gray-600 mt-2">We couldn't find a stay for &quot;{id}&quot;.</p>
        <Link href="/stay" className="text-blue-600 mt-4 block">
          ← Back to stays
        </Link>
      </div>
    )
  }

  const isSaved = savedStays.includes(stay.id)

  return (
    <div className="p-4 pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{stay.name}</h1>
          <p className="text-sm text-gray-500">
            {stay.location} • {stay.distance}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isSaved ? 'secondary' : 'primary'}
            onClick={() => toggleSavedStay(stay.id)}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
          <Link href="/stay" className="px-4 py-2 bg-gray-100 text-sm rounded-lg text-gray-700 hover:bg-gray-200">
            Back
          </Link>
        </div>
      </div>

      <div className="mt-6 bg-white border rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800">Details</h2>
        <div className="mt-3 space-y-2 text-sm text-gray-700">
          <div>
            <span className="font-medium">Price:</span> {stay.price}
          </div>
          <div>
            <span className="font-medium">Rating:</span> {stay.rating}
          </div>
          <div>
            <span className="font-medium">Stayed:</span> {stay.stayers} aspirants
          </div>
        </div>
      </div>

      <div className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4">
        <div className="text-sm font-medium text-green-900">Need directions?</div>
        <p className="text-sm text-green-800 mt-1">
          Open this stay location in Google Maps.
        </p>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stay.location)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
        >
          Open in Maps
        </a>
      </div>
    </div>
  )
}

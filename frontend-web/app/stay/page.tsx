"use client"

import Link from 'next/link'
import Image from 'next/image'

import HotelCard from '@/components/HotelCard'
import { STAY_OPTIONS } from '@/lib/stays'

export default function StayPage() {
  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <h2 className="font-semibold text-gray-800">Safe Stay Nearby</h2>
      </div>

      {/* Hero */}
      <div className="px-4">
        <Image
          src="/hero.png"
          alt="Safe Stay"
          width={400}
          height={180}
          className="rounded-xl"
        />
      </div>

      {/* Search */}
      <div className="mx-4 mt-6 space-y-3">
        <div className="bg-[#F7F9FC] border rounded-2xl p-3 text-sm">
          📍 Enter City or Near Exam Centre
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-2xl text-sm font-medium">
          Find Stays Nearby
        </button>
      </div>

      {/* Verified Section */}
      <div className="mx-4 mt-8 bg-green-50 p-4 rounded-2xl">
        <h3 className="font-semibold text-gray-800 text-sm">✅ Verified by Aspirants</h3>
        <p className="text-xs text-gray-600 mt-1">
          These stays are safe, affordable + close to exam centre
        </p>

        <div className="flex gap-3 mt-3 text-xs text-gray-700">
          <span>✔ Female safe</span>
          <span>✔ Aspirants stay often</span>
          <span>✔ Close to centre</span>
        </div>
      </div>

      {/* Suggested Hotels */}
      <div className="mx-4 mt-8">
        <h3 className="font-semibold text-gray-800 text-sm mb-4">
          Suggested locations in Patna
        </h3>

        {STAY_OPTIONS.map((stay) => (
          <Link key={stay.id} href={`/stay/${stay.id}`} className="block">
            <HotelCard {...stay} />
          </Link>
        ))}

        <div className="text-blue-600 text-xs mt-3 cursor-pointer">
          See {STAY_OPTIONS.length + 10}+ stays nearby →
        </div>
      </div>

      {/* Visiting Soon */}
      <div className="mx-4 mt-8 bg-orange-50 p-4 rounded-2xl">
        <h4 className="font-semibold text-gray-800 text-sm">Visiting soon?</h4>
        <p className="text-xs text-gray-600 mt-1">
          Connect with other aspirants to discuss safe places.
        </p>
      </div>
    </div>
  )
}

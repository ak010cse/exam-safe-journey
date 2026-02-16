"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function SearchPage() {
    const router = useRouter()
  return (
     <div className="pb-10">

      {/* Header with Back Button */}
      <div className="flex items-center gap-3 p-4">
<button
  onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
>
  ←
</button>
        <h2 className="font-semibold text-gray-800">
          Find Exam Centre
        </h2>
      </div>

      
      {/* Hero */}
      <div className="px-4">
        <Image
          src="/hero.png"
          alt="Exam Travel"
          width={400}
          height={200}
          className="rounded-xl"
        />
      </div>

      {/* Search Bar */}
      <div className="px-4">
        <div className="flex gap-2 bg-[#F7F9FC] border rounded-2xl p-3">
          <input
            type="text"
            placeholder="Enter Exam Centre Name or City"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button className="bg-blue-600 text-white px-4 py-1 rounded-xl text-sm">
            Search
          </button>
        </div>
      </div>

      {/* Exam Tips Section */}
      <div className="mx-4 mt-6 bg-green-50 p-4 rounded-2xl">
        <h3 className="font-semibold text-gray-800">
          🔒 Exam Tips Nearby
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Trusted aspirants visited this centre
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-700">
          <div>⚠ Gate opens at 7 AM, reach early</div>
          <div>🚕 Few autos in evening</div>
          <div>👮 Police present, area felt safe</div>
          <div>🕒 Road safe till 9 PM</div>
        </div>

        <div className="mt-3 text-blue-600 text-xs font-medium cursor-pointer">
          See 20+ more tips →
        </div>
      </div>

      {/* Map Preview */}
      <div className="mx-4 mt-6">
        <div className="relative">
          <Image
            src="/map-preview.png"
            alt="Map"
            width={400}
            height={200}
            className="rounded-2xl"
          />

          {/* Centre Card Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-md p-4">
            <h4 className="font-semibold text-gray-800">
              ABC Senior Secondary School
            </h4>
            <p className="text-xs text-gray-500">
              Rajendra Nagar, Patna
            </p>

            <div className="flex justify-between text-xs mt-2 text-gray-600">
              <span>🚗 15 mins by car</span>
              <span>🚶 25 mins walking</span>
            </div>

            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-xl text-sm">
              Get Directions
            </button>
          </div>
        </div>
      </div>

      {/* Contribute Section */}
      <div className="mx-4 mt-8 bg-orange-100 p-4 rounded-2xl text-center">
        <p className="text-sm text-gray-700">
          Have you visited an exam centre before?
        </p>
        <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm">
          ⭐ Contribute Your Tip
        </button>
      </div>

    </div>
  )
}

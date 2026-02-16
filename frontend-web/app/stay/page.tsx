"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"

export default function StayPage() {
  const router = useRouter()

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
        >
          ←
        </button>
        <h2 className="font-semibold text-gray-800">
          Safe Stay Nearby
        </h2>
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
        <h3 className="font-semibold text-gray-800 text-sm">
          ✅ Verified by Aspirants
        </h3>
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

        <HotelCard
          name="Hotel ABC Residency"
          location="Rajendra Nagar Road"
          distance="900 m from exam centre"
          price="₹800 /night"
          rating="4.4 (112)"
          stayed="10 aspirants stayed here"
        />

        <HotelCard
          name="Patna Comfort Inn"
          location="Near Patna Jn Station"
          distance="1.5 km from exam centre"
          price="₹750 /night"
          rating="4.2 (85)"
          stayed="8 aspirants stayed here"
        />

        <div className="text-blue-600 text-xs mt-3 cursor-pointer">
          See 15+ stays nearby →
        </div>
      </div>

      {/* Visiting Soon */}
      <div className="mx-4 mt-8 bg-orange-50 p-4 rounded-2xl">
        <h4 className="font-semibold text-gray-800 text-sm">
          Visiting soon?
        </h4>
        <p className="text-xs text-gray-600 mt-1">
          Connect with other aspirants to discuss safe places.
        </p>
      </div>

    </div>
  )
}

function HotelCard({
  name,
  location,
  distance,
  price,
  rating,
  stayed
}: {
  name: string
  location: string
  distance: string
  price: string
  rating: string
  stayed: string
}) {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm mb-4">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium text-sm text-gray-800">
            {name}
          </h4>
          <p className="text-xs text-gray-500">
            {location}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-red-500">
            {price}
          </p>
          <p className="text-xs text-gray-500">
            ⭐ {rating}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-2">
        📍 {distance}
      </p>

      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-gray-500">
          🛏 {stayed}
        </p>

        <button className="bg-blue-600 text-white px-3 py-1 rounded-xl text-xs">
          Get Directions
        </button>
      </div>
    </div>
  )
}

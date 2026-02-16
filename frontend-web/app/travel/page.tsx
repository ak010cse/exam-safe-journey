"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"

export default function TravelPage() {
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
          Travel Options
        </h2>
      </div>

      {/* Hero */}
      <div className="px-4">
        <Image
          src="/hero.png"
          alt="Travel"
          width={400}
          height={180}
          className="rounded-xl"
        />
      </div>

      {/* Location Inputs */}
      <div className="mx-4 mt-6 space-y-3">

        <div className="bg-[#F7F9FC] border rounded-2xl p-3 text-sm">
          📍 Current Location
        </div>

        <div className="bg-[#F7F9FC] border rounded-2xl p-3 text-sm">
          📍 Exam Centre
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-2xl text-sm font-medium">
          Show Travel Routes
        </button>
      </div>

      {/* Recommended Routes */}
      <div className="mx-4 mt-8">

        <h3 className="font-semibold text-gray-800">
          Recommended Routes
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Fast, safe & reasonable options suggested by aspirants
        </p>

        {/* Train Route */}
        <RouteCard
          icon="🚆"
          title="Train Jn to Rajendra Nagar Patna"
          time="10 mins"
          price="₹15"
          points={[
            "Direct train every 15 mins",
            "Get down at Rajendra Nagar"
          ]}
        />

        {/* Bus Route */}
        <RouteCard
          icon="🚌"
          title="Patna Jn Bus Stand to Rajendra Nagar"
          time="20 mins"
          price="₹20"
          points={[
            "Frequent buses from Patna Jn",
            "Small walk till centre"
          ]}
        />

        {/* Car Route */}
        <RouteCard
          icon="🚕"
          title="Car / Taxi"
          time="Most comfortable option"
          price="₹70 - 100"
          points={[
            "Book early, check rush hours"
          ]}
        />

      </div>

      {/* Journey Partner Section */}
      <div className="mx-4 mt-8 bg-orange-50 p-4 rounded-2xl">
        <h4 className="font-semibold text-gray-800 text-sm">
          Finding a train or bus hard?
        </h4>
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

function RouteCard({
  icon,
  title,
  time,
  price,
  points
}: {
  icon: string
  title: string
  time: string
  price: string
  points: string[]
}) {
  return (
    <div className="bg-white border rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="font-medium text-sm">
          {icon} {title}
        </div>
        <button className="text-xs text-blue-600">
          Share Route
        </button>
      </div>

      <div className="flex gap-3 text-xs text-gray-600 mt-2">
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg">
          {time}
        </span>
        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg">
          {price}
        </span>
      </div>

      <ul className="text-xs text-gray-600 mt-3 space-y-1">
        {points.map((point, index) => (
          <li key={index}>• {point}</li>
        ))}
      </ul>
    </div>
  )
}

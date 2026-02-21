"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function SearchPage() {
    const router = useRouter()
    const CENTRES = [
      { id: 1, name: 'ABC Senior Secondary School', address: 'Rajendra Nagar, Patna', city: 'Patna', car: '15 mins', walk: '25 mins', capacity: 1200, rating: 4.5, reviews: 120 },
      { id: 2, name: "St. Mary's College Grounds", address: 'Kankarbagh, Patna', city: 'Patna', car: '20 mins', walk: '35 mins', capacity: 900, rating: 4.2, reviews: 88 },
      { id: 3, name: 'City Public School Auditorium', address: 'Ashok Rajpath, Patna', city: 'Patna', car: '10 mins', walk: '20 mins', capacity: 1500, rating: 4.6, reviews: 200 },
      { id: 4, name: 'Regional Sports Complex', address: 'Patliputra, Patna', city: 'Patna', car: '30 mins', walk: '40 mins', capacity: 2000, rating: 4.0, reviews: 54 },
      { id: 5, name: 'Greenfield College Hall', address: 'Patna City', city: 'Patna', car: '12 mins', walk: '22 mins', capacity: 800, rating: 4.1, reviews: 33 },
      { id: 6, name: 'North District Exam Centre', address: 'North Gate, Patna', city: 'Patna', car: '18 mins', walk: '28 mins', capacity: 1000, rating: 4.3, reviews: 67 },
    ]

    const [query, setQuery] = useState('')
    const [results, setResults] = useState(CENTRES)

    function handleSearch() {
      const q = query.trim().toLowerCase()
      if (!q) { setResults(CENTRES); return }
      setResults(CENTRES.filter(c => (c.name + ' ' + c.address + ' ' + c.city).toLowerCase().includes(q)))
    }
  return (
     <div className="pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <h2 className="font-semibold text-gray-800">Find Exam Centre</h2>
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
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
            placeholder="Enter Exam Centre Name or City"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-1 rounded-xl text-sm">
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

      {/* Nearby Centres List (dummy data) */}
      <div className="mx-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Nearby Exam Centres</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map(c => (
            <div key={c.id} className="bg-white rounded-2xl p-4 border shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{c.name}</h4>
                  <p className="text-xs text-gray-500">{c.address}</p>
                  <div className="text-xs text-gray-600 mt-2">🚗 {c.car} • 🚶 {c.walk} • Capacity: {c.capacity}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">{c.rating} ★</div>
                  <div className="text-xs text-gray-500">({c.reviews} reviews)</div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm">Directions</button>
                <button className="w-28 bg-gray-100 text-gray-700 py-2 rounded-xl text-sm">Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews (dummy) */}
      <div className="mx-4 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Visitor Reviews</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border text-sm">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">Ritu Sharma</div>
                <div className="text-xs text-gray-500">Visited: ABC Senior Secondary School</div>
              </div>
              <div className="text-sm text-green-600">5 ★</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Clean campus, easy entry. Staff were helpful and directions were accurate.</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border text-sm">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">A. Verma</div>
                <div className="text-xs text-gray-500">Visited: St. Mary's College Grounds</div>
              </div>
              <div className="text-sm text-green-600">4 ★</div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Good location but parking was limited. Gate opens on time.</p>
          </div>
        </div>
      </div>

      {/* Contribute Section */}
      <div className="mx-4 mt-8 bg-orange-100 p-4 rounded-2xl text-center">
        <p className="text-sm text-gray-700">
          Have you visited an exam centre before? Share tips to help others.
        </p>
        <Link href="/search/contribute" className="mt-3 inline-block bg-orange-500 text-white px-4 py-2 rounded-xl text-sm">
          ⭐ Contribute Your Tip
        </Link>
      </div>

    </div>
  )
}

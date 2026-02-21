"use client"

import React, { useState } from 'react'
import Link from 'next/link'

const STATIONS = [
  { id: 1, name: 'Patna Junction', exit: 'North Exit', distanceKm: 1.2, notes: 'Main city station; autorickshaws available.' },
  { id: 2, name: 'Rajendra Nagar Terminal', exit: 'East Gate', distanceKm: 2.0, notes: 'Closer to many colleges.' },
  { id: 3, name: 'Kankarbagh Halt', exit: 'West Exit', distanceKm: 3.5, notes: 'Smaller station; limited autos.' },
  { id: 4, name: 'Patliputra Junction', exit: 'Platform 4', distanceKm: 4.0, notes: 'Good bus connections.' },
]

export default function StationsPage() {
  const [query, setQuery] = useState('')
  const [maxKm, setMaxKm] = useState<number | null>(null)

  const filtered = STATIONS.filter(s => {
    const matchesQuery = (s.name + ' ' + s.notes + ' ' + s.exit).toLowerCase().includes(query.trim().toLowerCase())
    const withinKm = maxKm == null ? true : s.distanceKm <= maxKm
    return matchesQuery && withinKm
  })

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Nearby Stations</h1>
      <p className="text-sm text-gray-600 mb-4">Find the nearest stations, exits and quick last-mile notes.</p>

      <div className="flex gap-2 mb-4">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search station or note" className="flex-1 px-3 py-2 border rounded-lg" />
        <select value={maxKm ?? ''} onChange={e => setMaxKm(e.target.value ? Number(e.target.value) : null)} className="px-3 py-2 border rounded-lg">
          <option value="">Any distance</option>
          <option value="2">Within 2 km</option>
          <option value="5">Within 5 km</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.id} className="bg-white border rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between">
              <div>
                <h4 className="font-semibold">{s.name}</h4>
                <p className="text-xs text-gray-500">Exit: {s.exit} • {s.distanceKm} km</p>
                <p className="text-sm text-gray-700 mt-2">{s.notes}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Link href="/travel" className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm">View Routes</Link>
                <button className="text-xs text-gray-600">Share</button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-sm text-gray-500">No stations match your search.</div>
        )}
      </div>
    </div>
  )
}

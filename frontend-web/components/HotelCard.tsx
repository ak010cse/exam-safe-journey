import React from 'react'

export interface HotelOption {
  id?: string
  name: string
  location: string
  distance: string
  price: string
  rating: string
  stayed?: string
  stayers?: number
}

export default function HotelCard({
  name,
  location,
  distance,
  price,
  rating,
  stayed,
  stayers,
}: HotelOption) {
  const stayedText =
    stayed ?? (typeof stayers === 'number' ? `${stayers} aspirants stayed here` : '')

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm mb-4">
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium text-sm text-gray-800">{name}</h4>
          <p className="text-xs text-gray-500">{location}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-red-500">{price}</p>
          <p className="text-xs text-gray-500">⭐ {rating}</p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-2">📍 {distance}</p>

      <div className="flex justify-between items-center mt-3">
        <p className="text-xs text-gray-500">🛏 {stayedText}</p>
        <button className="bg-blue-600 text-white px-3 py-1 rounded-xl text-xs">Get Directions</button>
      </div>
    </div>
  )
}

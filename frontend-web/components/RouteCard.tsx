import React from 'react'

export interface RouteOption {
  id?: string
  mode?: 'train' | 'bus' | 'taxi' | 'walk'
  icon?: string
  title: string
  time: string
  price: string
  points?: string[]
  highlights?: string[]
}

const MODE_ICON: Record<NonNullable<RouteOption['mode']>, string> = {
  train: '🚆',
  bus: '🚌',
  taxi: '🚕',
  walk: '🚶',
}

export default function RouteCard({
  mode,
  icon,
  title,
  time,
  price,
  points,
  highlights,
}: RouteOption) {
  const displayIcon = icon ?? (mode ? MODE_ICON[mode] : '🧭')
  const bullets = points ?? highlights ?? []

  return (
    <div className="bg-white border rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="font-medium text-sm">
          {displayIcon} {title}
        </div>
        <button className="text-xs text-blue-600">Share route</button>
      </div>

      <div className="flex gap-3 text-xs text-gray-600 mt-2">
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg">{time}</span>
        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg">{price}</span>
      </div>

      <ul className="text-xs text-gray-600 mt-3 space-y-1">
        {bullets.map((point, index) => (
          <li key={index}>• {point}</li>
        ))}
      </ul>
    </div>
  )
}

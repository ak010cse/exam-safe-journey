"use client"

import React, { useEffect, useState } from 'react'

const DEFAULT_ITEMS = [
  'Admit card',
  'Valid photo ID',
  'Stationery (pens, pencils)',
  'Calculator (if allowed)',
  'Medicines / first-aid',
  'Water bottle',
  'Face mask & sanitizer'
]

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const saved = localStorage.getItem('packingChecklist')
    if (saved) setChecked(JSON.parse(saved))
    else {
      const initial: Record<string, boolean> = {}
      DEFAULT_ITEMS.forEach(i => initial[i] = false)
      setChecked(initial)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('packingChecklist', JSON.stringify(checked))
  }, [checked])

  function toggle(item: string) {
    setChecked(prev => ({ ...prev, [item]: !prev[item] }))
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Packing Checklist</h1>
      <p className="text-sm text-gray-600 mb-4">Check items as you pack; your progress is saved in the browser.</p>

      <div className="space-y-3">
        {DEFAULT_ITEMS.map(item => (
          <label key={item} className="flex items-center gap-3 bg-white border rounded-2xl p-3">
            <input type="checkbox" checked={!!checked[item]} onChange={() => toggle(item)} className="w-4 h-4" />
            <span className={`${checked[item] ? 'line-through text-gray-500' : ''}`}>{item}</span>
          </label>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-500">Tip: Review this checklist a day before travel.</div>
    </div>
  )
}

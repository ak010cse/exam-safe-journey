"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ContributeTip() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [centre, setCentre] = useState('')
  const [tip, setTip] = useState('')
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // prefill centre if provided via query (not implemented yet)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newTip = {
      id: Date.now(),
      name: name || 'Anonymous',
      centre: centre || 'Unknown centre',
      tip,
      rating,
      createdAt: new Date().toISOString(),
    }

    try {
      const existing = JSON.parse(localStorage.getItem('contributedTips') || '[]')
      existing.unshift(newTip)
      localStorage.setItem('contributedTips', JSON.stringify(existing))
      setSubmitted(true)
      setTimeout(() => {
        router.push('/search')
      }, 1200)
    } catch (err) {
      console.error(err)
      alert('Failed to save tip locally.')
    }
  }

  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Contribute Your Tip</h1>
      <p className="text-sm text-gray-600 mb-4">Share helpful, safety-focused information about an exam centre you visited.</p>

      {submitted ? (
        <div className="p-4 bg-green-50 rounded-lg">Thanks — your tip was saved locally. Redirecting...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Your name (optional)</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" />
          </div>

          <div>
            <label className="text-sm font-medium">Exam Centre name</label>
            <input value={centre} onChange={(e) => setCentre(e.target.value)} placeholder="e.g., ABC Senior Secondary School" className="w-full mt-1 px-3 py-2 border rounded-lg" />
          </div>

          <div>
            <label className="text-sm font-medium">Your tip</label>
            <textarea value={tip} onChange={(e) => setTip(e.target.value)} rows={4} className="w-full mt-1 px-3 py-2 border rounded-lg" />
          </div>

          <div>
            <label className="text-sm font-medium">Rating</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border rounded-lg">
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Fair</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Unsafe</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-orange-500 text-white py-2 rounded-lg">Submit Tip</button>
            <button type="button" onClick={() => router.push('/search')} className="w-28 bg-gray-100 py-2 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="mt-6 text-sm text-gray-500">Note: This demo stores tips in your browser only (localStorage). For production, wire this to a backend API.</div>
    </div>
  )
}

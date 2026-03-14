"use client"

import { useEffect, useState } from 'react'
import { PRACTICE_TESTS } from '@/lib/practice'

export interface PracticeResult {
  testId: string
  score: number
  total: number
  percentage: number
  completedAt: string
}

export default function PracticeHistory() {
  const [history, setHistory] = useState<PracticeResult[]>([])

  useEffect(() => {
    const results: PracticeResult[] = []

    PRACTICE_TESTS.forEach((test) => {
      const raw = localStorage.getItem(`practice:${test.id}:results`)
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.testId) {
          results.push(parsed)
        }
      } catch {
        // ignore invalid
      }
    })

    results.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    setHistory(results)
  }, [])

  if (history.length === 0) {
    return (
      <div className="mt-10 bg-white border border-dashed border-gray-200 rounded-2xl p-6 text-center">
        <div className="text-sm text-gray-500">No practice history yet. Take a test to see your past attempts.</div>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-3">Practice History</h2>
      <div className="space-y-3">
        {history.map((entry) => {
          const test = PRACTICE_TESTS.find((t) => t.id === entry.testId)
          return (
            <div key={entry.testId + entry.completedAt} className="bg-white border rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-semibold text-gray-900">{test?.title ?? entry.testId}</div>
                  <div className="text-xs text-gray-500">{new Date(entry.completedAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{entry.score}/{entry.total}</div>
                  <div className="text-xs text-gray-500">{entry.percentage}%</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

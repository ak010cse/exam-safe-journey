"use client"

import Link from 'next/link'
import { PRACTICE_TESTS } from '@/lib/practice'
import PracticeHistory from '@/components/PracticeHistory'

export default function PracticePage() {
  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Practice Tests</h1>
      <p className="text-sm text-gray-600 mb-4">Sharpen your skills with timed mock tests and quick quizzes.</p>

      <div className="space-y-3">
        {PRACTICE_TESTS.map((t) => (
          <Link key={t.id} href={`/practice/${t.id}`} className="block">
            <div className="bg-white border rounded-2xl p-4 shadow-sm flex justify-between items-center hover:shadow-md transition">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-xs text-gray-500">{t.questions.length} questions • {t.durationMin} min</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Start</button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <PracticeHistory />
    </div>
  )
}

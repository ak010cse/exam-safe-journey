"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

export default function PracticeRunner({ test }: { test: any }) {
  const totalSeconds = useMemo(() => test.durationMin * 60, [test.durationMin])
  const [timeLeft, setTimeLeft] = useState<number>(totalSeconds)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setTimeLeft(totalSeconds)
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id)
          setSubmitted(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [totalSeconds])

  function select(optionIndex: number) {
    const qid = test.questions[current].id
    setAnswers(a => ({ ...a, [qid]: optionIndex }))
  }

  function next() {
    setCurrent(c => Math.min(c + 1, test.questions.length - 1))
  }
  function prev() {
    setCurrent(c => Math.max(c - 1, 0))
  }

  function submit() {
    setSubmitted(true)
  }

  if (submitted) {
    const score = test.questions.reduce((s: number, q: any) => {
      const sel = answers[q.id]
      return s + (sel === q.answerIndex ? 1 : 0)
    }, 0)

    return (
      <div className="mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="font-semibold">Results</h3>
          <p className="mt-2 text-sm">You scored <strong>{score}</strong> out of {test.questions.length}</p>
          <div className="mt-4">
            <Link href="/practice" className="text-blue-600">Back to tests</Link>
          </div>
        </div>
      </div>
    )
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  const q = test.questions[current]

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm">Question {current + 1} / {test.questions.length}</div>
        <div className="text-sm font-mono">{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <div className="font-medium">{q.text}</div>

        <div className="mt-3 space-y-2">
          {q.options.map((opt: string, idx: number) => {
            const selected = answers[q.id] === idx
            return (
              <button key={idx} onClick={() => select(idx)} className={`w-full text-left px-3 py-2 border rounded-lg ${selected ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full border text-sm">{String.fromCharCode(65 + idx)}</div>
                  <div>{opt}</div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex justify-between mt-4">
          <div className="flex gap-2">
            <button onClick={prev} className="px-3 py-2 bg-gray-100 rounded-lg">Prev</button>
            <button onClick={next} className="px-3 py-2 bg-gray-100 rounded-lg">Next</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrent(0)} className="px-3 py-2 bg-gray-50 rounded-lg text-sm">First</button>
            <button onClick={submit} className="px-3 py-2 bg-green-600 text-white rounded-lg">Submit</button>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

export default function PracticeRunner({ test }: { test: any }) {
  const totalSeconds = useMemo(() => test.durationMin * 60, [test.durationMin])
  const [timeLeft, setTimeLeft] = useState<number>(totalSeconds)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [submitted, setSubmitted] = useState(false)

  const storageKey = `practice:${test.id}:progress`

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed?.timeLeft != null) setTimeLeft(parsed.timeLeft)
        if (parsed?.answers) setAnswers(parsed.answers)
        if (parsed?.current != null) setCurrent(parsed.current)
      } catch {
        // ignore
      }
    }
  }, [storageKey])

  useEffect(() => {
    setTimeLeft(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          setSubmitted(true)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [])

  const lastSaveRef = React.useRef<number>(0)

  const saveProgress = () => {
    const payload = {
      timeLeft,
      current,
      answers,
      updatedAt: Date.now(),
    }

    localStorage.setItem(storageKey, JSON.stringify(payload))
    lastSaveRef.current = Date.now()
  }

  useEffect(() => {
    if (submitted) return
    saveProgress()
  }, [answers, current, submitted])

  useEffect(() => {
    if (submitted) return
    const now = Date.now()
    if (now - lastSaveRef.current < 2000) return
    saveProgress()
  }, [timeLeft, submitted])

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

  const score = useMemo(() => {
    return test.questions.reduce((s: number, q: any) => {
      const sel = answers[q.id]
      return s + (sel === q.answerIndex ? 1 : 0)
    }, 0)
  }, [answers, test.questions])

  const percentage = useMemo(() => {
    return Math.round((score / test.questions.length) * 100)
  }, [score, test.questions.length])

  useEffect(() => {
    if (!submitted) return

    const results = {
      testId: test.id,
      score,
      total: test.questions.length,
      percentage,
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem(`practice:${test.id}:results`, JSON.stringify(results))
  }, [submitted, score, percentage, test.id, test.questions.length])

  if (submitted) {
    return (
      <div className="mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="font-semibold">Results</h3>
          <p className="mt-2 text-sm">
            You scored <strong>{score}</strong> out of {test.questions.length} ({percentage}%)
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">Review the questions to see which you missed.</p>
            <button onClick={() => setSubmitted(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Review Answers
            </button>
            <Link href="/practice" className="text-blue-600 block">Back to tests</Link>
          </div>
        </div>
      </div>
    )
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  const q = test.questions[current]

  const progress = Math.round(((current + 1) / test.questions.length) * 100)

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div>Question {current + 1} / {test.questions.length}</div>
          <div className="font-mono">{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
        </div>
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

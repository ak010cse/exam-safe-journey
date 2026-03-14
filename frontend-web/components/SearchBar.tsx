"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  defaultValue?: string
  className?: string
}

export default function SearchBar({ placeholder = 'Search...', onSearch, defaultValue = '', className }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)

  function submit() {
    const q = query.trim()
    if (!q) return
    if (onSearch) {
      onSearch(q)
    } else {
      router.push(`/search?query=${encodeURIComponent(q)}`)
    }
  }

  return (
    <div className={clsx('flex gap-2 items-center', className)}>
      <div className="flex-1 relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="button"
          onClick={submit}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
          aria-label="Search"
        >
          🔍
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          if ('speechSynthesis' in window) {
            const recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition()
            recognition.lang = 'en-US'
            recognition.onresult = (event: any) => {
              const spoken = event.results?.[0]?.[0]?.transcript || ''
              setQuery(spoken)
              setTimeout(submit, 250)
            }
            recognition.start()
          }
        }}
        className="rounded-xl bg-blue-100 px-4 py-3 text-blue-600 hover:bg-blue-200"
        aria-label="Voice search"
      >
        🎤
      </button>
    </div>
  )
}

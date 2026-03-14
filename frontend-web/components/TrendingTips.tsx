import Link from 'next/link'
import React from 'react'

export interface TrendingTip {
  href: string
  icon: string
  title: string
  text: string
}

export default function TrendingTips({ tips }: { tips: TrendingTip[] }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200">
      <h3 className="font-bold text-lg text-gray-900 mb-4">Trending Tips</h3>
      <div className="space-y-3">
        {tips.map((tip) => (
          <Link
            key={tip.href}
            href={tip.href}
            className="block rounded-xl border border-gray-100 bg-white p-3 hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{tip.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{tip.title}</div>
                <div className="text-sm text-gray-600">{tip.text}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

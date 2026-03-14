import Link from 'next/link'
import React from 'react'
import clsx from 'clsx'

interface ActionCardProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  href: string
  color?: string
}

export default function ActionCard({ icon, title, subtitle, href, color }: ActionCardProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'group block rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition',
        color ?? 'bg-white'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <div className="font-semibold text-gray-900 group-hover:text-blue-700">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
        </div>
      </div>
    </Link>
  )
}

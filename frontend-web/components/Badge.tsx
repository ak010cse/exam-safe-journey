import React from 'react'
import clsx from 'clsx'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error'

const badgeClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
}

export default function Badge({
  variant = 'default',
  className,
  children,
}: {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

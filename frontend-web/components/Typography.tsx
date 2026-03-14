import React from 'react'
import clsx from 'clsx'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface HeadingProps {
  level?: HeadingLevel
  className?: string
  children: React.ReactNode
}

export function Heading({ level = 1, className, children }: HeadingProps) {
  const Tag = `h${level}` as React.ElementType
  const defaultClasses = {
    1: 'text-3xl font-bold',
    2: 'text-2xl font-semibold',
    3: 'text-xl font-semibold',
    4: 'text-lg font-semibold',
    5: 'text-base font-semibold',
    6: 'text-base font-medium',
  }

  return (
    <Tag className={clsx(defaultClasses[level], className)}>
      {children}
    </Tag>
  )
}

export function Text({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={clsx('text-base text-gray-700', className)}>{children}</p>
}

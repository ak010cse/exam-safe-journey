import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="block text-sm">
      {label ? <span className="font-medium text-gray-700 mb-1 block">{label}</span> : null}
      <input
        className={clsx(
          'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
          className
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </label>
  )
}

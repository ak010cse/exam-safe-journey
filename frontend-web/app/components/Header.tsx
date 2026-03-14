"use client"

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/travel', label: 'Travel' },
  { href: '/stay', label: 'Stay' },
  { href: '/qa', label: 'Community' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-12">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Examtur
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold ${
                pathname === link.href ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/profile"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Profile
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 hover:bg-gray-50"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle menu</span>
          <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen ? (
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold ${
                  pathname === link.href ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/profile"
              className="block rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              Profile
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  )
}

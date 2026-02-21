"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [usePhone, setUsePhone] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')

  function saveUser(provider = 'local') {
    const user = { name: name || (email || phone) || 'User', email: email || null, phone: phone || null, provider }
    localStorage.setItem('user', JSON.stringify(user))
    router.push('/profile')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
              <p className="text-sm text-gray-500">Sign in with email, mobile, or continue with Google (demo)</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">EX</div>
          </div>

          <div className="flex gap-2 mb-4">
            <button onClick={() => setMode('login')} className={`flex-1 py-2 rounded-lg ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Login</button>
            <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded-lg ${mode === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Register</button>
          </div>

          {mode === 'register' && (
            <div className="mb-3">
              <label className="text-sm text-gray-600">Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="Your name" />
            </div>
          )}

          <div className="mb-3">
            <label className="text-sm text-gray-600">Sign in method</label>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setUsePhone(false)} className={`flex-1 py-2 rounded-lg ${!usePhone ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Email</button>
              <button onClick={() => setUsePhone(true)} className={`flex-1 py-2 rounded-lg ${usePhone ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Mobile</button>
            </div>
          </div>

          {!usePhone ? (
            <div className="mb-3">
              <label className="text-sm text-gray-600">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="you@example.com" />
            </div>
          ) : (
            <div className="mb-3">
              <label className="text-sm text-gray-600">Mobile number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" placeholder="+91 98765 43210" />
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3">
            <button onClick={() => saveUser('local')} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">Continue</button>
            <button onClick={() => saveUser('google')} className="w-full flex items-center justify-center gap-2 border rounded-lg px-4 py-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.35 11.1H12v2.8h5.35C16.95 16 14.8 17.6 12 17.6c-4 0-7.3-3.2-7.3-7.1S8 3.4 12 3.4c1.9 0 3.45.7 4.6 1.9l1.7-1.7C17.85 2.1 15.1 1 12 1 6.48 1 2 5.48 2 11s4.48 10 10 10c5.5 0 9.95-4.03 9.95-9.7 0-.65-.05-1.15-.6-2.2z" fill="#EA4335"/></svg>
              Sign in with Google
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">This demo stores a simple user object in localStorage and does not perform real authentication.</div>
        </div>
      </div>
    </div>
  )
}

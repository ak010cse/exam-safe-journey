"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function initials(name?: string) {
  if (!name) return 'U'
  return name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()
}

export default function ProfilePage(){
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('user')
      if(!raw){
        router.replace('/auth')
        return
      }
      setUser(JSON.parse(raw))
    }catch(e){
      router.replace('/auth')
    }
  },[])

  function logout(){
    localStorage.removeItem('user')
    router.push('/auth')
  }

  if(!user) return <div className="min-h-screen flex items-center justify-center p-4">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-start justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden mt-8">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold">{initials(user.name)}</div>
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email || user.phone || 'No contact information'}</div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="text-sm text-gray-600">Account</div>
              <div className="mt-1 text-sm">Signed in via <span className="font-medium">{user.provider || 'local'}</span></div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="mt-1 font-medium">{user.email || '—'}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Mobile</div>
              <div className="mt-1 font-medium">{user.phone || '—'}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => router.push('/')} className="flex-1 border px-4 py-2 rounded-lg">Back home</button>
            <button onClick={logout} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
          </div>
        </div>
      </div>
    </div>
  )
}

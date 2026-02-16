"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"

export default function ShareTipsPage() {
  const router = useRouter()
  const [tip, setTip] = useState("")

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
        >
          ←
        </button>
        <h2 className="font-semibold text-gray-800">
          Share Your Tips ⭐
        </h2>
      </div>

      {/* Hero */}
      <div className="px-4">
        <Image
          src="/hero.png"
          alt="Share Tips"
          width={400}
          height={180}
          className="rounded-xl"
        />
      </div>

      {/* Visit Details */}
      <div className="mx-4 mt-6 space-y-4">

        <div className="bg-[#F7F9FC] border rounded-2xl p-3 text-sm flex justify-between">
          <span>📍 Visit Type</span>
          <span>›</span>
        </div>

        <div className="bg-[#F7F9FC] border rounded-2xl p-3 text-sm flex justify-between">
          <span>🎒 Purpose</span>
          <span>›</span>
        </div>

        <div className="bg-[#F7F9FC] border rounded-2xl p-3">
          <textarea
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            placeholder="Gate timing, safe route, nearest hotel..."
            maxLength={500}
            className="w-full bg-transparent outline-none text-sm resize-none"
            rows={4}
          />
          <div className="text-xs text-gray-500 mt-2">
            {tip.length}/500
          </div>
        </div>

      </div>

      {/* Wise Tips Info */}
      <div className="mx-4 mt-8 bg-green-50 p-4 rounded-2xl">
        <h3 className="font-semibold text-gray-800 text-sm">
          ⭐ Wise Tips Get Stars
        </h3>
        <ul className="text-xs text-gray-600 mt-2 space-y-1">
          <li>• Useful tips earn stars</li>
          <li>• Starred tips rise up</li>
          <li>• Higher level = More credible</li>
        </ul>
      </div>

      {/* Trending Tip */}
      <div className="mx-4 mt-8 bg-white border rounded-2xl p-4 shadow-sm">
        <h4 className="font-medium text-sm text-gray-800">
          IIT JEE - How to reach Patna Junction from Delhi?
        </h4>

        <div className="flex justify-between text-xs text-gray-500 mt-3">
          <span>👥 8 replies from level-3 helpers</span>
          <span>✔ Verified</span>
        </div>

        <button className="mt-3 text-blue-600 text-xs">
          Reply
        </button>
      </div>

      {/* Safety Rules */}
      <div className="mx-4 mt-8 bg-green-50 p-4 rounded-2xl">
        <h3 className="font-semibold text-gray-800 text-sm">
          ✅ Essential Safety Rules
        </h3>
        <ul className="text-xs text-gray-600 mt-2 space-y-1">
          <li>✔ No personal phone numbers</li>
          <li>✔ No unsafe meetups</li>
          <li>✔ Moderation by our team</li>
        </ul>
      </div>

    </div>
  )
}

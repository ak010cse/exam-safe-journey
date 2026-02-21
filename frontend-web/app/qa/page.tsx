"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

export default function QAPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("trending")

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <h2 className="font-semibold text-gray-800">Talk to Aspirants</h2>
      </div>

      {/* Hero */}
      <div className="px-4">
        <Image
          src="/hero.png"
          alt="Talk to Aspirants"
          width={400}
          height={180}
          className="rounded-xl"
        />
      </div>

      {/* Ask Question */}
      <div className="mx-4 mt-6 space-y-3">

        <div className="flex bg-[#F7F9FC] border rounded-2xl p-3 text-sm gap-2">
          <input
            type="text"
            placeholder="Ask an exam-related question..."
            className="flex-1 bg-transparent outline-none"
          />
          <button className="bg-blue-600 text-white px-4 rounded-xl text-sm">
            Ask
          </button>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-2xl text-sm">
          Find Stays Nearby
        </button>

      </div>

      {/* Verified Section */}
      <div className="mx-4 mt-6 bg-green-50 p-4 rounded-2xl">
        <h3 className="font-semibold text-gray-800 text-sm">
          ✅ Verified by trusted candidates
        </h3>
        <p className="text-xs text-gray-600 mt-1">
          Exam advice should reduce stress. Misuse leads to ban.
        </p>
      </div>

      {/* Tabs */}
      <div className="mx-4 mt-6 flex border-b text-sm">
        <button
          onClick={() => setActiveTab("trending")}
          className={`flex-1 pb-2 ${
            activeTab === "trending"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Trending Questions
        </button>

        <button
          onClick={() => setActiveTab("recent")}
          className={`flex-1 pb-2 ${
            activeTab === "recent"
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          Recent Questions
        </button>
      </div>

      {/* Question Cards */}
      <div className="mx-4 mt-6 space-y-4">

        <QuestionCard
          title="IIT JEE - How to reach Patna Junction from Delhi?"
          replies="8 replies from level-3 helpers"
          trust="Trust score: 86"
        />

        <QuestionCard
          title="IIT JEE - Budget hotel near RPS Morh?"
          replies="5 replies from level-3 helpers"
          trust="Trust score: 72"
        />

        <div className="text-blue-600 text-xs cursor-pointer">
          See 15+ stays nearby →
        </div>

      </div>

      {/* Share Tips Section */}
      <div className="mx-4 mt-8 bg-orange-100 p-4 rounded-2xl flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">
            Appeared in exams before?
          </h4>
          <p className="text-xs text-gray-600">
            Give guidance and reduce panic.
          </p>
        </div>

       <Link href="/share-tips">
  <button className="bg-orange-500 text-white px-3 py-2 rounded-xl text-xs">
    ⭐ Share Your Tips
  </button>
</Link>
      </div>

    </div>
  )
}

function QuestionCard({
  title,
  replies,
  trust
}: {
  title: string
  replies: string
  trust: string
}) {
  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm">
      <h4 className="font-medium text-sm text-gray-800">
        {title}
      </h4>

      <div className="flex justify-between text-xs text-gray-500 mt-3">
        <span>👥 {replies}</span>
        <span>✔ {trust}</span>
      </div>

      <button className="mt-3 text-blue-600 text-xs">
        Reply
      </button>
    </div>
  )
}

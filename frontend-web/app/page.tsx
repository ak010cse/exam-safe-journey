import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center space-y-6">
      
      <h1 className="text-2xl font-bold text-blue-600">
        Exam in few days?
      </h1>

      <p className="text-gray-600">
        Don’t worry. We’ll help you reach safely.
      </p>

      <div className="w-full max-w-sm space-y-4">
        <Link href="/search">
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
            Find My Exam Centre
          </button>
        </Link>

        <Link href="/travel">
          <button className="w-full bg-green-600 text-white py-3 rounded-xl">
            How to Reach
          </button>
        </Link>

        <Link href="/stay">
          <button className="w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-xl">
            Stay Near Centre
          </button>
        </Link>

        <Link href="/qa">
          <button className="w-full bg-white border border-green-600 text-green-600 py-3 rounded-xl">
            Talk to Aspirants
          </button>
        </Link>
      </div>

      <p className="text-xs text-gray-500">
        🔒 No spam. No phone number sharing. Safety first.
      </p>
    </div>
  )
}

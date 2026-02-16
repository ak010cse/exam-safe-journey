import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="pb-6 bg-gradient-to-b from-blue-50 to-white">

      {/* Hero */}
      <div className="p-4 pb-2">
        <Image
          src="/hero.png"
          alt="Exam Travel"
          width={400}
          height={220}
          className="rounded-2xl shadow-lg"
        />
      </div>

      {/* Welcome Section */}
      <div className="px-4 mt-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Your Exam Journey Starts Here
        </h1>
        <p className="text-gray-600">
          Find your exam center, plan routes, book stays & connect with peers
        </p>
      </div>

      {/* Action Cards */}
      <div className="px-4 space-y-3">

        <ActionCard
          icon="🔍"
          title="Find Exam Centre"
          subtitle="Location, nearby station & area info"
          href="/search"
          color="from-blue-500 to-blue-600"
        />

        <ActionCard
          icon="🚆"
          title="Travel Options"
          subtitle="Fastest & cheapest routes"
          href="/travel"
          color="from-orange-500 to-orange-600"
        />

        <ActionCard
          icon="🏨"
          title="Safe Stay Nearby"
          subtitle="Budget hotels & hostels"
          href="/stay"
          color="from-purple-500 to-purple-600"
        />

        <ActionCard
          icon="💬"
          title="Talk to Aspirants"
          subtitle="Get guidance from experienced candidates"
          href="/qa"
          color="from-emerald-500 to-emerald-600"
        />

      </div>

      {/* Safety Footer */}
      <div className="mx-4 mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 flex gap-3 items-start text-sm">
        <span className="text-green-600 text-lg flex-shrink-0">🔒</span>
        <div>
          <p className="font-semibold text-gray-900 mb-1">Your safety comes first</p>
          <p className="text-gray-600">
            All chats are monitored and auto-expire after exams.
          </p>
        </div>
      </div>

    </div>
  )
}

function ActionCard({
  icon,
  title,
  subtitle,
  href,
  color
}: {
  icon: string
  title: string
  subtitle: string
  href: string
  color: string
}) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gray-300 active:scale-95">
        <div className="flex items-start gap-4">
          <div className={`bg-gradient-to-br ${color} text-white rounded-xl p-3 text-2xl group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          </div>
          <span className="text-gray-400 text-xl group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
  )
}

import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="pb-6">

      {/* Hero */}
      <div className="p-4">
        <Image
          src="/hero.png"
          alt="Exam Travel"
          width={400}
          height={220}
          className="rounded-xl"
        />
      </div>

      {/* Action Cards */}
      <div className="px-4 space-y-4">

        <ActionCard
          title="Find Exam Centre"
          subtitle="Location, nearby station & area info"
          href="/search"
        />

        <ActionCard
          title="Travel Options"
          subtitle="Fastest & cheapest routes"
          href="/travel"
        />

        <ActionCard
          title="Safe Stay Nearby"
          subtitle="Budget hotels & hostels"
          href="/stay"
        />

        <ActionCard
          title="Talk to Aspirants"
          subtitle="Get guidance from experienced candidates"
          href="/qa"
        />

      </div>

      {/* Safety Footer */}
      <div className="mx-4 mt-6 p-4 bg-green-50 rounded-2xl flex gap-3 items-start text-sm text-gray-700">
        <span className="text-green-600 text-lg">🔒</span>
        <p>
          Your safety matters. Chats are monitored and auto-expire after exams.
        </p>
      </div>

    </div>
  )
}

function ActionCard({
  title,
  subtitle,
  href
}: {
  title: string
  subtitle: string
  href: string
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-[#F7F9FC] border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-800 text-base">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {subtitle}
        </p>
      </div>
    </Link>
  )
}

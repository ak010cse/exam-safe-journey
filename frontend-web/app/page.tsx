import Image from "next/image"
import Link from "next/link"

import ActionCard from '@/components/ActionCard'
import SearchBar from '@/components/SearchBar'
import TrendingTips from '@/components/TrendingTips'
import type { TrendingTip } from '@/components/TrendingTips'

const trendingTips: TrendingTip[] = [
  { href: '/trending/exam-in-45-days', icon: '⏰', title: 'Exam in 45 days?', text: 'Start planning now for best accommodations' },
  { href: '/trending/travel-smart', icon: '🚗', title: 'Travel Smart', text: 'Book transport 2 weeks in advance for savings' },
  { href: '/trending/budget-stays', icon: '🏨', title: 'Budget Stays', text: 'Quality hostels near exam centers' },
  { href: '/trending/station-guide', icon: '🧭', title: 'Station Guide', text: 'Nearest stations and last-mile options' },
  { href: '/trending/save-on-travel', icon: '💳', title: 'Save on Travel', text: 'Use student discounts on buses and trains' },
  { href: '/trending/health-tips', icon: '🧴', title: 'Health Tips', text: 'Carry hand sanitizer and water bottle' },
]

export default function Home() {
  return (
    <div className="pb-24 md:pb-16 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-12 py-6 md:py-10">

        {/* Desktop sidebar */}
        <aside className="hidden md:block md:col-span-1">
          <TrendingTips tips={trendingTips} />
        </aside>

        {/* Main content */}
        <main className="md:col-span-3">
          <section className="mb-10">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/hero.png"
                alt="Exam Travel"
                width={1200}
                height={480}
                priority
                className="w-full h-56 md:h-96 object-cover"
              />
            </div>

            <div className="mt-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Your exam journey starts here
              </h1>
              <p className="text-gray-600 text-base md:text-lg mb-6">
                Find your exam center, plan routes, book stays & connect with peers.
              </p>

              <SearchBar placeholder="Search exam center or city..." />
            </div>
          </section>

          <section className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
            <ActionCard
              icon="🔍"
              title="Find exam centre"
              subtitle="Location, nearby station & area info"
              href="/search"
            />
            <ActionCard
              icon="🚆"
              title="Travel options"
              subtitle="Fastest & cheapest routes"
              href="/travel"
            />
            <ActionCard
              icon="🏨"
              title="Safe stay nearby"
              subtitle="Budget hotels & hostels"
              href="/stay"
            />
            <ActionCard
              icon="💬"
              title="Talk to aspirants"
              subtitle="Get guidance from experienced candidates"
              href="/qa"
            />
            <ActionCard
              icon="🧭"
              title="Nearby stations"
              subtitle="Station maps, timings & exit info"
              href="/search/stations"
            />
            <ActionCard
              icon="📝"
              title="Practice tests"
              subtitle="Mock tests and previous year papers"
              href="/practice"
            />
            <ActionCard
              icon="📦"
              title="Packing checklist"
              subtitle="Essentials: IDs, stationery, medicines"
              href="/checklist"
            />
            <ActionCard
              icon="❤️"
              title="Health & safety"
              subtitle="On-exam-day health tips & emergency contacts"
              href="/health"
            />
          </section>
        </main>
      </div>
    </div>
  )
}

function NavItem({ icon, label, href, active }: { icon: string; label: string; href: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${active ? 'text-blue-600' : 'text-gray-600'}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
    </Link>
  )
}

function TrendingTip({ icon, title, text, href }: { icon: string; title: string; text: string; href?: string }) {
  if (href) {
    return (
      <Link href={href} className="block">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition">
          <div className="flex gap-2 items-start">
            <span className="text-lg flex-shrink-0">{icon}</span>
            <div>
              <p className="font-semibold text-sm text-gray-900">{title}</p>
              <p className="text-xs text-gray-600 mt-1">{text}</p>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
      <div className="flex gap-2 items-start">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <div>
          <p className="font-semibold text-sm text-gray-900">{title}</p>
          <p className="text-xs text-gray-600 mt-1">{text}</p>
        </div>
      </div>
    </div>
  )
}

function SuggestedExam({ exam, students }: { exam: string; students: string }) {
  const slug = exam.toLowerCase().replace(/\s+/g, '-')
  return (
    <Link href={`/exam/${slug}`} className="block">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 text-center hover:shadow-lg transition">
        <p className="font-bold text-lg text-gray-900">{exam}</p>
        <p className="text-sm text-gray-600 mt-1">{students} aspirants</p>
      </div>
    </Link>
  )
}

import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="pb-24 md:pb-6 bg-gradient-to-b from-blue-50 to-white min-h-screen">

      {/* Desktop Top Navigation - full-bleed fixed */}
      <nav className="hidden md:block fixed inset-x-0 top-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-12 h-16 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">ExamSafe</div>
          <div className="flex gap-6 items-center">
            <div className="relative group inline-block">
              <button className="inline-flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600 h-8">Exams ▾</button>
              <div className="hidden group-hover:block absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <a href="#" className="block px-4 py-2 hover:bg-blue-50">NEET</a>
                <a href="#" className="block px-4 py-2 hover:bg-blue-50">JEE</a>
                <a href="#" className="block px-4 py-2 hover:bg-blue-50">GATE</a>
              </div>
            </div>
            <a href="/search" className="font-semibold text-gray-700 hover:text-blue-600">Search</a>
            <a href="/travel" className="font-semibold text-gray-700 hover:text-blue-600">Travel</a>
            <a href="/stay" className="font-semibold text-gray-700 hover:text-blue-600">Stay</a>
          </div>
        </div>
      </nav>

      {/* Mobile/Desktop Content Container - full width grid (add top padding for fixed header) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-12 py-6 pt-20 md:pt-20">

        {/* Desktop Sidebar - Trending Tips (col 1). Sidebar on desktop only */}
        <aside className="hidden md:block md:col-span-1">
          <div className="md:sticky md:top-24 bg-white rounded-2xl p-4 border border-gray-200 w-full">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Trending Tips</h3>
            <div className="space-y-3">
              <TrendingTip href="/trending/exam-in-45-days" icon="⏰" title="Exam in 45 days?" text="Start planning now for best accommodations" />
              <TrendingTip href="/trending/travel-smart" icon="🚗" title="Travel Smart" text="Book transport 2 weeks in advance for savings" />
              <TrendingTip href="/trending/budget-stays" icon="🏨" title="Budget Stays" text="Quality hostels near exam centers" />
              <TrendingTip href="/trending/station-guide" icon="🧭" title="Station Guide" text="Nearest stations and last-mile options" />
              <TrendingTip href="/trending/save-on-travel" icon="💳" title="Save on Travel" text="Use student discounts on buses and trains" />
              <TrendingTip href="/trending/health-tips" icon="🧴" title="Health Tips" text="Carry hand sanitizer and water bottle" />
            </div>
          </div>
        </aside>

        {/* Main Content (spans 3 cols on desktop). On mobile show before trending tips */}
        <main className="md:col-span-3 w-full order-1 md:order-2">

          {/* Hero */}
          <div className="mb-6 md:mb-8">
              <Image
                src="/hero.png"
                alt="Exam Travel"
                width={1200}
                height={480}
                priority
                className="rounded-2xl shadow-lg w-full h-48 md:h-80 lg:h-96 object-cover"
              />
          </div>

          {/* Welcome Section */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
              Your Exam Journey Starts Here
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-6">
              Find your exam center, plan routes, book stays & connect with peers
            </p>
            
            {/* Search Bar with Voice Search */}
            <div className="flex gap-2 md:gap-3">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Search exam center or city..." 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600">🔍</button>
              </div>
              <button className="px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition">🎤</button>
            </div>
          </div>

          {/* Action Cards - Mobile-First Grid */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 mb-8 md:mb-12">

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

            <ActionCard
              icon="🧭"
              title="Nearby Stations"
              subtitle="Station maps, timings & exit info"
              href="/search/stations"
              color="from-indigo-500 to-indigo-600"
            />

            <ActionCard
              icon="📝"
              title="Practice Tests"
              subtitle="Mock tests and previous year papers"
              href="/practice"
              color="from-rose-500 to-rose-600"
            />

            <ActionCard
              icon="📦"
              title="Packing Checklist"
              subtitle="Essentials: IDs, stationery, medicines"
              href="/checklist"
              color="from-yellow-400 to-yellow-500"
            />

            <ActionCard
              icon="❤️"
              title="Health & Safety"
              subtitle="On-exam-day health tips & emergency contacts"
              href="/health"
              color="from-emerald-400 to-emerald-600"
            />

          </div>

          {/* Mobile Trending Tips - shown below action cards on small screens */}
          <div className="block md:hidden mt-6">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 w-full">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Trending Tips</h3>
              <div className="space-y-3">
                <TrendingTip href="/trending/exam-in-45-days" icon="⏰" title="Exam in 45 days?" text="Start planning now for best accommodations" />
                <TrendingTip href="/trending/travel-smart" icon="🚗" title="Travel Smart" text="Book transport 2 weeks in advance for savings" />
                <TrendingTip href="/trending/budget-stays" icon="🏨" title="Budget Stays" text="Quality hostels near exam centers" />
                <TrendingTip href="/trending/station-guide" icon="🧭" title="Station Guide" text="Nearest stations and last-mile options" />
                <TrendingTip href="/trending/save-on-travel" icon="💳" title="Save on Travel" text="Use student discounts on buses and trains" />
                <TrendingTip href="/trending/health-tips" icon="🧴" title="Health Tips" text="Carry hand sanitizer and water bottle" />
              </div>
            </div>
          </div>

          {/* Safety Footer */}
          <div className="p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 flex gap-3 items-start text-sm md:text-base mb-6">
            <span className="text-green-600 text-lg md:text-2xl flex-shrink-0">🔒</span>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Your safety comes first</p>
              <p className="text-gray-600">
                All chats are monitored and auto-expire after exams.
              </p>
            </div>
          </div>

          {/* Suggested Exams (visible on mobile and desktop) */}
          <div className="block">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Suggested Exams</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <SuggestedExam exam="NEET" students="450K+" />
              <SuggestedExam exam="JEE" students="380K+" />
              <SuggestedExam exam="GATE" students="210K+" />
              <SuggestedExam exam="AIIMS" students="95K+" />
              <SuggestedExam exam="CAT" students="250K+" />
              <SuggestedExam exam="UPSC" students="100K+" />
            </div>
          </div>

        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 flex justify-around items-center h-20">
        <NavItem icon="🏠" label="Home" href="/" active={true} />
        <NavItem icon="🔍" label="Search" href="/search" />
        <NavItem icon="💬" label="Chats" href="/qa" />
        <NavItem icon="👤" label="Profile" href="/profile" />
      </nav>

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
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-gray-300 active:scale-95">
        <div className="flex items-start gap-3 md:gap-4">
          <div className={`bg-gradient-to-br ${color} text-white rounded-xl p-3 text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-base md:text-lg group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          </div>
          <span className="text-gray-400 text-lg group-hover:translate-x-1 transition-transform flex-shrink-0">
            →
          </span>
        </div>
      </div>
    </Link>
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

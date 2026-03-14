import Link from 'next/link'

export default function StationGuide() {
  const stations = [
    {
      name: 'Central Station',
      exits: 'Exit 3 for bus stand',
      time: '20 min walk to pickup',
      services: 'Taxi, auto, bus services available',
      tip: 'Allow 5 min buffer for crowds'
    },
    {
      name: 'East Junction',
      exits: 'Exit 2 for highways',
      time: '10 min to auto stand',
      services: 'Ride-hailing, auto, taxis',
      tip: 'Note surge charges during peak hours'
    },
    {
      name: 'North Terminal',
      exits: 'Exit 1 main entrance',
      time: '5 min to taxi counter',
      services: 'Prepaid taxi, sheltered waiting',
      tip: 'Counters close by 10 PM'
    }
  ]

  const lastMileTips = [
    { icon: '🚕', title: 'Pre-book Transport', desc: 'Book taxi/cab the morning before' },
    { icon: '👥', title: 'Share Rides', desc: 'Split costs with classmates' },
    { icon: '📱', title: 'Offline Maps', desc: 'Download route before travel day' },
    { icon: '⏰', title: 'Extra Time', desc: 'Start 45+ min before reporting time' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Station Guide</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Quick reference for nearby stations, exits, and best last-mile transport options.</p>
        </div>

        {/* Stations Overview */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Stations</h2>
          <div className="space-y-4">
            {stations.map((station, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{station.name}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600"><span className="font-semibold">📍 Exit:</span> {station.exits}</p>
                    <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">⏱️</span> {station.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Services:</span> {station.services}</p>
                    <p className="text-sm text-yellow-700 bg-yellow-50 rounded px-3 py-2 mt-2 font-medium">💡 {station.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Mile Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Last-Mile Transport Tips</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {lastMileTips.map((tip, idx) => (
              <div key={idx} className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tip.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Tips */}
        <div className="mb-12 bg-red-50 rounded-2xl p-8 border border-red-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">❓ What If... FAQs</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">I'm running late?</h3>
              <p className="text-gray-700">Call exam centre immediately. If possible, reach a nearby landmark and call your local contact. Keep their number saved.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Need parking?</h3>
              <p className="text-gray-700">Some stations have paid parking. Check 1 week before or opt for public transport alternatives.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Transport on strike?</h3>
              <p className="text-gray-700">Monitor local news. Have backup route ready. Consider staying closer to centre day before if strike is likely.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Plan your journey now</h3>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">Compare all travel options and book your journey with guides from other exam aspirants.</p>
          <Link href="/travel" className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition">Explore Routes</Link>
        </div>
      </div>
    </div>
  )
}

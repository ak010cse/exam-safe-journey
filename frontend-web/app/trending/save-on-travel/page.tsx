import Link from 'next/link'

export default function SaveOnTravel() {
  const savings = [
    { title: 'Group Booking', savings: 'Save 20-30%', desc: 'Split taxi/auto costs with classmates', icon: '👥' },
    { title: 'Student Passes', savings: 'Save 15-25%', desc: 'Use student rail/metro passes', icon: '🎟️' },
    { title: 'Fare Alerts', savings: 'Save up to 40%', desc: 'Monitor prices and catch drops', icon: '🔔' },
    { title: 'Coupon Codes', savings: 'Save 10-15%', desc: 'IRCTC/Redbus discount codes', icon: '🏷️' }
  ]

  const packingList = [
    'Admit card (screenshot + print)',
    'Photo ID and one spare photo',
    'Pen and pencil (per exam rules)',
    'Water bottle (refillable)',
    'Tissues and hand sanitizer',
    'Light snack for after exam',
    'Phone charger and power bank'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Save on Travel</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Smart ways to reduce travel and stay costs without compromising comfort and safety.</p>
        </div>

        {/* Savings Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Money-Saving Ideas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {savings.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-green-200 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">{item.savings}</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Packing */}
        <div className="mb-12 bg-blue-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✈️ Pack Light, Save on Baggage</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {packingList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-700">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Strategy */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget Stay Strategy</h2>
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">📍</div>
                <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                <p className="text-sm text-gray-600">Walking distance to centre saves 50%+ on commute</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">🍽️</div>
                <h3 className="font-semibold text-gray-900 mb-2">Breakfast</h3>
                <p className="text-sm text-gray-600">Choose places with free breakfast included</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">✋</div>
                <h3 className="font-semibold text-gray-900 mb-2">Flexible Booking</h3>
                <p className="text-sm text-gray-600">Always choose free cancellation options</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to save?</h3>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">Explore budget-friendly travel and stay options with verified reviews from other exam aspirants.</p>
          <Link href="/travel" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Browse Budget Options</Link>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export default function BudgetStays() {
  const accommodations = [
    { type: 'Student Hostels', description: 'Positive reviews, social atmosphere, shared spaces', icon: '🏢' },
    { type: 'Budget Hotels', description: 'Free cancellation, basic amenities, close to transport', icon: '🏨' },
    { type: 'Shared Rooms', description: 'Cost-effective, near hubs, community living', icon: '🛏️' },
    { type: 'Guest Houses', description: 'Personal touch, local experience, budget-friendly', icon: '🏠' }
  ]

  const tips = [
    { title: 'Location', detail: 'Check proximity to exam centre and transport hubs' },
    { title: 'Reviews', detail: 'Look for cleanliness ratings and recent feedback' },
    { title: 'Safety', detail: 'Prefer places with 24/7 reception and security' },
    { title: 'Amenities', detail: 'WiFi, cooking facilities, laundry, study areas' },
    { title: 'Cancellation', detail: 'Choose flexible booking options' },
    { title: 'Budget', detail: 'Track costs including taxes and hidden charges' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Budget-Friendly Stays</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Find safe, comfortable, and affordable accommodations near exam centres that fit your budget.</p>
        </div>

        {/* Accommodation Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Where to Look</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {accommodations.map((acc, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{acc.icon}</span>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{acc.type}</h3>
                    <p className="text-gray-600 text-sm mt-1">{acc.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Checklist</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip, idx) => (
              <div key={idx} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2">✓ {tip.title}</h3>
                <p className="text-sm text-blue-700">{tip.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100/50 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to book your stay?</h3>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">Explore verified accommodation options sorted by budget and location.</p>
          <Link href="/stay" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Browse Stays</Link>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export default function TravelSmart() {
  const bookingTips = [
    { title: 'Compare Prices', desc: 'Bus, train, flights — check all options', icon: '💰' },
    { title: 'Book Early', desc: 'Secure lower fares 2+ weeks ahead', icon: '📅' },
    { title: 'Student Discounts', desc: 'Look for student concessions', icon: '🎓' },
    { title: 'Flexible Tickets', desc: 'Refundable/changeable if needed', icon: '🔄' },
  ]

  const travelDay = [
    'Printed/digital copy of tickets',
    'Hostel/hotel contact number',
    'Emergency contact list',
    'Charged phone + power bank',
    'Offline map downloaded',
    'Light snacks for journey'
  ]

  const itinerary = [
    { time: 'Night Before', task: 'Pack essentials, check documents, set alarms' },
    { time: 'Early Morning', task: 'Leave with margin for traffic and queues' },
    { time: 'Arrival', task: 'Locate centre entrance, report before deadline' },
    { time: 'Day After', task: 'Rest and light review if exams continue' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Travel Smart</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Master the art of efficient and stress-free travel for your exam with proven strategies.</p>
        </div>

        {/* Booking Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Smart</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {bookingTips.map((tip, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-blue-200 hover:shadow-lg transition">
                <span className="text-4xl block mb-3">{tip.icon}</span>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Day Checklist */}
        <div className="mb-12 bg-purple-50 rounded-2xl p-8 border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">✅ Day of Travel Checklist</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {travelDay.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 text-purple-600 rounded" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Itinerary */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">⏰ Sample Travel Itinerary</h2>
          <div className="space-y-3">
            {itinerary.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-32 font-semibold text-blue-600 bg-blue-50 rounded-lg p-3 text-center">
                  {item.time}
                </div>
                <div className="flex-grow bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700">{item.task}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Essential Apps */}
        <div className="mb-12 bg-green-50 rounded-2xl p-8 border border-green-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📱 Must-Have Apps & Tools</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-2">📍 Offline Maps</h3>
              <p className="text-sm text-gray-600">Download region before departing</p>
              <p className="text-xs text-green-600 mt-2 font-medium">Google Maps, OsmAnd</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-2">🎫 Booking Apps</h3>
              <p className="text-sm text-gray-600">IRCTC, Redbus, GoIbo, MakemyTrip</p>
              <p className="text-xs text-green-600 mt-2 font-medium">Save payment methods</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-2">🚕 Transport Apps</h3>
              <p className="text-sm text-gray-600">Uber, Ola, local autos</p>
              <p className="text-xs text-green-600 mt-2 font-medium">Save home & centre</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to travel with confidence?</h3>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">Book your travel and stay with guides from thousands of exam aspirants who've traveled before.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/travel" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">Book Travel</Link>
            <Link href="/stay" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Book Stay</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

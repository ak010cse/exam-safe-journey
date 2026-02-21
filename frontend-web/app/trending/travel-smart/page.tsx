import Link from 'next/link'

export default function TravelSmart() {
  return (
    <div className="py-8">
      
      <h1 className="text-3xl font-bold mt-4 mb-2">Travel Smart</h1>
      <p className="text-gray-700 mb-4">Ways to save and travel efficiently for your exam day.</p>

      <h2 className="font-semibold mt-4">Booking Tips</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Compare bus and train prices — book 2 weeks ahead to secure lower fares</li>
        <li>Look for student concessions and group discounts where available</li>
        <li>Prefer refundable or changeable tickets if your schedule is uncertain</li>
        <li>Set fare alerts on ticketing apps to catch price drops</li>
      </ul>

      <h2 className="font-semibold mt-4">Day of travel</h2>
      <p className="text-gray-600">Keep a printed/digital copy of tickets, the hostel/hotel contact, and an emergency contact. Charge your phone and pack a power bank.</p>

      <h2 className="font-semibold mt-4">Sample travel itinerary</h2>
      <ol className="list-decimal pl-5 mt-2 text-gray-600">
        <li>Night before: pack essentials, check documents, set multiple alarms</li>
        <li>Early morning: leave with margin for traffic and security queues</li>
        <li>Arrival: locate exam centre entrance and report desk before the reporting time</li>
      </ol>

      <h2 className="font-semibold mt-4">Apps & tools</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Offline maps (download region)</li>
        <li>Ticketing apps with saved payment methods</li>
        <li>Ride-hailing apps with saved home and centre addresses</li>
      </ul>
    </div>
  )
}

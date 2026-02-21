import Link from 'next/link'

export default function TravelSmart() {
  return (
    <div className="py-8">
      
      <h1 className="text-3xl font-bold mt-4 mb-2">Travel Smart</h1>
      <p className="text-gray-700 mb-4">Ways to save and travel efficiently for your exam day.</p>

      <h2 className="font-semibold mt-4">Booking Tips</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Compare bus and train prices — book 2 weeks ahead</li>
        <li>Look for student concessions and group discounts</li>
        <li>Prefer refundable tickets if plans may change</li>
      </ul>

      <h2 className="font-semibold mt-4">Day of travel</h2>
      <p className="text-gray-600">Keep a printed copy of tickets and have the phone of the hostel/hotel handy.</p>
    </div>
  )
}

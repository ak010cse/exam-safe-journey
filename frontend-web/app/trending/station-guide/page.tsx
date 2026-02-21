import Link from 'next/link'

export default function StationGuide() {
  return (
    <div className="py-8">
      
      <h1 className="text-3xl font-bold mt-4 mb-2">Station Guide</h1>
      <p className="text-gray-700 mb-4">Quick reference for nearby stations and last-mile options.</p>

      <h2 className="font-semibold mt-4">Top stations</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Central Station — exit 3 for bus stand; allow 20 minutes to walk to the pickup point</li>
        <li>East Junction — frequent autorickshaw/ride-hailing services; note peak-hour surge</li>
        <li>North Terminal — prepaid taxi counters available and a sheltered waiting area</li>
      </ul>

      <h2 className="font-semibold mt-4">Last-mile & tips</h2>
      <p className="text-gray-600">Plan your last-mile in advance: share rides with classmates, pre-book a taxi for morning slots, and keep the hostel/hotel number saved.</p>

      <h2 className="font-semibold mt-4">Quick checklist</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Note the station exit number closest to the bus stop or auto stand</li>
        <li>Allow extra time for traffic and security checks</li>
        <li>Keep a screenshot of the route and offline map if mobile data is unreliable</li>
      </ul>

      <h2 className="font-semibold mt-4">FAQ</h2>
      <div className="text-gray-600">
        <div className="mt-2"><strong>Q:</strong> What if I'm delayed? <br/> <strong>A:</strong> Call the exam centre number and your local contact; if possible, reach a nearby landmark and wait.</div>
        <div className="mt-2"><strong>Q:</strong> Is parking available? <br/> <strong>A:</strong> Some stations have paid parking — check in advance or use public transport.</div>
      </div>
    </div>
  )
}

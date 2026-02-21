import Link from 'next/link'

export default function StationGuide() {
  return (
    <div className="py-8">
      
      <h1 className="text-3xl font-bold mt-4 mb-2">Station Guide</h1>
      <p className="text-gray-700 mb-4">Quick reference for nearby stations and last-mile options.</p>

      <h2 className="font-semibold mt-4">Top stations</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Central Station — exit 3 for bus stand</li>
        <li>East Junction — frequent auto services</li>
        <li>North Terminal — prepaid taxi counters available</li>
      </ul>

      <h2 className="font-semibold mt-4">Last-mile</h2>
      <p className="text-gray-600">Consider sharing rides with colleagues to reduce cost and confusion on exam day.</p>
    </div>
  )
}

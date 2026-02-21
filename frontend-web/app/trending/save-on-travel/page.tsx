import Link from 'next/link'

export default function SaveOnTravel() {
  return (
    <div className="py-8">
      
      <h1 className="text-3xl font-bold mt-4 mb-2">Save on Travel</h1>
      <p className="text-gray-700 mb-4">Tips for cost-effective travel for students and aspirants.</p>

      <h2 className="font-semibold mt-4">Money saving ideas</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Book in groups to split taxi or auto costs</li>
        <li>Use student rail/metro passes where available</li>
        <li>Monitor fares and use alerts for price drops</li>
        <li>Search for coupon codes on hotel and booking platforms</li>
      </ul>

      <h2 className="font-semibold mt-4">Packing light</h2>
      <p className="text-gray-600">Bring only essentials to avoid baggage fees; carry a small day bag for the exam day with a pen, water bottle, and required documents.</p>

      <h2 className="font-semibold mt-4">Budget-friendly stay checklist</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Prefer places with free cancellation and 24/7 reception</li>
        <li>Check distance to centre — walking distance saves on last-mile costs</li>
        <li>Look for basic breakfast included to avoid morning expenses</li>
      </ul>
    </div>
  )
}

import Link from 'next/link'

export default function BudgetStays() {
  return (
    <div className="py-8">
      
      <h1 className="text-3xl font-bold mt-4 mb-2">Budget Stays</h1>
      <p className="text-gray-700 mb-4">Find safe, budget-friendly accommodations near exam centres.</p>

      <h2 className="font-semibold mt-4">Where to look</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Student hostels with positive reviews</li>
        <li>Budget hotels with free cancellation</li>
        <li>Shared rooms close to transport hubs</li>
      </ul>

      <h2 className="font-semibold mt-4">Safety tips</h2>
      <p className="text-gray-600">Check reviews for cleanliness and proximity to the exam centre; prefer places with 24/7 reception.</p>
    </div>
  )
}

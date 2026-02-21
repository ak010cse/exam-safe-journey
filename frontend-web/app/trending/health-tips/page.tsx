import Link from 'next/link'

export default function HealthTips() {
  return (
    <div className="py-8">
      
      <h1 className="text-3xl font-bold mt-4 mb-2">Health Tips</h1>
      <p className="text-gray-700 mb-4">Simple health precautions for exam day and travel.</p>

      <h2 className="font-semibold mt-4">Before travel</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Pack necessary medicines and a small first-aid kit</li>
        <li>Get enough sleep two nights before the exam</li>
        <li>Eat balanced meals and stay hydrated</li>
      </ul>

      <h2 className="font-semibold mt-4">On exam day</h2>
      <p className="text-gray-600">Carry tissues, sanitizer, and a water bottle. Follow local safety rules at the center.</p>
    </div>
  )
}

import Link from 'next/link'

export default function ExamIn45() {
  return (
    <div className="py-8">
      
      <h1 className="text-3xl font-bold mt-4 mb-2">Exam in 45 days? Start planning</h1>
      <p className="text-gray-700 mb-4">If your exam is around the corner, follow this checklist to avoid last-minute issues.</p>

      <h2 className="font-semibold mt-4">Top Actions</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Confirm exam center and exam slot</li>
        <li>Plan your travel and book tickets early</li>
        <li>Reserve stay near the center if needed</li>
        <li>Prepare documents: admit card, photo ID</li>
      </ul>

      <h2 className="font-semibold mt-4">Local tips</h2>
      <p className="text-gray-600">Arrive a day earlier if you're traveling from another city. Check station exit numbers and nearest bus routes.</p>
    </div>
  )
}

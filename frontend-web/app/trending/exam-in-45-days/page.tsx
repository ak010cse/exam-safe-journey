import Link from 'next/link'

export default function ExamIn45() {
  return (
    <div className="py-8">
      
      <h1 className="text-3xl font-bold mt-4 mb-2">Exam in 45 days? Start planning</h1>
      <p className="text-gray-700 mb-4">If your exam is around the corner, follow this checklist to avoid last-minute issues.</p>

      <h2 className="font-semibold mt-4">Top Actions</h2>
      <ul className="list-disc pl-5 mt-2 text-gray-600">
        <li>Confirm exam centre and time slot; screenshot the admit card</li>
        <li>Plan your travel and book tickets early with time margin</li>
        <li>Reserve stay near the centre if traveling from out of town</li>
        <li>Prepare documents: admit card, valid photo ID, and spare passport photo if required</li>
      </ul>

      <h2 className="font-semibold mt-4">2-week checklist</h2>
      <ul className="list-decimal pl-5 mt-2 text-gray-600">
        <li>Revisit the exam syllabus & focus on weak topics</li>
        <li>Take at least two full-length mock tests under timed conditions</li>
        <li>Sort travel, stay, and local logistics; build a loose schedule</li>
      </ul>

      <h2 className="font-semibold mt-4">Local tips</h2>
      <p className="text-gray-600">Arrive a day earlier if you're traveling from another city. Check station exit numbers, nearest bus/metro routes, and any local transport strikes that might affect travel.</p>

      <h2 className="font-semibold mt-4">Quick plan for D-1</h2>
      <ol className="list-decimal pl-5 mt-2 text-gray-600">
        <li>Pack documents and a light day bag</li>
        <li>Confirm the route to centre and travel time</li>
        <li>Relax: light revision only and get good sleep</li>
      </ol>
    </div>
  )
}

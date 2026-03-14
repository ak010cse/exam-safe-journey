import Link from 'next/link'

export default function ExamIn45() {
  const timeline = [
    {
      phase: 'Now (45 days)',
      tasks: [
        'Confirm exam centre and time slot',
        'Screenshot the admit card',
        'Plan your travel route',
        'Book tickets early'
      ]
    },
    {
      phase: '2 Weeks Out',
      tasks: [
        'Revisit exam syllabus',
        'Focus on weak topics',
        'Take 2 full-length mock tests',
        'Finalize stay arrangements'
      ]
    },
    {
      phase: '1 Week Out',
      tasks: [
        'Check local transport routes',
        'Prepare all documents',
        'Plan day-before schedule',
        'Review travel logistics'
      ]
    },
    {
      phase: 'Exam Day (D-1)',
      tasks: [
        'Pack documents and day bag',
        'Confirm centre route',
        'Light revision only',
        'Get good sleep'
      ]
    }
  ]

  const documents = [
    'Admit card (screenshot + print)',
    'Valid photo ID (Passport/Aadhar)',
    'Proof of address',
    'Spare passport photos',
    'Emergency contact list'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Exam in 45 Days?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Your complete action plan to prepare, plan travel, and arrive at your exam centre completely ready.</p>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Week-by-Week Timeline</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition">
                <h3 className="font-semibold text-lg text-blue-900 mb-4">{item.phase}</h3>
                <ul className="space-y-2">
                  {item.tasks.map((task, i) => (
                    <li key={i} className="flex gap-2 text-gray-700">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Checklist */}
        <div className="mb-12 bg-yellow-50 rounded-2xl p-8 border border-yellow-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Document Checklist</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {documents.map((doc, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-700">
                <input type="checkbox" className="w-5 h-5 text-yellow-600 rounded" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Need help planning travel?</h3>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">Find exam centres, book travel routes, reserve stays, and connect with other exam aspirants all in one place.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/search" className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">Find Exam Centres</Link>
            <Link href="/travel" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Book Travel</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

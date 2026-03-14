import Link from 'next/link'

export default function HealthTips() {
  const tips = [
    {
      title: 'Before Travel',
      icon: '🏥',
      items: [
        'Pack necessary medicines and a small first-aid kit',
        'Get enough sleep two nights before the exam',
        'Eat balanced meals and stay hydrated',
        'Avoid trying new foods the day before travel'
      ]
    },
    {
      title: 'On Exam Day',
      icon: '✓',
      items: [
        'Carry tissues, sanitizer, and a water bottle',
        'Follow local safety rules at the centre',
        'Keep any required medical documents handy',
        'Stay calm and focused'
      ]
    },
    {
      title: 'Stress Management',
      icon: '🧘',
      items: [
        'Practice short breathing exercises before the exam',
        'Avoid heavy study the night before',
        'Focus on light revision',
        'Bring a small snack for after the exam'
      ]
    },
    {
      title: 'Emergency Preparedness',
      icon: '📞',
      items: [
        'Save a local emergency number',
        'Keep your accommodation contact ready',
        'Note any allergies or medical conditions',
        'Keep a hard copy of important documents'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Health Tips for Exam Journey</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Stay healthy, focused, and prepared. Simple health precautions for exam day and travel to ensure you arrive at your best.</p>
        </div>

        {/* Tips Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {tips.map((tip, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{tip.icon}</span>
                <h2 className="text-xl font-semibold text-gray-900">{tip.title}</h2>
              </div>
              <ul className="space-y-2">
                {tip.items.map((item, i) => (
                  <li key={i} className="flex gap-2 text-gray-700">
                    <span className="text-green-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Need more guidance?</h3>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">Connect with other exam aspirants to share health tips and experiences during your journey.</p>
          <Link href="/community" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Join Community</Link>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { getExamBySlug } from '../../../lib/exams'

export default async function ExamPage({ params }: { params: any }) {
  const { slug } = await params
  const exam = getExamBySlug(String(slug))

  if (!exam) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Exam details</h2>
        <p className="text-sm text-gray-600 mt-3">No data found for <strong>{slug}</strong>.</p>
        <div className="mt-4">
          <Link href="/" className="text-blue-600">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 pb-24">
      <h1 className="text-2xl font-bold">{exam.name}</h1>
      <p className="text-sm text-gray-600 mt-2">{exam.students} aspirants • {exam.description}</p>

      <div className="mt-6 bg-white p-4 rounded-2xl border">
        <h3 className="font-semibold mb-2">Quick Tips</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {exam.prepTips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      {/* Sample Centres */}
      {exam.sampleCentres && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Sample Exam Centres</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exam.sampleCentres.map((c: any, idx: number) => (
              <div key={idx} className="bg-white border rounded-2xl p-3">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-gray-500">{c.address} • {c.distanceKm} km</div>
                <div className="mt-2 flex gap-2">
                  <Link href={`/search?centre=${encodeURIComponent(c.name)}`} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-xl">Search Centre</Link>
                  <Link href="/search" className="text-sm bg-gray-100 px-3 py-1 rounded-xl">All Centres</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Travel Tips */}
      {exam.travelTips && (
        <div className="mt-6 bg-white p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">Travel Tips</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {exam.travelTips.map((t: string, i: number) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      {/* Packing list */}
      {exam.packing && (
        <div className="mt-6 bg-white p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">Packing Checklist</h3>
          <div className="flex flex-wrap gap-2">
            {exam.packing.map((p: string, i: number) => (
              <span key={i} className="text-sm bg-gray-100 px-3 py-1 rounded-full">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Practice tests */}
      {exam.practiceTests && exam.practiceTests.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-2xl border">
          <h3 className="font-semibold mb-2">Practice Tests</h3>
          <div className="space-y-2">
            {exam.practiceTests.map((tid: string) => (
              <Link key={tid} href={`/practice/${tid}`} className="block text-sm text-blue-600">Take practice test: {tid}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

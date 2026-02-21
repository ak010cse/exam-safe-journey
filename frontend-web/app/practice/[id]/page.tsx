import { getTestById } from '@/lib/practice'
import Link from 'next/link'
import PracticeRunner from '../PracticeRunnerClient'

export default async function PracticeTestPage({ params }: { params: any }) {
  const { id } = await params
  const test = getTestById(String(id))

  if (!test) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">Test not found</h2>
        <p className="text-sm text-gray-600 mt-2">No test with id {id}</p>
        <div className="mt-4"><Link href="/practice" className="text-blue-600">Back to tests</Link></div>
      </div>
    )
  }

  // Render client runner
  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold">{test.title}</h1>
      <p className="text-sm text-gray-600 mt-2">{test.durationMin} minutes • {test.questions.length} questions</p>

      <PracticeRunner test={test} />
    </div>
  )
}

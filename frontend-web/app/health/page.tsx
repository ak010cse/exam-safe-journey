import Link from 'next/link'

export default function HealthSafetyPage() {
  return (
    <div className="p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Health & Safety</h1>
      <p className="text-sm text-gray-600 mb-4">Guidance to keep you safe and healthy on exam day and while travelling.</p>

      <section className="bg-white border rounded-2xl p-4 mb-4">
        <h3 className="font-semibold">Before Travel</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 mt-2">
          <li>Get adequate sleep two nights before exam.</li>
          <li>Keep emergency medicines and prescriptions handy.</li>
          <li>Share your travel plan with a trusted contact.</li>
        </ul>
      </section>

      <section className="bg-white border rounded-2xl p-4 mb-4">
        <h3 className="font-semibold">On Exam Day</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 mt-2">
          <li>Carry a small sanitizer and tissues; maintain distance when possible.</li>
          <li>Carry only essential items to the centre to reduce crowding.</li>
          <li>Follow centre staff instructions for safety protocols.</li>
        </ul>
      </section>

      <section className="bg-white border rounded-2xl p-4 mb-4">
        <h3 className="font-semibold">Emergency Contacts</h3>
        <p className="text-sm text-gray-700 mt-2">Local police, ambulance numbers and helplines vary by city — check local listings or ask the centre staff.</p>
      </section>

      <div className="mt-4 text-sm">
        <Link href="/share-tips" className="text-blue-600">Report a safety issue or share a tip</Link>
      </div>
    </div>
  )
}

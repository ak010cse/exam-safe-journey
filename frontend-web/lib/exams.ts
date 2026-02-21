export const EXAMS = [
  {
    slug: 'neet',
    name: 'NEET',
    students: '450K+',
    description: 'National Eligibility cum Entrance Test — tips for exam day, centres, and travel.',
    prepTips: [
      'Carry admit card and valid photo ID',
      'Reach centre early; gates open 90 minutes before',
      'Keep medicines and water handy'
    ],
    sampleCentres: [
      { name: 'ABC Senior Secondary School', address: 'Rajendra Nagar, Patna', distanceKm: 1.2 },
      { name: "St. Mary's College Grounds", address: 'Kankarbagh, Patna', distanceKm: 2.8 }
    ],
    travelTips: ['Prefer a pre-booked taxi for early morning slots', 'Check local train timings the day before'],
    packing: ['Admit card', '2 passport photos', 'Valid ID proof', 'Small water bottle', 'Necessary medicines'],
    practiceTests: ['mock-1']
  },
  {
    slug: 'jee',
    name: 'JEE',
    students: '380K+',
    description: 'Joint Entrance Examination — guidance on stations, stays and time management.',
    prepTips: [
      'Practice previous year papers under timed conditions',
      'Plan travel two days in advance for distant centres',
    ],
    sampleCentres: [
      { name: 'City Public School Auditorium', address: 'Ashok Rajpath, Patna', distanceKm: 0.9 },
      { name: 'Regional Sports Complex', address: 'Patliputra, Patna', distanceKm: 3.2 }
    ],
    travelTips: ['Book accommodation a day earlier for long-distance travellers', 'Check nearest metro/bus exits in advance'],
    packing: ['Admit card', 'Photo ID', 'Stationery', 'Portable charger'],
    practiceTests: ['mock-2']
  },
  {
    slug: 'gate',
    name: 'GATE',
    students: '210K+',
    description: 'Graduate Aptitude Test in Engineering — regional centres and logistics.',
    prepTips: ['Check centre code carefully', 'Carry calculator if allowed'],
    sampleCentres: [
      { name: 'Regional Engineering College Hall', address: 'Tech Park Rd', distanceKm: 2.5 }
    ],
    travelTips: ['Confirm vehicle availability for late evening arrivals'],
    packing: ['Admit card', 'ID proof', 'Permitted calculator'],
    practiceTests: ['mock-3']
  },
  {
    slug: 'aiims',
    name: 'AIIMS',
    students: '95K+',
    description: 'AIIMS entrance tips and safety notes for candidates.',
    prepTips: ['Verify exam slot timing', 'Avoid last-minute travel'],
    sampleCentres: [
      { name: 'AIIMS Exam Centre - Block A', address: 'Medical Campus Rd', distanceKm: 1.0 }
    ],
    travelTips: ['Follow hospital campus entry rules', 'Carry prescribed medicines with a note'],
    packing: ['Admit card', 'Prescription (if carrying meds)'],
    practiceTests: ['mock-4']
  },
  {
    slug: 'cat',
    name: 'CAT',
    students: '250K+',
    description: 'Common Admission Test — exam day checklist and test centre advice.',
    prepTips: ['Carry required documents', 'Know nearby lodging options'],
    sampleCentres: [
      { name: 'Convention Centre Hall', address: 'MG Road', distanceKm: 2.2 }
    ],
    travelTips: ['Allow extra time for city traffic during peak hours'],
    packing: ['Admit card', 'ID proof', 'Copies of application'],
    practiceTests: ['mock-5']
  },
  {
    slug: 'upsc',
    name: 'UPSC',
    students: '100K+',
    description: 'Union Public Service Commission exams — long logistics and city guides.',
    prepTips: ['Plan long travel carefully', 'Keep multiple ID proofs'],
    sampleCentres: [
      { name: 'District Exam Centre', address: 'Central Administrative Complex', distanceKm: 4.0 }
    ],
    travelTips: ['Check inter-city travel schedules well in advance'],
    packing: ['Admit card', 'Multiple ID proofs', 'Portable snacks for long waits'],
    practiceTests: ['mock-6']
  }
]

export function getExamBySlug(slug: string) {
  return EXAMS.find(e => e.slug === slug)
}

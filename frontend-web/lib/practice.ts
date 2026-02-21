export const PRACTICE_TESTS = [
  {
    id: 'mock-1',
    title: 'NEET — Full Length Mock',
    durationMin: 180,
    questions: [
      {
        id: 'q1',
        text: 'Which vitamin is essential for calcium absorption?',
        options: ['Vitamin A', 'Vitamin B12', 'Vitamin C', 'Vitamin D'],
        answerIndex: 3,
      },
      {
        id: 'q2',
        text: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
        answerIndex: 1,
      },
      {
        id: 'q3',
        text: 'pH of pure water at 25°C is?',
        options: ['7', '1', '14', '0'],
        answerIndex: 0,
      },
      {
        id: 'q4',
        text: 'Which gas is produced in fermentation?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Helium'],
        answerIndex: 2,
      },
      {
        id: 'q5',
        text: 'The formula for speed is?',
        options: ['distance × time', 'distance / time', 'time / distance', 'distance + time'],
        answerIndex: 1,
      },
    ],
  },

  {
    id: 'mock-2',
    title: 'JEE — Concept Revision Test',
    durationMin: 30,
    questions: [
      {
        id: 'q1',
        text: 'Derivative of sin(x) is?',
        options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
        answerIndex: 0,
      },
      {
        id: 'q2',
        text: 'Unit vector has magnitude?',
        options: ['0', '1', 'π', 'e'],
        answerIndex: 1,
      },
      {
        id: 'q3',
        text: 'Ohm’s law relates voltage with?',
        options: ['resistance only', 'current only', 'current and resistance', 'power'],
        answerIndex: 2,
      },
    ],
  },
  {
    id: 'mock-3',
    title: 'GATE — Engineering Quick Check',
    durationMin: 20,
    questions: [
      { id: 'g1', text: 'What is the unit of inductance?', options: ['Ohm', 'Henry', 'Farad', 'Tesla'], answerIndex: 1 },
      { id: 'g2', text: 'Young’s modulus measures?', options: ['Viscosity', 'Elasticity', 'Density', 'Hardness'], answerIndex: 1 },
      { id: 'g3', text: 'For a simply supported beam, bending moment at center is?', options: ['Maximum', 'Minimum', 'Zero', 'Equal to shear'], answerIndex: 0 },
    ]
  },
  {
    id: 'mock-4',
    title: 'AIIMS — Medical Basics Mini Test',
    durationMin: 25,
    questions: [
      { id: 'a1', text: 'Normal adult heart rate (bpm) range?', options: ['40-60', '60-100', '100-140', '20-40'], answerIndex: 1 },
      { id: 'a2', text: 'Which organ produces insulin?', options: ['Liver', 'Pancreas', 'Kidney', 'Spleen'], answerIndex: 1 },
      { id: 'a3', text: 'Preferred route for emergency fluid resuscitation?', options: ['Oral', 'IV', 'IM', 'Subcutaneous'], answerIndex: 1 },
    ]
  },
  {
    id: 'mock-5',
    title: 'CAT — Aptitude Practice',
    durationMin: 30,
    questions: [
      { id: 'c1', text: 'If x+y=10 and xy=21, x^2+y^2 equals?', options: ['58', '100', '79', '13'], answerIndex: 0 },
      { id: 'c2', text: 'Percent increase from 50 to 75?', options: ['25%', '50%', '75%', '100%'], answerIndex: 1 },
    ]
  },
  {
    id: 'mock-6',
    title: 'UPSC — General Awareness Drill',
    durationMin: 20,
    questions: [
      { id: 'u1', text: 'Capital of Australia?', options: ['Sydney', 'Canberra', 'Melbourne', 'Perth'], answerIndex: 1 },
      { id: 'u2', text: 'Who wrote the Constitution of India (drafting committee chair)?', options: ['B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel', 'Dr. Rajendra Prasad'], answerIndex: 0 },
    ]
  }
]

export function getTestById(id: string) {
  return PRACTICE_TESTS.find(t => t.id === id)
}

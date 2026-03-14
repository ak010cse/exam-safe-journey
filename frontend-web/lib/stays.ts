export interface StayOption {
  id: string
  name: string
  location: string
  distance: string
  price: string
  rating: string
  stayers: number
}

export const STAY_OPTIONS: StayOption[] = [
  {
    id: 'hotel-abc-residency',
    name: 'Hotel ABC Residency',
    location: 'Rajendra Nagar Road',
    distance: '900 m from exam centre',
    price: '₹800 /night',
    rating: '4.4 (112)',
    stayers: 10,
  },
  {
    id: 'patna-comfort-inn',
    name: 'Patna Comfort Inn',
    location: 'Near Patna Jn Station',
    distance: '1.5 km from exam centre',
    price: '₹750 /night',
    rating: '4.2 (85)',
    stayers: 8,
  },
]

export function getStayOptionById(id: string) {
  return STAY_OPTIONS.find((s) => s.id === id) ?? null
}

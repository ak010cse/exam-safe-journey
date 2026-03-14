export interface TravelRoute {
  id: string
  mode: 'train' | 'bus' | 'taxi' | 'walk'
  title: string
  time: string
  price: string
  highlights: string[]
}

export const TRAVEL_ROUTES: TravelRoute[] = [
  {
    id: 'train-1',
    mode: 'train',
    title: 'Train - Patna Jn to Rajendra Nagar',
    time: '10 mins',
    price: '₹15',
    highlights: ['Direct trains every 15 mins', 'Station exit nearest to exam centre'],
  },
  {
    id: 'bus-1',
    mode: 'bus',
    title: 'Bus - Patna Jn Bus Stand to Rajendra Nagar',
    time: '20 mins',
    price: '₹20',
    highlights: ['Frequent buses', 'Short walk from drop-off'],
  },
  {
    id: 'taxi-1',
    mode: 'taxi',
    title: 'Taxi / Auto',
    time: '15 mins',
    price: '₹70 - 100',
    highlights: ['Book early to avoid rush hour', 'Best for groups'],
  },
]

export function getTravelRouteById(id: string) {
  return TRAVEL_ROUTES.find((r) => r.id === id) ?? null
}

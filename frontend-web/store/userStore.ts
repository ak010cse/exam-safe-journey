import { create } from 'zustand'

export interface UserProfile {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  provider?: string
  avatarUrl?: string
  savedRoutes?: string[]
  savedStays?: string[]
}

interface UserState {
  user: UserProfile | null
  isAuthenticated: boolean
  hydrated: boolean
  setUser: (user: UserProfile | null) => void
  clearUser: () => void
  hydrateUser: () => void
  toggleSavedRoute: (routeId: string) => void
  toggleSavedStay: (stayId: string) => void
}

function persistUser(user: UserProfile | null) {
  if (!user) {
    localStorage.removeItem('user')
    return
  }
  localStorage.setItem('user', JSON.stringify(user))
}

function loadUserFromStorage() {
  try {
    const stored = localStorage.getItem('user')
    return stored ? (JSON.parse(stored) as UserProfile) : null
  } catch {
    return null
  }
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  hydrated: false,
  setUser: (user) => {
    set({ user, isAuthenticated: Boolean(user) })
    persistUser(user)
  },
  clearUser: () => {
    set({ user: null, isAuthenticated: false })
    persistUser(null)
  },
  hydrateUser: () => {
    const user = loadUserFromStorage()
    set({ user, isAuthenticated: Boolean(user), hydrated: true })
  },
  toggleSavedRoute: (routeId) => {
    const user = get().user
    if (!user) return

    const savedRoutes = new Set(user.savedRoutes ?? [])
    if (savedRoutes.has(routeId)) {
      savedRoutes.delete(routeId)
    } else {
      savedRoutes.add(routeId)
    }

    const updated: UserProfile = {
      ...user,
      savedRoutes: Array.from(savedRoutes),
    }
    set({ user: updated })
    persistUser(updated)
  },
  toggleSavedStay: (stayId) => {
    const user = get().user
    if (!user) return

    const savedStays = new Set(user.savedStays ?? [])
    if (savedStays.has(stayId)) {
      savedStays.delete(stayId)
    } else {
      savedStays.add(stayId)
    }

    const updated: UserProfile = {
      ...user,
      savedStays: Array.from(savedStays),
    }
    set({ user: updated })
    persistUser(updated)
  },
}))

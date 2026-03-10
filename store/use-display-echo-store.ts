import { create } from 'zustand'

interface RandomEchoIndex {
  randomIndex: number | null
  selectRandomIndex: (max: number) => void
}

export const useRandomEchoIndexStore = create<RandomEchoIndex>((set, get) => ({
  randomIndex: null,
  selectRandomIndex: (max: number) => {
    if (get().randomIndex === null) {
      const array = new Uint32Array(1)
      crypto.getRandomValues(array)
      set({ randomIndex: array[0] % max })
    }
  },
}))

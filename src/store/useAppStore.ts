import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CheckIn, Challenge } from '../types'
import { challenges as initialChallenges } from '../data/challenges'
import { users as initialUsers } from '../data/users'
import { advanceDay as advanceDayDomain } from '../domain/advanceDay'
import { CURRENT_USER_ID } from '../domain/constants'

interface AppState {
  users: typeof initialUsers
  challenges: Challenge[]
  lastGraduatedChallengeId: string | null

  checkIn: (challengeId: string, data: Omit<CheckIn, 'userId' | 'day'>) => void
  advanceDay: (challengeId: string) => void
  resetDemo: () => void
  clearLastGraduated: () => void
}

function cloneInitialChallenges(): Challenge[] {
  return initialChallenges.map((c) => ({
    ...c,
    character: { ...c.character, parts: [...c.character.parts] },
    checkIns: [...c.checkIns],
    memberIds: [...c.memberIds],
  }))
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      challenges: cloneInitialChallenges(),
      lastGraduatedChallengeId: null,

      checkIn: (challengeId, data) => {
        set((state) => ({
          challenges: state.challenges.map((challenge) => {
            if (challenge.id !== challengeId) return challenge
            if (challenge.status !== 'ongoing') return challenge

            const already = challenge.checkIns.some(
              (c) => c.userId === CURRENT_USER_ID && c.day === challenge.currentDay,
            )
            if (already) return challenge

            return {
              ...challenge,
              checkIns: [
                ...challenge.checkIns,
                { ...data, userId: CURRENT_USER_ID, day: challenge.currentDay },
              ],
            }
          }),
        }))
      },

      advanceDay: (challengeId) => {
        const challenge = get().challenges.find((c) => c.id === challengeId)
        if (!challenge) return

        const { challenge: updated, graduated } = advanceDayDomain(challenge)
        set((state) => ({
          challenges: state.challenges.map((c) => (c.id === challengeId ? updated : c)),
          lastGraduatedChallengeId: graduated ? challengeId : state.lastGraduatedChallengeId,
        }))
      },

      resetDemo: () => {
        set({
          users: initialUsers,
          challenges: cloneInitialChallenges(),
          lastGraduatedChallengeId: null,
        })
      },

      clearLastGraduated: () => set({ lastGraduatedChallengeId: null }),
    }),
    { name: 'moa-demo-store' },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CheckIn, Challenge, DonationCategory, GoodsType } from '../types'
import { challenges as initialChallenges } from '../data/challenges'
import { users as initialUsers, TOUR_USERS } from '../data/users'
import { advanceDay as advanceDayDomain, advanceDayWithPresence } from '../domain/advanceDay'
import { createGoodsOrder } from '../domain/goods'
import { CURRENT_USER_ID } from '../domain/constants'
import { buildTourChallenge, TOUR_CHALLENGE_ID, TOUR_FRIEND_PRESENCE } from '../data/tour'
import type { TourStep } from '../data/tour'

interface AppState {
  users: typeof initialUsers
  challenges: Challenge[]
  lastCompletedChallengeId: string | null
  tourStep: TourStep | null

  checkIn: (challengeId: string, data: Omit<CheckIn, 'userId' | 'day'>) => void
  advanceDay: (challengeId: string) => void
  reserveGoods: (challengeId: string, type: GoodsType, donationCategory: DonationCategory) => void
  resetDemo: () => void
  clearLastCompleted: () => void

  startTour: () => void
  skipTour: () => void
  setTourStep: (step: TourStep | null) => void
  advanceTourDay: (includeMe: boolean) => void
}

function cloneInitialChallenges(): Challenge[] {
  return initialChallenges.map((c) => ({
    ...c,
    character: { ...c.character, parts: { ...c.character.parts } },
    checkIns: [...c.checkIns],
    memberIds: [...c.memberIds],
  }))
}

function withoutTourChallenge(challenges: Challenge[]): Challenge[] {
  return challenges.filter((c) => c.id !== TOUR_CHALLENGE_ID)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      challenges: cloneInitialChallenges(),
      lastCompletedChallengeId: null,
      tourStep: null,

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
        const { challenges, users } = get()
        const challenge = challenges.find((c) => c.id === challengeId)
        if (!challenge) return

        const { challenge: updated, completed } = advanceDayDomain(challenge, users)
        set((state) => ({
          challenges: state.challenges.map((c) => (c.id === challengeId ? updated : c)),
          lastCompletedChallengeId: completed ? challengeId : state.lastCompletedChallengeId,
        }))
      },

      reserveGoods: (challengeId, type, donationCategory) => {
        set((state) => ({
          challenges: state.challenges.map((c) =>
            c.id === challengeId
              ? { ...c, goodsOrder: createGoodsOrder(type, donationCategory) }
              : c,
          ),
        }))
      },

      resetDemo: () => {
        set({
          users: initialUsers,
          challenges: cloneInitialChallenges(),
          lastCompletedChallengeId: null,
          tourStep: null,
        })
      },

      clearLastCompleted: () => set({ lastCompletedChallengeId: null }),

      startTour: () => {
        set((state) => ({
          challenges: [...withoutTourChallenge(state.challenges), buildTourChallenge()],
          tourStep: 1,
        }))
      },

      skipTour: () => set({ tourStep: null }),

      setTourStep: (step) => set({ tourStep: step }),

      advanceTourDay: (includeMe) => {
        const { challenges } = get()
        const challenge = challenges.find((c) => c.id === TOUR_CHALLENGE_ID)
        if (!challenge) return

        const friendsToday = TOUR_FRIEND_PRESENCE[challenge.currentDay] ?? []
        const presentUserIds = includeMe ? [CURRENT_USER_ID, ...friendsToday] : friendsToday

        const { challenge: updated, completed } = advanceDayWithPresence(
          challenge,
          presentUserIds,
          TOUR_USERS,
        )
        set((state) => ({
          challenges: state.challenges.map((c) => (c.id === TOUR_CHALLENGE_ID ? updated : c)),
          lastCompletedChallengeId: completed
            ? TOUR_CHALLENGE_ID
            : state.lastCompletedChallengeId,
        }))
      },
    }),
    { name: 'moa-demo-store' },
  ),
)

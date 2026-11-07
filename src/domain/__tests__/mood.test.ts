import { describe, expect, it } from 'vitest'
import { calcMood } from '../mood'
import type { Challenge } from '../../types'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 10,
    currentDay: 1,
    memberIds: ['me', 'f1', 'f2', 'f3'],
    ownerId: 'me',
    character: { bodyShape: 'round', bodyColor: 'pink', parts: [], name: '모아' },
    checkIns: [],
    status: 'ongoing',
    ...overrides,
  }
}

describe('calcMood', () => {
  it('전원 인증 시 great', () => {
    const challenge = makeChallenge({
      checkIns: ['me', 'f1', 'f2', 'f3'].map((userId) => ({ userId, day: 1 })),
    })
    expect(calcMood(challenge, 1)).toBe('great')
  })

  it('50% 이상 인증 시 okay', () => {
    const challenge = makeChallenge({
      checkIns: ['me', 'f1'].map((userId) => ({ userId, day: 1 })),
    })
    expect(calcMood(challenge, 1)).toBe('okay')
  })

  it('50% 미만 인증 시 low', () => {
    const challenge = makeChallenge({
      checkIns: [{ userId: 'me', day: 1 }],
    })
    expect(calcMood(challenge, 1)).toBe('low')
  })

  it('해당일 인증이 하나도 없으면 low', () => {
    expect(calcMood(makeChallenge(), 1)).toBe('low')
  })
})

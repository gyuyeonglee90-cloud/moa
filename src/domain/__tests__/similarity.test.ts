import { describe, expect, it } from 'vitest'
import { similarity } from '../similarity'
import type { Challenge } from '../../types'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 10,
    currentDay: 5,
    memberIds: ['me', 'f1', 'f2', 'f3'],
    ownerId: 'me',
    character: {
      template: 'round',
      color: 'pink',
      parts: { hair: 'f1', eyeL: 'me', eyeR: 'shared', cheek: 'f2', mouth: 'f3' },
      name: '모아',
    },
    checkIns: [],
    status: 'ongoing',
    ...overrides,
  }
}

describe('similarity', () => {
  it('아무도 빠지지 않았으면 100', () => {
    const checkIns = Array.from({ length: 5 }, (_, i) => [
      { userId: 'me', day: i + 1 },
      { userId: 'f1', day: i + 1 },
      { userId: 'f2', day: i + 1 },
      { userId: 'f3', day: i + 1 },
    ]).flat()
    const challenge = makeChallenge({ checkIns })
    expect(similarity(challenge)).toBe(100)
  })

  it('흔적이 쌓일수록 낮아진다', () => {
    const challenge = makeChallenge({ checkIns: [] })
    expect(similarity(challenge)).toBeLessThan(100)
  })
})

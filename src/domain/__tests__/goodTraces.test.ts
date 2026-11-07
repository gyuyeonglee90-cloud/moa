import { describe, expect, it } from 'vitest'
import { goodTraces } from '../goodTraces'
import type { Challenge } from '../../types'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 10,
    currentDay: 3,
    memberIds: ['me', 'f1'],
    ownerId: 'me',
    character: {
      template: 'round',
      color: 'pink',
      parts: { earL: 'f1', earR: 'me', eyes: 'shared', nose: 'f1', tail: 'me' },
      name: '모아',
    },
    checkIns: [],
    status: 'ongoing',
    ...overrides,
  }
}

describe('goodTraces', () => {
  it('전원 인증한 날 수를 센다', () => {
    const challenge = makeChallenge({
      currentDay: 3,
      checkIns: [
        { userId: 'me', day: 1 },
        { userId: 'f1', day: 1 },
        { userId: 'me', day: 2 },
      ],
    })
    expect(goodTraces(challenge)).toBe(1)
  })

  it('최대 7개를 넘지 않는다', () => {
    const checkIns = Array.from({ length: 10 }, (_, i) => [
      { userId: 'me', day: i + 1 },
      { userId: 'f1', day: i + 1 },
    ]).flat()
    const challenge = makeChallenge({ currentDay: 10, totalDays: 10, checkIns })
    expect(goodTraces(challenge)).toBe(7)
  })
})

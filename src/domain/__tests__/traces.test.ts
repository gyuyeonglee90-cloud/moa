import { describe, expect, it } from 'vitest'
import { traceFromMissedCount, traces } from '../traces'
import type { Challenge } from '../../types'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 10,
    currentDay: 3,
    memberIds: ['me', 'f1', 'f2', 'f3'],
    ownerId: 'me',
    character: {
      template: 'round',
      color: 'pink',
      parts: { earL: 'f1', earR: 'me', eyes: 'shared', nose: 'f2', tail: 'f3' },
      name: '모아',
    },
    checkIns: [],
    status: 'ongoing',
    ...overrides,
  }
}

describe('traceFromMissedCount', () => {
  it('0회면 흔적이 없다', () => {
    expect(traceFromMissedCount(0)).toEqual({ scale: 1, rotate: 0, wavy: false })
  })

  it('1회면 크기만 25% 커진다', () => {
    expect(traceFromMissedCount(1)).toEqual({ scale: 1.25, rotate: 0, wavy: false })
  })

  it('2회면 15도 기울어진다', () => {
    expect(traceFromMissedCount(2)).toEqual({ scale: 1.25, rotate: 15, wavy: false })
  })

  it('3회면 물결선이 되고 크기가 조금 더 커진다', () => {
    const result = traceFromMissedCount(3)
    expect(result.wavy).toBe(true)
    expect(result.rotate).toBe(15)
    expect(result.scale).toBeCloseTo(1.35)
  })

  it('크기는 2배를 넘지 않는다', () => {
    expect(traceFromMissedCount(20).scale).toBe(2)
  })
})

describe('traces', () => {
  it('담당자가 못 채운 날 수를 missedCount로 센다', () => {
    const challenge = makeChallenge({
      currentDay: 3,
      checkIns: [{ userId: 'f1', day: 1 }],
    })
    const trace = traces(challenge, 'earL')
    expect(trace.missedCount).toBe(2)
    expect(trace.scale).toBe(1.25)
    expect(trace.rotate).toBe(15)
  })

  it("'shared' 부위는 전원 인증 안 된 날을 missedCount로 센다", () => {
    const challenge = makeChallenge({
      currentDay: 2,
      checkIns: [
        { userId: 'me', day: 1 },
        { userId: 'f1', day: 1 },
        { userId: 'f2', day: 1 },
        { userId: 'f3', day: 1 },
      ],
    })
    const trace = traces(challenge, 'eyes')
    expect(trace.missedCount).toBe(1)
  })
})

import { describe, expect, it } from 'vitest'
import { calcPerfectAttendanceUserId } from '../attendance'
import type { Challenge } from '../../types'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 10,
    currentDay: 5,
    memberIds: ['me', 'f1', 'f2'],
    ownerId: 'me',
    character: { bodyShape: 'round', bodyColor: 'pink', parts: [], name: '모아' },
    checkIns: [],
    status: 'ongoing',
    ...overrides,
  }
}

describe('calcPerfectAttendanceUserId', () => {
  it('가장 많이 인증한 멤버를 반환한다', () => {
    const challenge = makeChallenge({
      checkIns: [
        { userId: 'f1', day: 1 },
        { userId: 'f1', day: 2 },
        { userId: 'f1', day: 3 },
        { userId: 'me', day: 1 },
      ],
    })
    expect(calcPerfectAttendanceUserId(challenge)).toBe('f1')
  })

  it('인증이 없으면 null', () => {
    expect(calcPerfectAttendanceUserId(makeChallenge())).toBeNull()
  })

  it('동률이면 memberIds 순서상 먼저 나온 사람', () => {
    const challenge = makeChallenge({
      checkIns: [
        { userId: 'f2', day: 1 },
        { userId: 'f1', day: 1 },
      ],
    })
    expect(calcPerfectAttendanceUserId(challenge)).toBe('f1')
  })
})

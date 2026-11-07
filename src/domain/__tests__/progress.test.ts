import { describe, expect, it } from 'vitest'
import { bodyFill, partProgress } from '../progress'
import type { Challenge } from '../../types'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 5,
    currentDay: 3,
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

describe('partProgress', () => {
  it('담당자가 인증한 일수 ÷ 기간일수로 계산한다', () => {
    const challenge = makeChallenge({
      checkIns: [
        { userId: 'f1', day: 1 },
        { userId: 'f1', day: 2 },
      ],
    })
    // 2 / 5
    expect(partProgress(challenge, 'hair')).toBe(0.4)
  })

  it("'shared' 부위는 전원 인증한 날만 센다", () => {
    const challenge = makeChallenge({
      checkIns: [
        { userId: 'me', day: 1 },
        { userId: 'f1', day: 1 },
        { userId: 'f2', day: 1 },
        { userId: 'f3', day: 1 },
        { userId: 'me', day: 2 },
      ],
    })
    // day1만 전원 인증 → 1/5
    expect(partProgress(challenge, 'eyeR')).toBe(0.2)
  })

  it('1을 넘지 않는다', () => {
    const challenge = makeChallenge({
      currentDay: 10,
      totalDays: 5,
      checkIns: Array.from({ length: 10 }, (_, i) => ({ userId: 'f1', day: i + 1 })),
    })
    expect(partProgress(challenge, 'hair')).toBe(1)
  })
})

describe('bodyFill', () => {
  it('크루 전체 인증 수 / (인원 x 기간일수)로 계산한다', () => {
    const challenge = makeChallenge({
      checkIns: Array.from({ length: 10 }, (_, i) => ({ userId: 'me', day: i + 1 })),
    })
    // 10 / (4 * 5) = 0.5
    expect(bodyFill(challenge)).toBe(0.5)
  })

  it('인증이 없으면 0', () => {
    expect(bodyFill(makeChallenge())).toBe(0)
  })
})

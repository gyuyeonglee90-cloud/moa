import { describe, expect, it } from 'vitest'
import { calcBestCrewCombo, calcCurrentCrewCombo } from '../combo'
import type { Challenge, CheckIn } from '../../types'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 10,
    currentDay: 5,
    memberIds: ['me', 'f1'],
    ownerId: 'me',
    character: { bodyShape: 'round', bodyColor: 'pink', parts: [], name: '모아' },
    checkIns: [],
    status: 'ongoing',
    ...overrides,
  }
}

function fullDay(day: number): CheckIn[] {
  return [
    { userId: 'me', day },
    { userId: 'f1', day },
  ]
}

describe('calcCurrentCrewCombo', () => {
  it('최근 일차부터 전원 인증이 이어진 날 수를 센다', () => {
    const challenge = makeChallenge({
      currentDay: 3,
      checkIns: [...fullDay(1), ...fullDay(2), ...fullDay(3)],
    })
    expect(calcCurrentCrewCombo(challenge)).toBe(3)
  })

  it('중간에 전원 인증이 끊기면 그 이후만 센다', () => {
    const challenge = makeChallenge({
      currentDay: 3,
      checkIns: [...fullDay(1), { userId: 'me', day: 2 }, ...fullDay(3)],
    })
    expect(calcCurrentCrewCombo(challenge)).toBe(1)
  })

  it('오늘 전원 인증이 안 됐으면 0', () => {
    const challenge = makeChallenge({
      currentDay: 2,
      checkIns: [...fullDay(1)],
    })
    expect(calcCurrentCrewCombo(challenge)).toBe(0)
  })
})

describe('calcBestCrewCombo', () => {
  it('전체 기간 중 가장 길게 이어진 전원 인증 일수를 반환한다', () => {
    const challenge = makeChallenge({
      currentDay: 5,
      checkIns: [...fullDay(1), ...fullDay(2), ...fullDay(4), ...fullDay(5)],
    })
    // 1,2일 콤보(2) vs 4,5일 콤보(2) → 최대 2
    expect(calcBestCrewCombo(challenge)).toBe(2)
  })

  it('인증이 없으면 0', () => {
    expect(calcBestCrewCombo(makeChallenge())).toBe(0)
  })
})

import { describe, expect, it } from 'vitest'
import { calcGrowthStage, calcProgress } from '../progress'
import type { Challenge } from '../../types'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 10,
    currentDay: 5,
    memberIds: ['me', 'f1', 'f2', 'f3', 'f4'],
    ownerId: 'me',
    character: { bodyShape: 'round', bodyColor: 'pink', parts: [], name: '모아' },
    checkIns: [],
    status: 'ongoing',
    ...overrides,
  }
}

describe('calcProgress', () => {
  it('인증이 없으면 0을 반환한다', () => {
    expect(calcProgress(makeChallenge())).toBe(0)
  })

  it('인원 x 기간일수 대비 누적 인증 수로 진행률을 계산한다', () => {
    const challenge = makeChallenge({
      checkIns: Array.from({ length: 25 }, (_, i) => ({ userId: 'me', day: i + 1 })),
    })
    // 25 / (5 * 10) = 0.5
    expect(calcProgress(challenge)).toBe(0.5)
  })

  it('진행률은 1을 넘지 않는다', () => {
    const challenge = makeChallenge({
      checkIns: Array.from({ length: 100 }, (_, i) => ({ userId: 'me', day: i + 1 })),
    })
    expect(calcProgress(challenge)).toBe(1)
  })

  it('인원이 0이면 0을 반환한다', () => {
    expect(calcProgress(makeChallenge({ memberIds: [] }))).toBe(0)
  })
})

describe('calcGrowthStage', () => {
  it('0~19%는 0단계(알)', () => {
    expect(calcGrowthStage(0)).toBe(0)
    expect(calcGrowthStage(0.19)).toBe(0)
  })

  it('20~49%는 1단계(아기)', () => {
    expect(calcGrowthStage(0.2)).toBe(1)
    expect(calcGrowthStage(0.49)).toBe(1)
  })

  it('50~84%는 2단계(성장)', () => {
    expect(calcGrowthStage(0.5)).toBe(2)
    expect(calcGrowthStage(0.84)).toBe(2)
  })

  it('85% 이상은 3단계(완성)', () => {
    expect(calcGrowthStage(0.85)).toBe(3)
    expect(calcGrowthStage(1)).toBe(3)
  })
})

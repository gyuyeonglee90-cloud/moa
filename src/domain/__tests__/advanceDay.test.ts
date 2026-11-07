import { describe, expect, it } from 'vitest'
import { advanceDay } from '../advanceDay'
import type { Challenge } from '../../types'

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 3,
    currentDay: 1,
    memberIds: ['me', 'f1', 'f2'],
    ownerId: 'me',
    character: { bodyShape: 'round', bodyColor: 'pink', parts: [], name: '모아' },
    checkIns: [{ userId: 'me', day: 1 }],
    status: 'ongoing',
    ...overrides,
  }
}

describe('advanceDay', () => {
  it('친구 인증이 모두 성공하면 다음 날로 넘어가고 인증이 추가된다', () => {
    const challenge = makeChallenge()
    const { challenge: result, graduated } = advanceDay(challenge, () => 0)

    expect(graduated).toBe(false)
    expect(result.currentDay).toBe(2)
    expect(result.checkIns.filter((c) => c.day === 1)).toHaveLength(3)
  })

  it('친구 인증이 모두 실패하면 추가되지 않지만 날짜는 넘어간다', () => {
    const challenge = makeChallenge()
    const { challenge: result, graduated } = advanceDay(challenge, () => 0.99)

    expect(graduated).toBe(false)
    expect(result.currentDay).toBe(2)
    expect(result.checkIns.filter((c) => c.day === 1)).toHaveLength(1)
  })

  it('이미 인증한 친구는 중복 생성하지 않는다', () => {
    const challenge = makeChallenge({
      checkIns: [
        { userId: 'me', day: 1 },
        { userId: 'f1', day: 1 },
      ],
    })
    const { challenge: result } = advanceDay(challenge, () => 0)
    expect(result.checkIns.filter((c) => c.userId === 'f1' && c.day === 1)).toHaveLength(1)
  })

  it('마지막 날이 지나면 졸업 처리하고 결과를 계산한다', () => {
    const challenge = makeChallenge({ currentDay: 3 })
    const { challenge: result, graduated } = advanceDay(challenge, () => 0)

    expect(graduated).toBe(true)
    expect(result.status).toBe('graduated')
    expect(result.currentDay).toBe(3)
    expect(result.graduationResult).toBeDefined()
    expect(result.graduationResult?.totalCheckIns).toBe(result.checkIns.length)
  })

  it('이미 졸업한 챌린지는 변화 없다', () => {
    const challenge = makeChallenge({ status: 'graduated' })
    const { challenge: result, graduated } = advanceDay(challenge, () => 0)
    expect(graduated).toBe(false)
    expect(result).toBe(challenge)
  })
})

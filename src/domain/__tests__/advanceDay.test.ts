import { describe, expect, it } from 'vitest'
import { advanceDay } from '../advanceDay'
import type { Challenge, User } from '../../types'

const users: User[] = [
  { id: 'me', nickname: '나', emoji: '🙂' },
  { id: 'f1', nickname: '서준', emoji: '🐥' },
  { id: 'f2', nickname: '민지', emoji: '🐻' },
]

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 3,
    currentDay: 1,
    memberIds: ['me', 'f1', 'f2'],
    ownerId: 'me',
    character: {
      template: 'round',
      color: 'pink',
      parts: { earL: 'f1', earR: 'me', eyes: 'shared', nose: 'f2', tail: 'f1' },
      name: '모아',
    },
    checkIns: [{ userId: 'me', day: 1 }],
    status: 'ongoing',
    ...overrides,
  }
}

describe('advanceDay', () => {
  it('친구 인증이 모두 성공하면 다음 날로 넘어가고 인증이 추가된다', () => {
    const challenge = makeChallenge()
    const { challenge: result, completed } = advanceDay(challenge, users, () => 0)

    expect(completed).toBe(false)
    expect(result.currentDay).toBe(2)
    expect(result.checkIns.filter((c) => c.day === 1)).toHaveLength(3)
  })

  it('친구 인증이 모두 실패하면 추가되지 않지만 날짜는 넘어간다', () => {
    const challenge = makeChallenge()
    const { challenge: result, completed } = advanceDay(challenge, users, () => 0.99)

    expect(completed).toBe(false)
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
    const { challenge: result } = advanceDay(challenge, users, () => 0)
    expect(result.checkIns.filter((c) => c.userId === 'f1' && c.day === 1)).toHaveLength(1)
  })

  it('마지막 날이 지나면 완성 처리하고 결과를 계산한다', () => {
    const challenge = makeChallenge({ currentDay: 3 })
    const { challenge: result, completed } = advanceDay(challenge, users, () => 0)

    expect(completed).toBe(true)
    expect(result.status).toBe('completed')
    expect(result.currentDay).toBe(3)
    expect(result.completionResult).toBeDefined()
    expect(result.completionResult?.totalCheckIns).toBe(result.checkIns.length)
    expect(result.completionResult?.partTraces).toHaveLength(5)
  })

  it('이미 완성된 챌린지는 변화 없다', () => {
    const challenge = makeChallenge({ status: 'completed' })
    const { challenge: result, completed } = advanceDay(challenge, users, () => 0)
    expect(completed).toBe(false)
    expect(result).toBe(challenge)
  })
})

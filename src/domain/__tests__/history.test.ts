import { describe, expect, it } from 'vitest'
import { history } from '../history'
import type { Challenge, User } from '../../types'

const users: User[] = [
  { id: 'me', nickname: '나', emoji: '🙂' },
  { id: 'f1', nickname: '서준', emoji: '🐥' },
  { id: 'f2', nickname: '민지', emoji: '🐻' },
  { id: 'f3', nickname: '지우', emoji: '🐰' },
]

function makeChallenge(overrides: Partial<Challenge> = {}): Challenge {
  return {
    id: 'c1',
    title: '테스트 챌린지',
    totalDays: 10,
    currentDay: 1,
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

describe('history', () => {
  it("'실패', '벌칙'이라는 말을 쓰지 않는다", () => {
    const challenge = makeChallenge({ currentDay: 3, checkIns: [] })
    const events = history(challenge, users)
    for (const event of events) {
      expect(event.message).not.toContain('실패')
      expect(event.message).not.toContain('벌칙')
    }
  })

  it('담당자가 못 채운 날은 그 사람 이름이 담긴 흔적 이벤트를 남긴다', () => {
    const challenge = makeChallenge({ currentDay: 1, checkIns: [] })
    const events = history(challenge, users)
    const hairEvent = events.find((e) => e.partId === 'hair')
    expect(hairEvent?.message).toContain('서준')
    expect(hairEvent?.day).toBe(1)
  })

  it('전원 인증한 날은 good 이벤트를 남긴다', () => {
    const challenge = makeChallenge({
      currentDay: 1,
      checkIns: [
        { userId: 'me', day: 1 },
        { userId: 'f1', day: 1 },
        { userId: 'f2', day: 1 },
        { userId: 'f3', day: 1 },
      ],
    })
    const events = history(challenge, users)
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('good')
  })
})

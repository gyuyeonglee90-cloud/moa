import type { Challenge, HistoryEvent, PartId, User } from '../types'
import { PART_IDS } from '../types'
import { getPartOwner, isFullAttendanceDay, isPartCheckedInOnDay } from './attendance'
import { PART_LABELS } from './constants'

function nicknameOf(users: User[], userId: string): string {
  return users.find((u) => u.id === userId)?.nickname ?? userId
}

function traceMessage(partLabel: string, who: string, missedCount: number): string {
  if (missedCount === 1) return `${who} 쉬어간 날 → ${partLabel}이 25% 커졌어요`
  if (missedCount === 2) return `${who} 또 쉬어간 날 → ${partLabel}이 15도 기울어졌어요`
  if (missedCount === 3) return `${who} 또 쉬어간 날 → ${partLabel}의 선이 물결 모양이 되었어요`
  return `${who} 또 쉬어간 날 → ${partLabel}이 조금 더 커졌어요`
}

/** 일자별 흔적/좋은 흔적 이벤트를 다정한 문구와 함께 시간순으로 만든다 */
export function history(challenge: Challenge, users: User[]): HistoryEvent[] {
  const events: HistoryEvent[] = []
  const missedCountByPart: Record<PartId, number> = {
    hair: 0,
    eyeL: 0,
    eyeR: 0,
    cheek: 0,
    mouth: 0,
  }

  for (let day = 1; day <= challenge.currentDay; day++) {
    for (const partId of PART_IDS) {
      if (isPartCheckedInOnDay(challenge, partId, day)) continue

      missedCountByPart[partId] += 1
      const owner = getPartOwner(challenge, partId)
      const who = owner === 'shared' ? '다 같이' : `${nicknameOf(users, owner)}가`
      const partLabel = PART_LABELS[partId]

      events.push({
        day,
        type: 'trace',
        partId,
        userId: owner === 'shared' ? undefined : owner,
        message: `${day}일차 · ${traceMessage(partLabel, who, missedCountByPart[partId])}`,
      })
    }

    if (isFullAttendanceDay(challenge, day)) {
      events.push({
        day,
        type: 'good',
        message: `${day}일차 · 크루 전원 인증 → 반짝이가 떴어요!`,
      })
    }
  }

  return events
}

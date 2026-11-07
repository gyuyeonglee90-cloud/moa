import type { Challenge, PartId, PartTrace } from '../types'
import { countPartCheckedInDays } from './attendance'

/**
 * 누적 미인증 횟수 → 흔적(크기/기울기/물결선) 변환 (PRD 5-3)
 * 1회: 크기 +25% · 2회: + 15도 기울어짐 · 3회 이상: 선이 물결로 바뀌고, 그 이후 1회마다 크기 +10%(최대 2배)
 */
export function traceFromMissedCount(missedCount: number): Omit<PartTrace, 'partId' | 'missedCount'> {
  if (missedCount <= 0) {
    return { scale: 1, rotate: 0, wavy: false }
  }

  const scaleAfterFirstMiss = 1.25
  const rotate = missedCount >= 2 ? 15 : 0
  const wavy = missedCount >= 3

  if (missedCount < 3) {
    return { scale: scaleAfterFirstMiss, rotate, wavy }
  }

  const extraMisses = missedCount - 2
  const scale = Math.min(2, scaleAfterFirstMiss + 0.1 * extraMisses)
  return { scale, rotate, wavy }
}

/** 특정 부위의 지금까지 누적 미인증 횟수와 흔적 상태 */
export function traces(challenge: Challenge, partId: PartId): PartTrace {
  const checkedInDays = countPartCheckedInDays(challenge, partId)
  const missedCount = Math.max(0, challenge.currentDay - checkedInDays)
  return { partId, missedCount, ...traceFromMissedCount(missedCount) }
}

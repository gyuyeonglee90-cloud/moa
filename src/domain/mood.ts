import type { Challenge, Mood } from '../types'

/** 특정 일차에 인증한 크루 비율로 그날의 기분을 결정한다 */
export function calcMood(challenge: Challenge, day: number): Mood {
  const memberCount = challenge.memberIds.length
  if (memberCount === 0) return 'low'

  const checkedInCount = challenge.checkIns.filter((c) => c.day === day).length
  const rate = checkedInCount / memberCount

  if (rate >= 1) return 'great'
  if (rate >= 0.5) return 'okay'
  return 'low'
}

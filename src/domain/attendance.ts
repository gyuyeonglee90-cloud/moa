import type { Challenge } from '../types'

/** 가장 많이 인증한 멤버의 userId를 반환한다(개근상). 동률이면 멤버 목록 순서상 먼저 나온 사람, 인증이 하나도 없으면 null */
export function calcPerfectAttendanceUserId(challenge: Challenge): string | null {
  if (challenge.checkIns.length === 0) return null

  let bestUserId: string | null = null
  let bestCount = 0

  for (const userId of challenge.memberIds) {
    const count = challenge.checkIns.filter((c) => c.userId === userId).length
    if (count > bestCount) {
      bestCount = count
      bestUserId = userId
    }
  }

  return bestUserId
}

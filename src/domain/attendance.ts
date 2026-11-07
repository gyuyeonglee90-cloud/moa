import type { Challenge, PartId, PartOwner } from '../types'

export function getPartOwner(challenge: Challenge, partId: PartId): PartOwner {
  return challenge.character.parts[partId]
}

/** 해당 일차에 크루 전원이 인증했는지 */
export function isFullAttendanceDay(challenge: Challenge, day: number): boolean {
  const memberCount = challenge.memberIds.length
  if (memberCount === 0) return false
  const checkedInCount = challenge.checkIns.filter((c) => c.day === day).length
  return checkedInCount >= memberCount
}

/** 해당 일차에 그 부위가 그려졌는지(담당자가 인증, 공동이면 전원 인증) */
export function isPartCheckedInOnDay(challenge: Challenge, partId: PartId, day: number): boolean {
  const owner = getPartOwner(challenge, partId)
  if (owner === 'shared') return isFullAttendanceDay(challenge, day)
  return challenge.checkIns.some((c) => c.userId === owner && c.day === day)
}

/** 지금까지(1~currentDay) 그 부위가 그려진 일수 */
export function countPartCheckedInDays(challenge: Challenge, partId: PartId): number {
  let count = 0
  for (let day = 1; day <= challenge.currentDay; day++) {
    if (isPartCheckedInOnDay(challenge, partId, day)) count++
  }
  return count
}

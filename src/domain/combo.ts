import type { Challenge } from '../types'

function isFullAttendanceDay(challenge: Challenge, day: number): boolean {
  const memberCount = challenge.memberIds.length
  if (memberCount === 0) return false
  const checkedInCount = challenge.checkIns.filter((c) => c.day === day).length
  return checkedInCount >= memberCount
}

/** 가장 최근 일차(currentDay)부터 거슬러 올라가며 전원 인증이 끊기지 않은 연속 일수 */
export function calcCurrentCrewCombo(challenge: Challenge): number {
  let combo = 0
  for (let day = challenge.currentDay; day >= 1; day--) {
    if (!isFullAttendanceDay(challenge, day)) break
    combo++
  }
  return combo
}

/** 챌린지 전체 기간 중 전원 인증이 연속된 최장 일수 */
export function calcBestCrewCombo(challenge: Challenge): number {
  let best = 0
  let current = 0
  for (let day = 1; day <= challenge.currentDay; day++) {
    if (isFullAttendanceDay(challenge, day)) {
      current++
      best = Math.max(best, current)
    } else {
      current = 0
    }
  }
  return best
}

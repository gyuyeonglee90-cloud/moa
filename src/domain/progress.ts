import type { Challenge, PartId } from '../types'
import { countPartCheckedInDays } from './attendance'

/** 부위가 목표만큼 그려진 비율 = 담당자 인증 일수 ÷ 기간(totalDays), 0~1 */
export function partProgress(challenge: Challenge, partId: PartId): number {
  if (challenge.totalDays === 0) return 0
  const checkedInDays = countPartCheckedInDays(challenge, partId)
  return Math.min(1, checkedInDays / challenge.totalDays)
}

/** 몸통 색이 차오르는 비율 = 크루 전체 누적 인증 수 / (인원 x 기간일수), 0~1 */
export function bodyFill(challenge: Challenge): number {
  const denominator = challenge.memberIds.length * challenge.totalDays
  if (denominator === 0) return 0
  return Math.min(1, challenge.checkIns.length / denominator)
}

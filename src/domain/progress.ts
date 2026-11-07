import type { Challenge, GrowthStage } from '../types'

/** 진행률 = 크루 전체 누적 인증 수 / (인원 × 기간일수), 0~1 범위로 클램프 */
export function calcProgress(challenge: Challenge): number {
  const denominator = challenge.memberIds.length * challenge.totalDays
  if (denominator === 0) return 0
  const progress = challenge.checkIns.length / denominator
  return Math.min(1, Math.max(0, progress))
}

/** 진행률(0~1)로 성장 단계(0~3)를 결정한다 */
export function calcGrowthStage(progress: number): GrowthStage {
  const percent = progress * 100
  if (percent >= 85) return 3
  if (percent >= 50) return 2
  if (percent >= 20) return 1
  return 0
}

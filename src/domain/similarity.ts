import type { Challenge } from '../types'
import { PART_IDS } from '../types'
import { traces } from './traces'

/** 부위 하나의 감점 = (scale-1)x100 + (기울어졌으면 10) + (물결이면 15) (PRD 5-3, PO 승인) */
export function partDeduction(trace: { scale: number; rotate: number; wavy: boolean }): number {
  const scaleDeduction = (trace.scale - 1) * 100
  const rotateDeduction = trace.rotate !== 0 ? 10 : 0
  const wavyDeduction = trace.wavy ? 15 : 0
  return scaleDeduction + rotateDeduction + wavyDeduction
}

/** 흔적이 없을수록 100%에 가까운 '목표와 닮은 정도' (평가가 아니라 표시용) */
export function similarity(challenge: Challenge): number {
  const deductions = PART_IDS.map((partId) => partDeduction(traces(challenge, partId)))
  const averageDeduction = deductions.reduce((sum, d) => sum + d, 0) / deductions.length
  return Math.max(0, Math.round(100 - averageDeduction))
}

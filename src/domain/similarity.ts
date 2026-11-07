import type { Challenge } from '../types'
import { PART_IDS } from '../types'
import { traces } from './traces'

const MAX_SCALE_DEVIATION = 1 // scale 1(원본) ~ 2(최대) 사이의 폭

/** 흔적이 없을수록 100%에 가까운 '목표와 닮은 정도' (평가가 아니라 표시용) */
export function similarity(challenge: Challenge): number {
  const deviations = PART_IDS.map((partId) => {
    const trace = traces(challenge, partId)
    return Math.min(1, Math.max(0, (trace.scale - 1) / MAX_SCALE_DEVIATION))
  })
  const averageDeviation = deviations.reduce((sum, d) => sum + d, 0) / deviations.length
  return Math.round(100 * (1 - averageDeviation))
}

import type { Challenge, PartId } from '../types'
import { PART_IDS } from '../types'
import { partProgress } from './progress'
import { traces } from './traces'

export interface PartVisualState {
  /** 0~1, 미완성 부위는 고스트로 보이다가 이 값만큼 또렷해진다 */
  progress: number
  /** 1 = 원래 크기, 흔적이 쌓이면 커진다 */
  scale: number
  /** deg, 흔적(2회 이상)으로 생기는 기울어짐 */
  rotate: number
  /** 흔적(3회 이상)으로 선/표면이 물결처럼 바뀌는지 */
  wavy: boolean
}

export type PartVisualMap = Record<PartId, PartVisualState>

/** Challenge 상태로 Character3D에 그대로 넘길 부위별 시각 상태를 만든다 */
export function buildPartVisualMap(challenge: Challenge): PartVisualMap {
  const map = {} as PartVisualMap
  for (const partId of PART_IDS) {
    const trace = traces(challenge, partId)
    map[partId] = {
      progress: partProgress(challenge, partId),
      scale: trace.scale,
      rotate: trace.rotate,
      wavy: trace.wavy,
    }
  }
  return map
}

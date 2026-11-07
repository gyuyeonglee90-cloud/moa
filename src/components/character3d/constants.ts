import type { PartId } from '../../types'

export type PartShape = 'line' | 'blob'

export const PART_SHAPE: Record<PartId, PartShape> = {
  hair: 'line',
  mouth: 'line',
  eyeL: 'blob',
  eyeR: 'blob',
  cheek: 'blob',
}

/** 몸통(반지름 1 구) 표면 기준 임시 배치 좌표 */
export const PART_POSITION: Record<PartId, [number, number, number]> = {
  hair: [0, 0.95, 0.15],
  eyeL: [-0.35, 0.25, 0.85],
  eyeR: [0.35, 0.25, 0.85],
  cheek: [0, -0.05, 0.95],
  mouth: [0, -0.35, 0.85],
}

export const PART_IDS_ORDER: PartId[] = ['hair', 'eyeL', 'eyeR', 'cheek', 'mouth']

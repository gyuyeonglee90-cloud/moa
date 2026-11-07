import type { PartId } from '../../types'

export type PartShape = 'line' | 'blob'

export const PART_SHAPE: Record<PartId, PartShape> = {
  hair: 'line',
  mouth: 'line',
  eyeL: 'blob',
  eyeR: 'blob',
  cheek: 'blob',
}

/**
 * 몸통(반지름 1 구) 표면 기준 임시 배치 좌표.
 * 몸통 표면(반지름 1)보다 살짝 바깥(약 1.15배)에 둬서, 포인터 레이캐스트가
 * 몸통보다 부위를 먼저 맞히게 한다 — 부위 탭과 몸통 드래그를 구분하는 전제조건.
 */
export const PART_POSITION: Record<PartId, [number, number, number]> = {
  hair: [0, 1.09, 0.17],
  eyeL: [-0.4, 0.29, 0.98],
  eyeR: [0.4, 0.29, 0.98],
  cheek: [0, -0.06, 1.09],
  mouth: [0, -0.4, 0.98],
}

export const PART_IDS_ORDER: PartId[] = ['hair', 'eyeL', 'eyeR', 'cheek', 'mouth']

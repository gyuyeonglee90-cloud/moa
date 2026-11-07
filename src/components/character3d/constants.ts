import type { PartId } from '../../types'

/** D26: 아기 동물 부위별 임시 지오메트리 종류 */
export type PartShape = 'ear' | 'eyes' | 'nose' | 'tail'

export const PART_SHAPE: Record<PartId, PartShape> = {
  earL: 'ear',
  earR: 'ear',
  eyes: 'eyes',
  nose: 'nose',
  tail: 'tail',
}

/**
 * 몸통(반지름 1 구) 표면 기준 임시 배치 좌표(각 부위의 기준점/뿌리).
 * 몸통 표면(반지름 1)보다 살짝 바깥에 둬서, 포인터 레이캐스트가
 * 몸통보다 부위를 먼저 맞히게 한다 — 부위 탭과 몸통 드래그를 구분하는 전제조건.
 */
export const PART_POSITION: Record<PartId, [number, number, number]> = {
  earL: [-0.45, 1.0, 0.1],
  earR: [0.45, 1.0, 0.1],
  eyes: [0, 0.25, 1.05],
  nose: [0, -0.1, 1.1],
  tail: [0, -0.25, -1.08], // 엉덩이 뒤(몸통 반대쪽)
}

export const PART_IDS_ORDER: PartId[] = ['earL', 'earR', 'eyes', 'nose', 'tail']

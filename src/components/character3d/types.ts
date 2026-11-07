import type { BodyColor, PartId, Template } from '../../types'
import type { PartVisualMap } from '../../domain/characterVisual'

export type { PartVisualState, PartVisualMap } from '../../domain/characterVisual'

export interface Character3DProps {
  template: Template
  color: BodyColor
  parts: PartVisualMap
  /** 0~1, 몸통 색이 아래에서 위로 차오르는 비율 */
  bodyFill: number
  /** 0~7, 전원 인증한 날 수(좋은 흔적) */
  sparkles: number
  onPartTap?: (part: PartId) => void
  ariaLabel: string
  className?: string
}

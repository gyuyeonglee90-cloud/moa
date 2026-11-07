import { BODY_COLOR_HEX } from '../../domain/characterColor'
import type { Character3DProps } from './types'

type Props = Pick<Character3DProps, 'color' | 'bodyFill' | 'className'>

/**
 * WebGL을 쓸 수 없거나 prefers-reduced-motion일 때, 그리고 목록/도감 썸네일에서 쓰는
 * 2D 정지 이미지 대체. 실제 지오메트리가 확정되면 캔버스 캡처(toDataURL)로 교체할 수 있다.
 */
export default function StaticThumbnail({ color, bodyFill, className }: Props) {
  const hex = BODY_COLOR_HEX[color]
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f1f1f4',
        borderRadius: '50%',
      }}
    >
      <div
        style={{
          width: '70%',
          height: '70%',
          borderRadius: '50%',
          background: `linear-gradient(to top, ${hex} ${Math.round(bodyFill * 100)}%, #f1f1f4 ${Math.round(
            bodyFill * 100,
          )}%)`,
        }}
      />
    </div>
  )
}

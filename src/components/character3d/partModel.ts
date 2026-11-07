import { useMemo } from 'react'
import * as THREE from 'three'
import type { PartId, Template } from '../../types'
import { PART_SHAPE } from './constants'

export interface PartSubShape {
  /** 부위 기준점(PART_POSITION)에서의 로컬 오프셋 */
  position: [number, number, number]
  geometry: THREE.BufferGeometry
  /** 지정하면 그 부위 전용 색(예: 눈의 검정)을 쓰고, 없으면 몸통 색을 그대로 쓴다 */
  color?: string
}

function seedOf(partId: PartId): number {
  return Array.from(partId).reduce((sum, c) => sum + c.charCodeAt(0), 0)
}

function applyBump(geometry: THREE.BufferGeometry, seed: number, amount = 0.15): THREE.BufferGeometry {
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const y = position.getY(i)
    const z = position.getZ(i)
    const bump = 1 + amount * Math.sin(seed + i * 1.3)
    position.setXYZ(i, x * bump, y * bump, z * bump)
  }
  geometry.computeVertexNormals()
  return geometry
}

function buildCurveGeometry(wavy: boolean, seed: number, length: number, radius: number): THREE.TubeGeometry {
  const points: THREE.Vector3[] = []
  const segments = 12
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = (t - 0.5) * length
    const y = wavy ? Math.sin(t * Math.PI * 3 + seed) * 0.05 : 0
    points.push(new THREE.Vector3(x, y, 0))
  }
  const curve = new THREE.CatmullRomCurve3(points)
  return new THREE.TubeGeometry(curve, 24, radius, 8, false)
}

/**
 * 부위 지오메트리의 단일 교체 지점.
 *
 * TODO(모델 교체): VARCO 3D에서 만든 귀/꼬리/눈/코·입 GLB가 들어오면, 이 함수 내부의
 * 각 분기(shape별 builder)만 `useGLTF`로 로드한 지오메트리로 바꾼다. 호출하는 쪽
 * (`PartMesh`)은 "부위마다 로컬 오프셋을 가진 서브 메시 배열"이라는 반환 계약만
 * 지키면 수정할 필요가 없다.
 */
export function usePartGeometry(partId: PartId, _template: Template, wavy: boolean): PartSubShape[] {
  const shape = PART_SHAPE[partId]
  const seed = seedOf(partId)

  return useMemo(() => {
    switch (shape) {
      case 'ear': {
        const geometry = applyBump(new THREE.ConeGeometry(0.12, 0.26, 10), seed, wavy ? 0.25 : 0)
        return [{ position: [0, 0.13, 0], geometry }]
      }
      case 'eyes': {
        const makeEye = () => applyBump(new THREE.SphereGeometry(0.07, 16, 16), seed, wavy ? 0.2 : 0)
        return [
          { position: [-0.13, 0, 0], geometry: makeEye(), color: '#111111' },
          { position: [0.13, 0, 0], geometry: makeEye(), color: '#111111' },
        ]
      }
      case 'nose': {
        const noseGeometry = applyBump(new THREE.SphereGeometry(0.08, 14, 14), seed, wavy ? 0.2 : 0)
        const mouthGeometry = buildCurveGeometry(wavy, seed, 0.3, 0.025)
        return [
          { position: [0, 0.05, 0.02], geometry: noseGeometry },
          { position: [0, -0.12, 0], geometry: mouthGeometry },
        ]
      }
      case 'tail': {
        const geometry = applyBump(new THREE.IcosahedronGeometry(0.16, wavy ? 2 : 3), seed, wavy ? 0.18 : 0)
        return [{ position: [0, 0, 0], geometry }]
      }
    }
  }, [shape, seed, wavy])
}

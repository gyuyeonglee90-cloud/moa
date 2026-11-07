import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PartId, Template } from '../../types'
import { PART_POSITION } from './constants'
import { usePartGeometry } from './partModel'
import type { PartVisualState } from './types'

interface PartMeshProps {
  partId: PartId
  template: Template
  color: string
  state: PartVisualState
  onTap?: (part: PartId) => void
}

const SHAKE_DURATION = 0.5

export default function PartMesh({ partId, template, color, state, onTap }: PartMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const tapTimeRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)

  const position = PART_POSITION[partId]
  const subShapes = usePartGeometry(partId, template, state.wavy)

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return

    elapsedRef.current = clock.elapsedTime
    let shakeZ = 0
    if (tapTimeRef.current !== null) {
      const elapsed = clock.elapsedTime - tapTimeRef.current
      if (elapsed < SHAKE_DURATION) {
        const decay = 1 - elapsed / SHAKE_DURATION
        shakeZ = Math.sin(elapsed * 40) * 0.25 * decay
      } else {
        tapTimeRef.current = null
      }
    }

    group.rotation.z = (state.rotate * Math.PI) / 180 + shakeZ
    group.scale.setScalar(state.scale)

    for (const subGroup of group.children) {
      const solid = subGroup.children[0] as THREE.Mesh | undefined
      const ghost = subGroup.children[1] as THREE.Mesh | undefined
      if (solid) {
        const material = solid.material as THREE.MeshStandardMaterial
        material.opacity = 0.15 + 0.85 * state.progress
      }
      if (ghost) {
        const material = ghost.material as THREE.MeshBasicMaterial
        material.opacity = (1 - state.progress) * 0.5
      }
    }
  })

  function handlePointerDown(e: { stopPropagation: () => void }) {
    // 부위에서 포인터 이벤트를 먼저 가로채서 몸통 쪽 드래그/탭 판정으로 번지지 않게 한다.
    // 실제 3D 모델(GLB)로 교체해도 부위 메시가 이 핸들러를 그대로 들고 있으면 구조가 유지된다.
    e.stopPropagation()
    tapTimeRef.current = elapsedRef.current
    onTap?.(partId)
  }

  return (
    <group ref={groupRef} position={position}>
      {subShapes.map((sub, i) => (
        <group key={i} position={sub.position}>
          <mesh geometry={sub.geometry} onPointerDown={handlePointerDown}>
            <meshStandardMaterial color={sub.color ?? color} transparent roughness={0.5} />
          </mesh>
          <mesh geometry={sub.geometry} scale={1.05}>
            <meshBasicMaterial color={sub.color ?? color} wireframe transparent />
          </mesh>
        </group>
      ))}
    </group>
  )
}

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Template } from '../../types'

interface BodyMeshProps {
  color: string
  template: Template
  bodyFill: number
  /** 몸통을 탭했을 때 외부(Scene)에서 1을 써주면 그 프레임에 스쿼시가 시작된다 */
  squashKickRef: { current: number }
}

/** 템플릿별 몸통 비율(디자인 확정 전 임시 값) */
const TEMPLATE_SCALE: Record<Template, [number, number, number]> = {
  round: [1, 1, 1],
  soft: [1.05, 0.95, 1.05],
  chubby: [1.1, 1.05, 1.1],
}

export default function BodyMesh({ color, template, bodyFill, squashKickRef }: BodyMeshProps) {
  const unfilledRef = useRef<THREE.Mesh>(null)
  const filledRef = useRef<THREE.Mesh>(null)

  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), 0), [])

  const breathPhase = useRef(0)
  const squash = useRef(1)
  const squashVelocity = useRef(0)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30)

    if (squashKickRef.current !== 0) {
      squashVelocity.current += squashKickRef.current
      squashKickRef.current = 0
    }
    squashVelocity.current += (-(squash.current - 1) * 60 - squashVelocity.current * 9) * dt
    squash.current += squashVelocity.current * dt

    breathPhase.current += dt * 1.6

    const thresholdY = -1 + 2 * bodyFill
    clipPlane.constant = thresholdY

    const breathe = 1 + Math.sin(breathPhase.current) * 0.02
    const scaleY = breathe * squash.current
    const scaleXZ = breathe * (2 - squash.current)

    for (const ref of [unfilledRef, filledRef]) {
      const mesh = ref.current
      if (!mesh) continue
      mesh.scale.set(scaleXZ, scaleY, scaleXZ)
    }
  })

  const [sx, sy, sz] = TEMPLATE_SCALE[template]

  return (
    <group scale={[sx, sy, sz]}>
      <mesh ref={unfilledRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#f1f1f4" roughness={0.9} />
      </mesh>
      <mesh ref={filledRef}>
        <sphereGeometry args={[1.001, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.6}
          clippingPlanes={[clipPlane]}
          clipShadows
        />
      </mesh>
    </group>
  )
}

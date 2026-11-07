import { useEffect, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { PartId } from '../../types'
import { BODY_COLOR_HEX } from '../../domain/characterColor'
import { PART_IDS_ORDER } from './constants'
import type { Character3DProps } from './types'
import BodyMesh from './BodyMesh'
import PartMesh from './PartMesh'
import Sparkles from './Sparkles'

const DRAG_TAP_THRESHOLD = 6 // px, 이보다 적게 움직이면 드래그가 아니라 탭
const ROTATE_SPRING = 2.5
const ROTATE_DAMPING = 2.2
const DRAG_SENSITIVITY = 0.008

type Props = Pick<Character3DProps, 'template' | 'color' | 'parts' | 'bodyFill' | 'sparkles' | 'onPartTap'>

export default function Scene({ template, color, parts, bodyFill, sparkles, onPartTap }: Props) {
  const { pointer } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  const rotationY = useRef(0)
  const rotationVelocity = useRef(0)
  const dragging = useRef(false)
  const dragMoved = useRef(0)
  const lastX = useRef(0)

  const squashKickRef = useRef(0)

  const tiltX = useRef(0)
  const tiltZ = useRef(0)

  // 몸통(부위가 아닌 영역)을 눌렀을 때만 드래그/탭이 시작된다.
  // 부위는 PartMesh의 onPointerDown에서 stopPropagation()으로 이 핸들러에 닿지 못하게 막는다.
  function handleBodyPointerDown(e: ThreeEvent<PointerEvent>) {
    dragging.current = true
    dragMoved.current = 0
    lastX.current = e.clientX
  }

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!dragging.current) return
      const x = e.clientX
      const delta = x - lastX.current
      lastX.current = x
      dragMoved.current += Math.abs(delta)
      rotationY.current += delta * DRAG_SENSITIVITY
      rotationVelocity.current = delta * DRAG_SENSITIVITY * 12
    }

    function onPointerUp() {
      if (dragging.current && dragMoved.current < DRAG_TAP_THRESHOLD) {
        // 드래그 없이 몸통만 눌렀다 뗐으면 탭으로 간주해 말랑하게 반응한다
        squashKickRef.current -= 0.9
      }
      dragging.current = false
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30)

    // 회전: 드래그 중이 아니면 관성으로 돌다가 원위치(0)로 스프링처럼 돌아온다
    if (!dragging.current) {
      rotationVelocity.current +=
        (-rotationY.current * ROTATE_SPRING - rotationVelocity.current * ROTATE_DAMPING) * dt
      rotationY.current += rotationVelocity.current * dt
    }

    // 포인터를 따라 살짝 기울어진다(시선이 따라오는 느낌)
    tiltX.current = THREE.MathUtils.lerp(tiltX.current, pointer.y * 0.12, 0.05)
    tiltZ.current = THREE.MathUtils.lerp(tiltZ.current, pointer.x * 0.1, 0.05)

    const group = groupRef.current
    if (group) {
      group.rotation.y = rotationY.current
      group.rotation.x = tiltX.current
      group.rotation.z = tiltZ.current
    }
  })

  const partColor = BODY_COLOR_HEX[color]

  return (
    <group ref={groupRef}>
      <BodyMesh
        color={BODY_COLOR_HEX[color]}
        template={template}
        bodyFill={bodyFill}
        squashKickRef={squashKickRef}
        onPointerDown={handleBodyPointerDown}
      />
      {PART_IDS_ORDER.map((partId: PartId) => (
        <PartMesh key={partId} partId={partId} color={partColor} state={parts[partId]} onTap={onPartTap} />
      ))}
      <Sparkles count={sparkles} />
    </group>
  )
}

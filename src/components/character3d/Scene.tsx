import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
  const { gl, pointer } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  const rotationY = useRef(0)
  const rotationVelocity = useRef(0)
  const dragging = useRef(false)
  const dragMoved = useRef(0)
  const lastX = useRef(0)

  const squashKickRef = useRef(0)
  const partTappedRecently = useRef(false)

  const tiltX = useRef(0)
  const tiltZ = useRef(0)

  function handlePartTap(partId: PartId) {
    partTappedRecently.current = true
    onPartTap?.(partId)
  }

  useEffect(() => {
    const dom = gl.domElement

    function onPointerDown(e: PointerEvent) {
      dragging.current = true
      dragMoved.current = 0
      lastX.current = e.clientX
    }

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
      // 드래그가 거의 없고 방금 부위를 탭한 것도 아니면 몸통 탭으로 간주해 말랑하게 반응
      if (dragging.current && dragMoved.current < DRAG_TAP_THRESHOLD && !partTappedRecently.current) {
        squashKickRef.current -= 0.9
      }
      partTappedRecently.current = false
      dragging.current = false
    }

    dom.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      dom.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [gl])

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
      />
      {PART_IDS_ORDER.map((partId: PartId) => (
        <PartMesh
          key={partId}
          partId={partId}
          color={partColor}
          state={parts[partId]}
          onTap={handlePartTap}
        />
      ))}
      <Sparkles count={sparkles} />
    </group>
  )
}

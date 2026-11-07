import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PartId } from '../../types'
import { PART_POSITION, PART_SHAPE } from './constants'
import type { PartVisualState } from './types'

interface PartMeshProps {
  partId: PartId
  color: string
  state: PartVisualState
  onTap?: (part: PartId) => void
}

const SHAKE_DURATION = 0.5

function buildLineGeometry(wavy: boolean, seed: number): THREE.TubeGeometry {
  const points: THREE.Vector3[] = []
  const length = 0.5
  const segments = 12
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = (t - 0.5) * length
    const y = wavy ? Math.sin(t * Math.PI * 3 + seed) * 0.06 : 0
    points.push(new THREE.Vector3(x, y, 0))
  }
  const curve = new THREE.CatmullRomCurve3(points)
  return new THREE.TubeGeometry(curve, 24, 0.035, 8, false)
}

function buildBlobGeometry(wavy: boolean, seed: number): THREE.IcosahedronGeometry {
  const geometry = new THREE.IcosahedronGeometry(0.16, wavy ? 2 : 3)
  if (wavy) {
    const position = geometry.attributes.position
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const y = position.getY(i)
      const z = position.getZ(i)
      const bump = 1 + 0.15 * Math.sin(seed + i * 1.3)
      position.setXYZ(i, x * bump, y * bump, z * bump)
    }
    geometry.computeVertexNormals()
  }
  return geometry
}

export default function PartMesh({ partId, color, state, onTap }: PartMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ghostRef = useRef<THREE.Mesh>(null)
  const tapTimeRef = useRef<number | null>(null)
  const elapsedRef = useRef(0)

  const shape = PART_SHAPE[partId]
  const position = PART_POSITION[partId]
  const seed = useMemo(() => Array.from(partId).reduce((sum, c) => sum + c.charCodeAt(0), 0), [partId])

  const geometry = useMemo(
    () => (shape === 'line' ? buildLineGeometry(state.wavy, seed) : buildBlobGeometry(state.wavy, seed)),
    [shape, state.wavy, seed],
  )

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    const ghost = ghostRef.current
    if (!mesh || !ghost) return

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

    mesh.rotation.z = (state.rotate * Math.PI) / 180 + shakeZ
    mesh.scale.setScalar(state.scale)
    ghost.rotation.z = mesh.rotation.z
    ghost.scale.setScalar(state.scale)

    const material = mesh.material as THREE.MeshStandardMaterial
    material.opacity = 0.15 + 0.85 * state.progress
    const ghostMaterial = ghost.material as THREE.MeshBasicMaterial
    ghostMaterial.opacity = (1 - state.progress) * 0.5
  })

  function handleClick(e: { stopPropagation: () => void }) {
    e.stopPropagation()
    tapTimeRef.current = elapsedRef.current
    onTap?.(partId)
  }

  return (
    <group position={position}>
      <mesh ref={meshRef} geometry={geometry} onClick={handleClick}>
        <meshStandardMaterial color={color} transparent roughness={0.5} />
      </mesh>
      <mesh ref={ghostRef} geometry={geometry} scale={1.02}>
        <meshBasicMaterial color={color} wireframe transparent />
      </mesh>
    </group>
  )
}

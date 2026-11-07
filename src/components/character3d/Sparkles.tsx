import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SparklesProps {
  count: number // 0~7
}

const MAX = 7

export default function Sparkles({ count }: SparklesProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return
    group.children.forEach((child, i) => {
      child.position.y = 1.3 + Math.sin(clock.elapsedTime * 2 + i) * 0.08
      child.visible = i < count
    })
    group.rotation.y = clock.elapsedTime * 0.3
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: MAX }, (_, i) => {
        const angle = (i / MAX) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.3, 1.3, Math.sin(angle) * 1.3]}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial color="#fff2a8" emissive="#fff2a8" emissiveIntensity={1.2} />
          </mesh>
        )
      })}
    </group>
  )
}

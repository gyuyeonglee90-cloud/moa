import { lazy, Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import type { Character3DProps } from './character3d/types'
import StaticThumbnail from './character3d/StaticThumbnail'

const Scene = lazy(() => import('./character3d/Scene'))

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/**
 * 3D 캐릭터. WebGL을 쓸 수 없거나 reduced-motion이면 정지 이미지로 대체한다.
 * 부위 정보는 이 캔버스만으로 전달되지 않도록, 호출하는 화면에서 같은 정보를 텍스트 타일로도 보여줘야 한다.
 */
export default function Character3D({
  template,
  color,
  parts,
  bodyFill,
  sparkles,
  onPartTap,
  ariaLabel,
  className,
}: Character3DProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [webglOk] = useState(supportsWebGL)

  if (!webglOk || reducedMotion) {
    return (
      <div role="img" aria-label={ariaLabel} className={className}>
        <StaticThumbnail color={color} bodyFill={bodyFill} className={className} />
      </div>
    )
  }

  return (
    <div role="img" aria-label={ariaLabel} className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.3, 3.2], fov: 35 }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 4]} intensity={1} />
        <Suspense fallback={null}>
          <Scene
            template={template}
            color={color}
            parts={parts}
            bodyFill={bodyFill}
            sparkles={sparkles}
            onPartTap={onPartTap}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

import { useMemo } from 'react'
import * as THREE from 'three'
import type { Template } from '../../types'

/**
 * 몸통 지오메트리의 단일 교체 지점.
 *
 * TODO(모델 교체): VARCO 3D에서 만든 GLB가 `public/models/body-<template>.glb`
 * (또는 assets/3d/)로 들어오면, 이 함수 내부만
 *   const { scene } = useGLTF(`/models/body-${template}.glb`)
 *   return (scene.getObjectByName('Body') as THREE.Mesh).geometry
 * 로 바꾼다. 호출하는 쪽(BodyMesh)은 바뀌지 않는다 — `useBodyGeometry`가
 * 항상 THREE.BufferGeometry 하나를 반환한다는 계약만 지키면 된다.
 */
export function useBodyGeometry(_template: Template): THREE.BufferGeometry {
  return useMemo(() => new THREE.SphereGeometry(1.001, 32, 32), [_template])
}

import type { BodyColor } from '../types'

export interface CharColorTokens {
  light: string
  base: string
  deep: string
  tint: string
}

/** DESIGN_SYSTEM.md 1-3 캐릭터 팔레트 (방사형 그라데이션 3단 + 타일 배경) */
export const CHAR_COLOR_TOKENS: Record<BodyColor, CharColorTokens> = {
  lime: { light: '#E4FBC9', base: '#8FE05A', deep: '#3FB82E', tint: '#EEFBE0' },
  pink: { light: '#FFE0F3', base: '#FF9AD8', deep: '#FF64C8', tint: '#FFEEF8' },
  coral: { light: '#FFE1DA', base: '#FF8A7A', deep: '#F0503C', tint: '#FFEFEB' },
  sky: { light: '#DDEEFF', base: '#8CC4F5', deep: '#3D8FE0', tint: '#EAF4FF' },
  sun: { light: '#FFF3CC', base: '#FFD36B', deep: '#FFAE1A', tint: '#FFF8E3' },
  lavender: { light: '#F2E8FD', base: '#D6B6F6', deep: '#9B6FD6', tint: '#F6F0FE' },
}

/** 3D 임시 도형 등 단일 색상 값이 필요한 곳에서 쓰는 base 톤 */
export const BODY_COLOR_HEX: Record<BodyColor, string> = Object.fromEntries(
  Object.entries(CHAR_COLOR_TOKENS).map(([key, tokens]) => [key, tokens.base]),
) as Record<BodyColor, string>

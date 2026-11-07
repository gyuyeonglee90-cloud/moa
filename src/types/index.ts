export type BodyShape = 'round' | 'squishy' | 'spiky'

export type BodyColor =
  | 'pink'
  | 'yellow'
  | 'mint'
  | 'blue'
  | 'purple'
  | 'orange'

export type PartCategory = 'hat' | 'eyes' | 'cheeks' | 'accessory'

export interface CharacterPart {
  category: PartCategory
  variant: string
  addedBy: string // userId
}

export interface CharacterConfig {
  bodyShape: BodyShape
  bodyColor: BodyColor
  parts: CharacterPart[]
  name: string
}

export interface User {
  id: string
  nickname: string
  emoji: string // 아바타로 쓰는 이모지
}

export interface CheckIn {
  userId: string
  day: number // 1부터 시작하는 챌린지 일차
  photo?: string // data URL (600px로 리사이즈된 이미지)
  stamp?: string
  memo?: string
}

export interface Challenge {
  id: string
  title: string
  totalDays: number
  currentDay: number // 지금까지 진행된 일차 (1부터)
  memberIds: string[] // 크루 전원 (나 포함)
  ownerId: string // 챌린지를 만든 사람
  character: CharacterConfig
  checkIns: CheckIn[]
  status: 'ongoing' | 'graduated'
  graduationResult?: GraduationResult
}

export type GrowthStage = 0 | 1 | 2 | 3

export type Mood = 'great' | 'okay' | 'low'

export interface GraduationResult {
  finalStage: GrowthStage
  finalProgress: number // 0~1
  totalCheckIns: number
  bestCrewCombo: number
  perfectAttendanceUserId: string | null // 개근상 (최다 인증 멤버)
  completedAt: string // ISO date string
}

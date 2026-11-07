export type Template = 'round' | 'soft' | 'chubby'

export type BodyColor =
  | 'pink'
  | 'yellow'
  | 'mint'
  | 'blue'
  | 'purple'
  | 'orange'

export type PartId = 'hair' | 'eyeL' | 'eyeR' | 'cheek' | 'mouth'

export const PART_IDS: PartId[] = ['hair', 'eyeL', 'eyeR', 'cheek', 'mouth']

/** 부위 담당자. 전원 인증한 날만 그려지는 '공동' 부위는 'shared' */
export type PartOwner = string | 'shared'

export interface CharacterConfig {
  template: Template
  color: BodyColor
  parts: Record<PartId, PartOwner>
  name: string
}

export interface User {
  id: string
  nickname: string
  emoji: string
}

export interface CheckIn {
  userId: string
  day: number // 1부터 시작하는 챌린지 일차
  photo?: string // data URL (600px로 리사이즈된 이미지)
  stamp?: string
  memo?: string
}

export type ChallengeStatus = 'ongoing' | 'completed'

export interface Challenge {
  id: string
  title: string
  totalDays: number
  currentDay: number // 지금까지 진행된 일차 (1부터)
  memberIds: string[] // 크루 전원 (나 포함)
  ownerId: string // 챌린지를 만든 사람
  character: CharacterConfig
  checkIns: CheckIn[]
  status: ChallengeStatus
  completionResult?: CompletionResult
  goodsOrder?: GoodsOrder
}

/** 부위에 쌓인 흔적의 시각적 상태 */
export interface PartTrace {
  partId: PartId
  missedCount: number
  scale: number // 1 = 원래 크기
  rotate: number // deg
  wavy: boolean
}

export type HistoryEventType = 'trace' | 'good'

export interface HistoryEvent {
  day: number
  type: HistoryEventType
  partId?: PartId // trace 이벤트일 때만
  userId?: string // 흔적을 남긴 담당자 (shared면 undefined)
  message: string
}

export interface CompletionResult {
  similarity: number // 0~100, 흔적이 없을수록 100에 가까움
  totalCheckIns: number
  goodTraces: number // 전원 인증한 날 수 (최대 7)
  partTraces: PartTrace[]
  history: HistoryEvent[]
  completedAt: string // ISO date string
}

export type GoodsType = 'sticker' | 'keyring' | 'grip' | 'doll'

export type DonationCategory = 'children' | 'animal' | 'environment'

export interface GoodsOrder {
  type: GoodsType
  donationCategory: DonationCategory
  reservedAt: string // ISO date string
  status: 'reserved'
}

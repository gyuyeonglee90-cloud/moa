import type { User } from '../types'
import { CURRENT_USER_ID } from '../domain/constants'

export const users: User[] = [
  { id: CURRENT_USER_ID, nickname: '나', emoji: '🙂' },
  { id: 'f1', nickname: '수아', emoji: '🐥' },
  { id: 'f2', nickname: '도윤', emoji: '🐻' },
  { id: 'f3', nickname: '하은', emoji: '🐰' },
  { id: 'f4', nickname: '지호', emoji: '🦊' },
]

export const FRIEND_IDS = users.filter((u) => u.id !== CURRENT_USER_ID).map((u) => u.id)
export const ALL_MEMBER_IDS = users.map((u) => u.id)

// 가이드 체험 투어용 고정 크루 '아침러너즈' (나, 지우, 민지, 서준) — PRD 8-1
export const TOUR_USERS: User[] = [
  { id: CURRENT_USER_ID, nickname: '나', emoji: '🙂' },
  { id: 'jiwoo', nickname: '지우', emoji: '🐥' },
  { id: 'minji', nickname: '민지', emoji: '🐻' },
  { id: 'seojun', nickname: '서준', emoji: '🦊' },
]
export const TOUR_MEMBER_IDS = TOUR_USERS.map((u) => u.id)

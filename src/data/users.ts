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

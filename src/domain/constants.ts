/** 데모에서 '나'로 고정되는 사용자 id. 친구 자동 인증 생성 시 이 사용자는 건너뛴다 */
export const CURRENT_USER_ID = 'me'

/** 친구 자동 인증 확률 범위 (PRD 7장) */
export const AUTO_CHECKIN_MIN_RATE = 0.7
export const AUTO_CHECKIN_MAX_RATE = 0.9

export const DEMO_STAMPS = ['👍', '🔥', '💪', '✅'] as const

/** 좋은 흔적(반짝이) 최대 개수 (PRD 5-3) */
export const MAX_GOOD_TRACES = 7

export const PART_LABELS: Record<import('../types').PartId, string> = {
  earL: '왼쪽 귀',
  earR: '오른쪽 귀',
  eyes: '눈',
  nose: '코·입',
  tail: '꼬리',
}

/** 데모에서 '나'로 고정되는 사용자 id. 친구 자동 인증 생성 시 이 사용자는 건너뛴다 */
export const CURRENT_USER_ID = 'me'

/** 친구 자동 인증 확률 범위 (PRD 7장) */
export const AUTO_CHECKIN_MIN_RATE = 0.7
export const AUTO_CHECKIN_MAX_RATE = 0.9

export const DEMO_STAMPS = ['👍', '🔥', '💪', '✅'] as const

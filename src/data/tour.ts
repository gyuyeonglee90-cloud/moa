import type { Challenge } from '../types'
import { CURRENT_USER_ID } from '../domain/constants'
import { TOUR_MEMBER_IDS } from './users'

export const TOUR_CHALLENGE_ID = 'tour-challenge'

const [, JIWOO, MINJI, SEOJUN] = TOUR_MEMBER_IDS

/** 투어 전용 챌린지 '뽀짝이' 초기 상태 (PRD 8-1) */
export function buildTourChallenge(): Challenge {
  return {
    id: TOUR_CHALLENGE_ID,
    title: '아침러너즈와 함께 걷기',
    totalDays: 7,
    currentDay: 1,
    memberIds: TOUR_MEMBER_IDS,
    ownerId: JIWOO,
    character: {
      template: 'round',
      color: 'lime',
      parts: { earL: CURRENT_USER_ID, earR: 'shared', eyes: MINJI, nose: SEOJUN, tail: JIWOO },
      name: '뽀짝이',
    },
    checkIns: [],
    status: 'ongoing',
  }
}

/** 날짜별로 친구가 인증하는지 고정해둔 스크립트. '나'는 포함하지 않는다(화면에서 따로 다룸) */
export const TOUR_FRIEND_PRESENCE: Record<number, string[]> = {
  1: [JIWOO, MINJI, SEOJUN],
  2: [JIWOO, MINJI, SEOJUN],
  3: [JIWOO, MINJI, SEOJUN],
  4: [JIWOO, MINJI], // 서준이 쉬는 날
  5: [JIWOO, MINJI, SEOJUN],
  6: [JIWOO, MINJI, SEOJUN],
  7: [JIWOO, MINJI, SEOJUN],
}

export type TourStep = 1 | 2 | 3 | 4 | 5 | 6

export interface TourStepInfo {
  step: TourStep
  message: string
}

export const TOUR_STEPS: Record<TourStep, TourStepInfo> = {
  1: { step: 1, message: '지우가 초대장을 보냈어요. 크루에 합류해서 목표 캐릭터 "뽀짝이"를 만나보세요.' },
  2: { step: 2, message: '남은 부위 중 "왼쪽 귀"를 당신이 맡았어요. 지우는 꼬리, 민지는 눈, 서준이는 코·입을 맡았고, 오른쪽 귀는 다 같이 그려요.' },
  3: { step: 3, message: '첫 인증을 해볼까요? 사진이나 스탬프 + 한 줄 메모면 충분해요.' },
  4: { step: 4, message: '"다음 날로"를 눌러서 7일을 함께 지나가볼게요.' },
  5: { step: 5, message: '오늘은 5일차예요. 하루 쉬어볼까요? 쉬어도 괜찮아요 — 어떤 흔적이 남는지 같이 봐요.' },
  6: { step: 6, message: '우리만의 뽀짝이가 완성됐어요! 흔적까지 전부 우리만의 이야기예요.' },
}

export const TOUR_DAY_NOTE: Record<number, string> = {
  3: '3일차 · 크루 전원 인증 → 반짝이가 떴어요!',
  4: '4일차 · 서준이 쉬어간 덕분에 코·입이 25% 커졌어요',
  5: '5일차 · 오늘 쉬어간 덕분에 왼쪽 귀가 25% 커져서 짝짝이 귀가 됐어요',
}

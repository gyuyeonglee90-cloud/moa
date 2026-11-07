import type { CheckIn, Challenge, CharacterConfig, PartId } from '../types'
import { goodTraces, history, similarity, traces } from '../domain'
import { createGoodsOrder } from '../domain/goods'
import { ALL_MEMBER_IDS, users } from './users'

const [ME, F1, F2, F3, F4] = ALL_MEMBER_IDS

function dayCheckIns(day: number, presentUserIds: string[], stamp = '👍'): CheckIn[] {
  return presentUserIds.map((userId) => ({ userId, day, stamp }))
}

function flattenDays(presentByDay: string[][]): CheckIn[] {
  return presentByDay.flatMap((present, i) => dayCheckIns(i + 1, present))
}

function buildCharacter(
  template: CharacterConfig['template'],
  color: CharacterConfig['color'],
  parts: Record<PartId, string>,
  name: string,
): CharacterConfig {
  return { template, color, parts, name }
}

// --- 진행 중 챌린지 A: 매일 아침 30분 걷기 (7일 중 4일째, 평범하게 진행 중) ---
const challengeA: Challenge = {
  id: 'challenge-a',
  title: '매일 아침 30분 걷기',
  totalDays: 7,
  currentDay: 4,
  memberIds: ALL_MEMBER_IDS,
  ownerId: ME,
  character: buildCharacter(
    'round',
    'sky',
    { earL: F1, earR: ME, eyes: F2, nose: F3, tail: F4 },
    '모아밍',
  ),
  checkIns: flattenDays([
    [ME, F1, F2, F3, F4],
    [ME, F1, F2, F3],
    [ME, F1, F2],
    [ME],
  ]),
  status: 'ongoing',
}

// --- 진행 중 챌린지 B: 하루 한 챕터 독서 (14일 중 13일째, 다음 날로 넘기면 바로 완성) ---
const challengeB: Challenge = {
  id: 'challenge-b',
  title: '하루 한 챕터 독서',
  totalDays: 14,
  currentDay: 13,
  memberIds: ALL_MEMBER_IDS,
  ownerId: F1,
  character: buildCharacter(
    'soft',
    'sun',
    { earL: F2, earR: F3, eyes: F4, nose: ME, tail: F1 },
    '챕터비',
  ),
  checkIns: flattenDays(
    Array.from({ length: 12 }, () => [ME, F1, F2, F3, F4]).concat([[ME, F1, F2, F4]]),
  ),
  status: 'ongoing',
}

// --- 완성된 챌린지들 (도감용, 흔적이 서로 다르게) ---
function buildCompletedChallenge(params: {
  id: string
  title: string
  totalDays: number
  ownerId: string
  character: CharacterConfig
  presentByDay: string[][]
  goodsOrder?: Challenge['goodsOrder']
}): Challenge {
  const base: Challenge = {
    id: params.id,
    title: params.title,
    totalDays: params.totalDays,
    currentDay: params.totalDays,
    memberIds: ALL_MEMBER_IDS,
    ownerId: params.ownerId,
    character: params.character,
    checkIns: flattenDays(params.presentByDay),
    status: 'completed',
    goodsOrder: params.goodsOrder,
  }

  const partIds: PartId[] = ['earL', 'earR', 'eyes', 'nose', 'tail']
  base.completionResult = {
    similarity: similarity(base),
    totalCheckIns: base.checkIns.length,
    goodTraces: goodTraces(base),
    partTraces: partIds.map((partId) => traces(base, partId)),
    history: history(base, users),
    completedAt: new Date('2026-10-20T12:00:00Z').toISOString(),
  }
  return base
}

// G1: 플랭크 1분 챌린지 — 흔적이 많이 남은 캐릭터
const completedTraced = buildCompletedChallenge({
  id: 'challenge-g1',
  title: '플랭크 1분 챌린지',
  totalDays: 5,
  ownerId: F3,
  character: buildCharacter(
    'chubby',
    'lavender',
    { earL: F1, earR: ME, eyes: F2, nose: F3, tail: F4 },
    '플랭키',
  ),
  presentByDay: [
    [ME, F1, F2, F3, F4],
    [ME, F2, F3, F4],
    [ME, F3, F4],
    [ME, F4],
    [ME, F1, F2, F3, F4],
  ],
})

// G2: 물 2L 마시기 — 흔적이 거의 없이 완성 + 굿즈 예약 완료
const completedClean = buildCompletedChallenge({
  id: 'challenge-g2',
  title: '물 2L 마시기',
  totalDays: 10,
  ownerId: F2,
  character: buildCharacter(
    'round',
    'lime',
    { earL: F2, earR: F3, eyes: ME, nose: F4, tail: F1 },
    '물방울',
  ),
  presentByDay: Array.from({ length: 9 }, () => [ME, F1, F2, F3, F4]).concat([
    [ME, F2, F3, F4],
  ]),
  goodsOrder: createGoodsOrder('keyring', 'animal', new Date('2026-10-30T09:00:00Z')),
})

// G3: 아침 기상 인증 — 흔적이 가장 뚜렷하게 남은 캐릭터
const completedHeavy = buildCompletedChallenge({
  id: 'challenge-g3',
  title: '아침 기상 인증',
  totalDays: 7,
  ownerId: F4,
  character: buildCharacter(
    'soft',
    'coral',
    { earL: F3, earR: F4, eyes: F1, nose: ME, tail: F2 },
    '모닝스타',
  ),
  presentByDay: [
    [ME, F1, F2, F3, F4],
    [ME, F1, F2, F4],
    [ME, F1, F2],
    [ME, F2],
    [ME],
    [ME, F1, F2, F3, F4],
    [ME, F1, F2, F4],
  ],
})

export const challenges: Challenge[] = [
  challengeA,
  challengeB,
  completedTraced,
  completedClean,
  completedHeavy,
]

import type { CheckIn, Challenge, CharacterConfig } from '../types'
import { calcBestCrewCombo, calcGrowthStage, calcPerfectAttendanceUserId, calcProgress } from '../domain'
import { ALL_MEMBER_IDS } from './users'

/** memberIds 중 앞에서 count명이 해당 day에 인증한 CheckIn을 만든다 */
function dayCheckIns(day: number, memberIds: string[], count: number, stamp = '👍'): CheckIn[] {
  return memberIds.slice(0, count).map((userId) => ({ userId, day, stamp }))
}

function buildCharacter(overrides: Partial<CharacterConfig>): CharacterConfig {
  return {
    bodyShape: 'round',
    bodyColor: 'pink',
    parts: [
      { category: 'hat', variant: 'ribbon', addedBy: 'f1' },
      { category: 'eyes', variant: 'sparkle', addedBy: 'f2' },
      { category: 'cheeks', variant: 'blush', addedBy: 'f3' },
      { category: 'accessory', variant: 'scarf', addedBy: 'me' },
    ],
    name: '모아',
    ...overrides,
  }
}

// --- 진행 중 챌린지 A: 매일 아침 30분 걷기 (7일 중 4일째, 평범하게 진행 중) ---
const challengeACheckIns: CheckIn[] = [
  ...dayCheckIns(1, ALL_MEMBER_IDS, 5),
  ...dayCheckIns(2, ALL_MEMBER_IDS, 4),
  ...dayCheckIns(3, ALL_MEMBER_IDS, 3),
  { userId: 'me', day: 4, stamp: '👍' },
]

const challengeA: Challenge = {
  id: 'challenge-a',
  title: '매일 아침 30분 걷기',
  totalDays: 7,
  currentDay: 4,
  memberIds: ALL_MEMBER_IDS,
  ownerId: 'me',
  character: buildCharacter({
    bodyShape: 'round',
    bodyColor: 'mint',
    name: '모아밍',
  }),
  checkIns: challengeACheckIns,
  status: 'ongoing',
}

// --- 진행 중 챌린지 B: 하루 한 챕터 독서 (14일 중 13일째, 다음 날로 넘기면 바로 졸업) ---
const challengeBCheckIns: CheckIn[] = Array.from({ length: 12 }, (_, i) =>
  dayCheckIns(i + 1, ALL_MEMBER_IDS, 5),
).flat()
challengeBCheckIns.push(...dayCheckIns(13, ALL_MEMBER_IDS, 4))

const challengeB: Challenge = {
  id: 'challenge-b',
  title: '하루 한 챕터 독서',
  totalDays: 14,
  currentDay: 13,
  memberIds: ALL_MEMBER_IDS,
  ownerId: 'f1',
  character: buildCharacter({
    bodyShape: 'squishy',
    bodyColor: 'yellow',
    name: '챕터비',
  }),
  checkIns: challengeBCheckIns,
  status: 'ongoing',
}

// --- 졸업 완료 챌린지들 (도감용, 엔딩 단계를 서로 다르게) ---
function buildGraduatedChallenge(params: {
  id: string
  title: string
  totalDays: number
  ownerId: string
  character: CharacterConfig
  checkIns: CheckIn[]
}): Challenge {
  const base: Challenge = {
    id: params.id,
    title: params.title,
    totalDays: params.totalDays,
    currentDay: params.totalDays,
    memberIds: ALL_MEMBER_IDS,
    ownerId: params.ownerId,
    character: params.character,
    checkIns: params.checkIns,
    status: 'graduated',
  }
  const finalProgress = calcProgress(base)
  base.graduationResult = {
    finalStage: calcGrowthStage(finalProgress),
    finalProgress,
    totalCheckIns: base.checkIns.length,
    bestCrewCombo: calcBestCrewCombo(base),
    perfectAttendanceUserId: calcPerfectAttendanceUserId(base),
    completedAt: new Date('2026-10-20T12:00:00Z').toISOString(),
  }
  return base
}

// G1: 플랭크 1분 챌린지 — 저조하게 끝나 '아기' 단계로 졸업(실패가 아닌 다른 엔딩)
const graduatedLow = buildGraduatedChallenge({
  id: 'challenge-g1',
  title: '플랭크 1분 챌린지',
  totalDays: 5,
  ownerId: 'f3',
  character: buildCharacter({ bodyShape: 'spiky', bodyColor: 'purple', name: '플랭키' }),
  checkIns: [
    ...dayCheckIns(1, ALL_MEMBER_IDS, 3),
    ...dayCheckIns(2, ALL_MEMBER_IDS, 2),
    ...dayCheckIns(3, ALL_MEMBER_IDS, 1),
    ...dayCheckIns(4, ALL_MEMBER_IDS, 1),
    ...dayCheckIns(5, ALL_MEMBER_IDS, 1),
  ],
})

// G2: 물 2L 마시기 — '성장' 단계로 졸업
const graduatedMid = buildGraduatedChallenge({
  id: 'challenge-g2',
  title: '물 2L 마시기',
  totalDays: 10,
  ownerId: 'f2',
  character: buildCharacter({ bodyShape: 'round', bodyColor: 'blue', name: '물방울' }),
  checkIns: Array.from({ length: 6 }, (_, i) => dayCheckIns(i + 1, ALL_MEMBER_IDS, 5)).flat(),
})

// G3: 아침 기상 인증 — '완성' 단계로 졸업
const graduatedHigh = buildGraduatedChallenge({
  id: 'challenge-g3',
  title: '아침 기상 인증',
  totalDays: 7,
  ownerId: 'f4',
  character: buildCharacter({ bodyShape: 'spiky', bodyColor: 'orange', name: '모닝스타' }),
  checkIns: [
    ...Array.from({ length: 6 }, (_, i) => dayCheckIns(i + 1, ALL_MEMBER_IDS, 5)).flat(),
    ...dayCheckIns(7, ALL_MEMBER_IDS, 3),
  ],
})

export const challenges: Challenge[] = [
  challengeA,
  challengeB,
  graduatedLow,
  graduatedMid,
  graduatedHigh,
]

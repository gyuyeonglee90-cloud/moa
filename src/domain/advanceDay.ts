import type { CheckIn, Challenge, User } from '../types'
import { PART_IDS } from '../types'
import {
  AUTO_CHECKIN_MAX_RATE,
  AUTO_CHECKIN_MIN_RATE,
  CURRENT_USER_ID,
  DEMO_STAMPS,
} from './constants'
import { traces } from './traces'
import { goodTraces } from './goodTraces'
import { history } from './history'
import { similarity } from './similarity'

export interface AdvanceDayResult {
  challenge: Challenge
  completed: boolean
}

function finalizeDay(
  challenge: Challenge,
  newCheckIns: CheckIn[],
  users: User[],
): AdvanceDayResult {
  const today = challenge.currentDay
  const checkIns = [...challenge.checkIns, ...newCheckIns]
  const nextDay = today + 1
  const isLastDayPassed = nextDay > challenge.totalDays

  const withCheckIns: Challenge = { ...challenge, checkIns }

  if (!isLastDayPassed) {
    return {
      challenge: { ...withCheckIns, currentDay: nextDay },
      completed: false,
    }
  }

  const finalChallenge: Challenge = {
    ...withCheckIns,
    currentDay: challenge.totalDays,
    status: 'completed',
  }

  finalChallenge.completionResult = {
    similarity: similarity(finalChallenge),
    totalCheckIns: finalChallenge.checkIns.length,
    goodTraces: goodTraces(finalChallenge),
    partTraces: PART_IDS.map((partId) => traces(finalChallenge, partId)),
    history: history(finalChallenge, users),
    completedAt: new Date().toISOString(),
  }

  return { challenge: finalChallenge, completed: true }
}

/**
 * 오늘(currentDay)에 아직 인증하지 않은 친구들의 인증을 확률적으로 생성한 뒤
 * 다음 날로 넘어간다. 마지막 날을 넘으면 완성 처리한다. (자유 모드)
 */
export function advanceDay(
  challenge: Challenge,
  users: User[],
  randomFn: () => number = Math.random,
): AdvanceDayResult {
  if (challenge.status === 'completed') {
    return { challenge, completed: false }
  }

  const today = challenge.currentDay
  const autoCheckIns: CheckIn[] = []

  for (const userId of challenge.memberIds) {
    if (userId === CURRENT_USER_ID) continue
    const alreadyCheckedIn = challenge.checkIns.some(
      (c) => c.userId === userId && c.day === today,
    )
    if (alreadyCheckedIn) continue

    const rate =
      AUTO_CHECKIN_MIN_RATE + randomFn() * (AUTO_CHECKIN_MAX_RATE - AUTO_CHECKIN_MIN_RATE)
    const success = randomFn() < rate
    if (success) {
      autoCheckIns.push({
        userId,
        day: today,
        stamp: DEMO_STAMPS[Math.floor(randomFn() * DEMO_STAMPS.length)],
      })
    }
  }

  return finalizeDay(challenge, autoCheckIns, users)
}

/**
 * 오늘(currentDay)에 미리 정해둔 사용자 목록만 인증한 것으로 두고 다음 날로 넘어간다.
 * 가이드 체험 투어처럼 친구 행동을 스크립트로 고정할 때 쓴다(PRD 8-1).
 */
export function advanceDayWithPresence(
  challenge: Challenge,
  presentUserIds: string[],
  users: User[],
): AdvanceDayResult {
  if (challenge.status === 'completed') {
    return { challenge, completed: false }
  }

  const today = challenge.currentDay
  const alreadyCheckedInIds = new Set(
    challenge.checkIns.filter((c) => c.day === today).map((c) => c.userId),
  )
  const newCheckIns: CheckIn[] = presentUserIds
    .filter((userId) => !alreadyCheckedInIds.has(userId))
    .map((userId) => ({ userId, day: today, stamp: DEMO_STAMPS[0] }))

  return finalizeDay(challenge, newCheckIns, users)
}

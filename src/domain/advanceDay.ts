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

/**
 * 오늘(currentDay)에 아직 인증하지 않은 친구들의 인증을 확률적으로 생성한 뒤
 * 다음 날로 넘어간다. 마지막 날을 넘으면 완성 처리한다.
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

  const checkIns = [...challenge.checkIns, ...autoCheckIns]
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

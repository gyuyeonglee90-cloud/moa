import type { Challenge, CheckIn } from '../types'
import { calcProgress, calcGrowthStage } from './progress'
import { calcBestCrewCombo } from './combo'
import { calcPerfectAttendanceUserId } from './attendance'
import {
  AUTO_CHECKIN_MAX_RATE,
  AUTO_CHECKIN_MIN_RATE,
  CURRENT_USER_ID,
  DEMO_STAMPS,
} from './constants'

export interface AdvanceDayResult {
  challenge: Challenge
  graduated: boolean
}

/**
 * 오늘(currentDay)에 아직 인증하지 않은 친구들의 인증을 확률적으로 생성한 뒤
 * 다음 날로 넘어간다. 마지막 날을 넘으면 졸업 처리한다.
 */
export function advanceDay(
  challenge: Challenge,
  randomFn: () => number = Math.random,
): AdvanceDayResult {
  if (challenge.status === 'graduated') {
    return { challenge, graduated: false }
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
      graduated: false,
    }
  }

  const finalChallenge: Challenge = {
    ...withCheckIns,
    currentDay: challenge.totalDays,
    status: 'graduated',
  }
  const finalProgress = calcProgress(finalChallenge)

  finalChallenge.graduationResult = {
    finalStage: calcGrowthStage(finalProgress),
    finalProgress,
    totalCheckIns: finalChallenge.checkIns.length,
    bestCrewCombo: calcBestCrewCombo(finalChallenge),
    perfectAttendanceUserId: calcPerfectAttendanceUserId(finalChallenge),
    completedAt: new Date().toISOString(),
  }

  return { challenge: finalChallenge, graduated: true }
}

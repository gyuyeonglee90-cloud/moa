import type { Challenge } from '../types'
import { isFullAttendanceDay } from './attendance'
import { MAX_GOOD_TRACES } from './constants'

/** 전원 인증한 날 수 (최대 MAX_GOOD_TRACES) */
export function goodTraces(challenge: Challenge): number {
  let count = 0
  for (let day = 1; day <= challenge.currentDay; day++) {
    if (isFullAttendanceDay(challenge, day)) count++
  }
  return Math.min(MAX_GOOD_TRACES, count)
}

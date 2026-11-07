import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { TOUR_CHALLENGE_ID } from '../data/tour'

export default function DemoControls() {
  const navigate = useNavigate()
  const location = useLocation()
  const challenges = useAppStore((s) => s.challenges)
  const advanceDay = useAppStore((s) => s.advanceDay)
  const resetDemo = useAppStore((s) => s.resetDemo)
  const lastCompletedChallengeId = useAppStore((s) => s.lastCompletedChallengeId)
  const clearLastCompleted = useAppStore((s) => s.clearLastCompleted)
  const tourStep = useAppStore((s) => s.tourStep)
  const startTour = useAppStore((s) => s.startTour)
  const setTourStep = useAppStore((s) => s.setTourStep)
  const [expanded, setExpanded] = useState(false)

  const firstOngoing = challenges.find((c) => c.status === 'ongoing')

  function handleNextDay() {
    if (!firstOngoing) return
    advanceDay(firstOngoing.id)
  }

  function handleReplayTour() {
    // 투어 상태(해당 챌린지·단계)만 처음으로 되돌리고, 다른 챌린지/굿즈 등 나머지 데이터는 그대로 둔다
    startTour()
    setTourStep(2)
    setExpanded(false)
    navigate(`/challenge/${TOUR_CHALLENGE_ID}`)
  }

  function handleReset() {
    const ok = window.confirm(
      '인증 기록, 완성한 캐릭터, 굿즈 예약이 모두 처음 상태로 돌아가요. 되돌릴 수 없어요.',
    )
    if (!ok) return
    resetDemo()
    setExpanded(false)
    navigate('/home')
  }

  useEffect(() => {
    if (!lastCompletedChallengeId) return
    const id = lastCompletedChallengeId
    clearLastCompleted()
    navigate(`/completion/${id}`)
  }, [lastCompletedChallengeId, clearLastCompleted, navigate])

  // 가이드 투어 중에는 코치 말풍선이 진행을 책임지고, 합류 전 초대장 화면에서는 아직 의미가 없으므로 숨긴다
  if (tourStep !== null) return null
  if (location.pathname === '/onboarding') return null

  if (!expanded) {
    return (
      <div className="absolute right-3 top-3 z-50">
        <button
          onClick={() => setExpanded(true)}
          className="h-9 rounded-full bg-surface px-3 text-caption font-semibold text-ink-2 shadow-level1"
        >
          데모 도구
        </button>
      </div>
    )
  }

  return (
    <div className="absolute right-3 top-3 z-50 flex flex-col items-end gap-2">
      <button
        onClick={() => setExpanded(false)}
        className="h-9 rounded-full bg-surface px-3 text-caption font-semibold text-ink-2 shadow-level1"
      >
        데모 도구 접기
      </button>
      <button
        onClick={handleNextDay}
        disabled={!firstOngoing}
        className="h-11 rounded-full bg-ink px-4 text-caption font-semibold text-white shadow-level2 disabled:opacity-40"
      >
        다음 날로 넘기기 ⏩
      </button>
      <button
        onClick={handleReplayTour}
        className="h-11 rounded-full border border-hairline bg-surface px-4 text-caption font-semibold text-ink-2 shadow-level1"
      >
        가이드 다시 보기
      </button>
      <button
        onClick={handleReset}
        className="h-11 rounded-full border border-hairline bg-surface px-4 text-caption font-semibold text-ink-2 shadow-level1"
      >
        처음 상태로 되돌리기
      </button>
    </div>
  )
}

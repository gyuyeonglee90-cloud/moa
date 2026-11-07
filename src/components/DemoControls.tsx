import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function DemoControls() {
  const navigate = useNavigate()
  const challenges = useAppStore((s) => s.challenges)
  const advanceDay = useAppStore((s) => s.advanceDay)
  const resetDemo = useAppStore((s) => s.resetDemo)
  const lastCompletedChallengeId = useAppStore((s) => s.lastCompletedChallengeId)
  const clearLastCompleted = useAppStore((s) => s.clearLastCompleted)
  const tourStep = useAppStore((s) => s.tourStep)

  const firstOngoing = challenges.find((c) => c.status === 'ongoing')

  function handleNextDay() {
    if (!firstOngoing) return
    advanceDay(firstOngoing.id)
  }

  function handleReset() {
    const ok = window.confirm(
      '데모를 처음 상태로 되돌려요. 지금까지의 인증, 흔적, 완성된 캐릭터가 모두 사라져요. 계속할까요?',
    )
    if (!ok) return
    resetDemo()
    navigate('/home')
  }

  useEffect(() => {
    if (!lastCompletedChallengeId) return
    const id = lastCompletedChallengeId
    clearLastCompleted()
    navigate(`/completion/${id}`)
  }, [lastCompletedChallengeId, clearLastCompleted, navigate])

  // 가이드 투어 중에는 코치 말풍선이 진행을 책임지므로 데모 컨트롤을 숨긴다
  if (tourStep !== null) return null

  return (
    <div className="absolute right-3 top-3 z-50 flex flex-col gap-2">
      <button
        onClick={handleNextDay}
        disabled={!firstOngoing}
        className="h-11 rounded-full bg-ink px-4 text-caption font-semibold text-white shadow-level2 disabled:opacity-40"
      >
        다음 날로 넘기기 ⏩
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

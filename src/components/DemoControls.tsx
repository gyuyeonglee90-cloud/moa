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

  const firstOngoing = challenges.find((c) => c.status === 'ongoing')

  function handleNextDay() {
    if (!firstOngoing) return
    advanceDay(firstOngoing.id)
  }

  function handleReset() {
    resetDemo()
    navigate('/home')
  }

  useEffect(() => {
    if (!lastCompletedChallengeId) return
    const id = lastCompletedChallengeId
    clearLastCompleted()
    navigate(`/completion/${id}`)
  }, [lastCompletedChallengeId, clearLastCompleted, navigate])

  return (
    <div className="fixed bottom-16 right-3 z-50 flex flex-col gap-2">
      <button
        onClick={handleNextDay}
        disabled={!firstOngoing}
        className="rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow disabled:opacity-40"
      >
        다음 날로 ⏩
      </button>
      <button
        onClick={handleReset}
        className="rounded-full bg-gray-700 px-4 py-2 text-sm font-medium text-white shadow"
      >
        데모 초기화
      </button>
    </div>
  )
}

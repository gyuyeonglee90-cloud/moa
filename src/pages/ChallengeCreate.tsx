import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { TOUR_CHALLENGE_ID } from '../data/tour'

export default function ChallengeCreate() {
  const navigate = useNavigate()
  const startTour = useAppStore((s) => s.startTour)
  const setTourStep = useAppStore((s) => s.setTourStep)

  function handleReplayTour() {
    startTour()
    setTourStep(2)
    navigate(`/challenge/${TOUR_CHALLENGE_ID}`)
  }

  return (
    <div className="flex h-full flex-col p-4">
      <button onClick={() => navigate(-1)} className="self-start text-body-sm text-ink-3">
        ← 뒤로
      </button>
      <h1 className="mt-2 text-h1 text-ink">챌린지 만들기</h1>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-body text-ink-3">
          지금은 체험용 크루만 볼 수 있어요.
          <br />
          부위 나누기는 가이드 체험에서 해볼 수 있어요.
        </p>
        <button
          onClick={handleReplayTour}
          className="h-[52px] rounded-full bg-ink px-6 text-button text-white active:scale-[.97]"
        >
          가이드 다시 보기
        </button>
      </div>
    </div>
  )
}

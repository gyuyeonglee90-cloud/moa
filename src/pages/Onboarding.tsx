import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { TOUR_CHALLENGE_ID } from '../data/tour'

export default function Onboarding() {
  const navigate = useNavigate()
  const startTour = useAppStore((s) => s.startTour)
  const setTourStep = useAppStore((s) => s.setTourStep)

  function handleJoin() {
    startTour()
    setTourStep(2)
    navigate(`/challenge/${TOUR_CHALLENGE_ID}`)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-hero p-6 text-center">
      <p className="text-wordmark text-ink">moa</p>

      <div className="w-full max-w-xs rounded-2xl bg-surface p-4 shadow-level1">
        <p className="text-eyebrow text-ink-3">지우의 초대장</p>
        <p className="mt-2 text-title text-ink">
          "같이 '뽀짝이' 키워볼래? 다 같이 만든 캐릭터가 어떻게 완성되는지 보여주고 싶어!"
        </p>
      </div>

      <p className="text-body text-ink-2">
        친구들과 목표 캐릭터를 나눠 맡아 함께 완성하는 챌린지, MOA예요.
      </p>

      <button
        onClick={handleJoin}
        className="h-[52px] w-full max-w-xs rounded-full bg-ink text-button text-white active:scale-[.97]"
      >
        크루 합류하기
      </button>
      <button
        onClick={() => navigate('/home')}
        className="text-body-sm text-ink-3 underline"
      >
        그냥 둘러보기
      </button>
    </div>
  )
}

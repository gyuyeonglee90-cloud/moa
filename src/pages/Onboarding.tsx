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
    <main className="flex h-full flex-col items-center justify-center gap-6 bg-hero p-6 text-center">
      <h1 className="sr-only">MOA 초대장</h1>
      <p className="text-wordmark text-ink" aria-hidden="true">
        moa
      </p>

      <div className="w-full max-w-xs rounded-2xl bg-surface p-4 shadow-level1">
        <p className="text-eyebrow text-ink-3">지우의 초대장</p>

        {/* 목표 캐릭터 '뽀짝이'를 점선(고스트) 상태로 미리 보여준다 — 아직 아무도 그리지 않은 상태 */}
        <div
          role="img"
          aria-label="목표 캐릭터 뽀짝이, 아직 아무도 그리지 않은 점선 상태"
          className="mx-auto mt-3 h-24 w-24 rounded-full border-2 border-dashed border-ink-4"
          style={{ background: 'rgba(143, 224, 90, 0.12)' }}
        />

        <p className="mt-3 text-title text-ink">
          "우리 같이 '뽀짝이' 완성할래? 각자 한 부위씩 맡아서 7일 동안 그려 나가는 거야!"
        </p>
      </div>

      <p className="max-w-xs text-body text-ink-2">
        친구들과 목표 캐릭터를 나눠 맡아 함께 완성하는 챌린지, MOA예요.
      </p>

      <button
        onClick={handleJoin}
        className="h-[52px] w-full max-w-xs rounded-full bg-ink text-button text-white active:scale-[.97]"
      >
        크루 합류하기
      </button>
      <button onClick={() => navigate('/home')} className="text-body-sm text-ink-3 underline">
        그냥 둘러보기
      </button>
    </main>
  )
}

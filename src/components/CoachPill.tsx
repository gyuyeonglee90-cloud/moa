import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { TOUR_CHALLENGE_ID, TOUR_DAY_NOTE, TOUR_STEPS } from '../data/tour'

/**
 * 가이드 체험 투어의 코치 말풍선 (PRD 8-1). tourStep이 null이면 아무것도 그리지 않는다.
 * 화면 어디서든(App 최상단) 떠 있어서, 다음 화면으로 이동하는 책임까지 함께 진다.
 */
export default function CoachPill() {
  const navigate = useNavigate()
  const location = useLocation()
  const tourStep = useAppStore((s) => s.tourStep)
  const setTourStep = useAppStore((s) => s.setTourStep)
  const skipTour = useAppStore((s) => s.skipTour)
  const advanceTourDay = useAppStore((s) => s.advanceTourDay)
  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === TOUR_CHALLENGE_ID))

  useEffect(() => {
    if (!challenge) return
    if (tourStep === 4 && challenge.currentDay === 5) {
      setTourStep(5)
    } else if (tourStep === 5 && challenge.currentDay === 6) {
      setTourStep(4)
    } else if (tourStep === 4 && challenge.status === 'completed') {
      setTourStep(6)
      navigate(`/completion/${TOUR_CHALLENGE_ID}`)
    }
  }, [challenge?.currentDay, challenge?.status, tourStep, setTourStep, navigate])

  // 완성식(6단계) 풍선은 완성식 화면을 벗어나면(굿즈로 이동 등) 자동으로 사라진다 —
  // 그렇지 않으면 굿즈 예약 완료 화면에서 화면 자체 버튼과 코치 풍선이 중복 노출됐었다.
  useEffect(() => {
    if (tourStep === 6 && !location.pathname.startsWith('/completion/')) {
      setTourStep(null)
    }
  }, [tourStep, location.pathname, setTourStep])

  if (tourStep === null) return null

  const info = TOUR_STEPS[tourStep]
  const dayNote = challenge ? TOUR_DAY_NOTE[challenge.currentDay - 1] : undefined

  function handlePrimary() {
    switch (tourStep) {
      case 2:
        setTourStep(3)
        break
      case 3:
        navigate(`/challenge/${TOUR_CHALLENGE_ID}/checkin?tour=1`)
        break
      case 4:
        advanceTourDay(true)
        break
      case 6:
        setTourStep(null)
        navigate('/dex')
        break
    }
  }

  function handleSkipDay5() {
    advanceTourDay(false)
  }

  function handleCheckInDay5() {
    advanceTourDay(true)
  }

  return (
    <div className="absolute inset-x-4 bottom-20 z-[60]" role="status" aria-live="polite">
      <div className="rounded-3xl bg-ink px-4 py-3 text-white shadow-level2">
        <p className="text-body-sm">{info.message}</p>
        {dayNote && tourStep === 4 && (
          <p className="mt-1 text-caption text-white/70">{dayNote}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          {tourStep === 5 ? (
            <>
              <button
                onClick={handleSkipDay5}
                className="h-11 flex-1 rounded-full bg-white px-3 text-button text-ink"
              >
                오늘은 쉬기
              </button>
              <button
                onClick={handleCheckInDay5}
                className="h-11 flex-1 rounded-full border border-white/40 px-3 text-button text-white"
              >
                그래도 인증할래요
              </button>
            </>
          ) : (
            <button
              onClick={handlePrimary}
              className="h-11 flex-1 rounded-full bg-white px-3 text-button text-ink"
            >
              {tourStep === 3 ? '인증하러 가기' : tourStep === 4 ? '다음 날로' : tourStep === 6 ? '도감으로 가기' : '다음'}
            </button>
          )}
          {tourStep !== 6 && (
            <button onClick={skipTour} className="px-2 text-caption text-white/70 underline">
              가이드 건너뛰기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

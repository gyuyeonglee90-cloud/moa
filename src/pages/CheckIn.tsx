import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { CURRENT_USER_ID, DEMO_STAMPS } from '../domain/constants'
import { TOUR_CHALLENGE_ID } from '../data/tour'

const MEMO_MAX_LENGTH = 40

export default function CheckIn() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isTourStep = searchParams.get('tour') === '1'

  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === id))
  const checkIn = useAppStore((s) => s.checkIn)
  const advanceTourDay = useAppStore((s) => s.advanceTourDay)
  const setTourStep = useAppStore((s) => s.setTourStep)

  const [memo, setMemo] = useState('')
  const [stamp, setStamp] = useState<string>(DEMO_STAMPS[0])

  if (!challenge) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-body text-ink-3">챌린지를 찾을 수 없어요.</p>
      </div>
    )
  }

  const alreadyCheckedInToday = challenge.checkIns.some(
    (c) => c.userId === CURRENT_USER_ID && c.day === challenge.currentDay,
  )

  function handleSubmit() {
    if (!id) return
    checkIn(id, { stamp, memo: memo || undefined })

    if (isTourStep && id === TOUR_CHALLENGE_ID) {
      advanceTourDay(true)
      setTourStep(4)
    }

    navigate(`/challenge/${id}`)
  }

  if (alreadyCheckedInToday) {
    return (
      <main className="flex h-full flex-col justify-end">
        <div className="rounded-t-3xl bg-surface p-4 text-center shadow-level2">
          <h1 className="text-h2 text-ink">오늘 인증 완료 ✓</h1>
          <p className="mt-1 text-body-sm text-ink-3">내일 다시 인증할 수 있어요</p>
          <button
            onClick={() => navigate(`/challenge/${id}`)}
            className="mt-4 h-[52px] w-full rounded-full bg-ink text-button text-white active:scale-[.97]"
          >
            챌린지로 돌아가기
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex h-full flex-col justify-end">
      <div className="rounded-t-3xl bg-surface p-4 shadow-level2">
        <h1 className="text-h2 text-ink">오늘 인증하기</h1>
        <p className="mt-1 text-body-sm text-ink-3">사진 대신 스탬프를 고르고, 한 줄 메모를 남겨요.</p>

        <div className="mt-3 flex gap-2">
          {DEMO_STAMPS.map((s) => (
            <button
              key={s}
              onClick={() => setStamp(s)}
              aria-pressed={stamp === s}
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-xl ${
                stamp === s ? 'border-ink bg-ink text-white' : 'border-hairline bg-surface'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <label className="text-caption text-ink-3" htmlFor="checkin-memo">
            오늘 한 줄 메모
          </label>
          <span className="text-caption text-ink-4">
            {memo.length}/{MEMO_MAX_LENGTH}
          </span>
        </div>
        <input
          id="checkin-memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value.slice(0, MEMO_MAX_LENGTH))}
          maxLength={MEMO_MAX_LENGTH}
          placeholder="오늘은 이런 하루였어요"
          className="mt-1 h-12 w-full rounded-md border border-field-border px-3 text-body"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 h-[52px] w-full rounded-full bg-ink text-button text-white active:scale-[.97]"
        >
          인증 완료하기
        </button>
      </div>
    </main>
  )
}

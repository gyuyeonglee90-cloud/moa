import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { bodyFill } from '../domain/progress'
import { buildPartVisualMap } from '../domain/characterVisual'
import Character3D from '../components/Character3D'

export default function DexDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === id))

  if (!challenge) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-body text-ink-3">캐릭터를 찾을 수 없어요.</p>
      </div>
    )
  }

  const result = challenge.completionResult

  return (
    <main className="flex h-full flex-col overflow-y-auto bg-hero p-4">
      <button onClick={() => navigate(-1)} className="self-start text-body-sm text-ink-3">
        ← 뒤로
      </button>
      <h1 className="mt-2 text-h1 text-ink">{challenge.character.name}</h1>
      <p className="text-caption text-ink-3">{challenge.title}</p>

      <div className="mt-2 h-48 w-full">
        <Character3D
          template={challenge.character.template}
          color={challenge.character.color}
          parts={buildPartVisualMap(challenge)}
          bodyFill={bodyFill(challenge)}
          sparkles={result?.goodTraces ?? 0}
          ariaLabel={`${challenge.character.name}, 완성된 캐릭터`}
        />
      </div>

      {result && (
        <>
          <p className="mt-2 text-body-sm text-ink-2">
            목표와 닮은 정도 <span className="text-stat text-ink">{result.similarity}%</span>
          </p>
          <p className="text-caption text-ink-3">
            총 인증 {result.totalCheckIns}회 · 좋은 흔적 {result.goodTraces}개
          </p>

          <div className="mt-4 space-y-1.5 rounded-2xl bg-surface p-3 shadow-level0">
            {result.history.map((event, i) => (
              <p key={i} className="text-body-sm text-ink-2">
                {event.message}
              </p>
            ))}
          </div>
        </>
      )}

      {challenge.goodsOrder ? (
        <p className="mt-4 rounded-lg bg-surface p-3 text-center text-body-sm text-success shadow-level0">
          굿즈 예약 완료 ({challenge.goodsOrder.type})
        </p>
      ) : (
        <button
          onClick={() => navigate(`/goods/${challenge.id}`)}
          className="mt-4 h-[52px] w-full rounded-full border border-hairline bg-surface text-button text-ink shadow-level1"
        >
          굿즈로 만들기
        </button>
      )}
    </main>
  )
}

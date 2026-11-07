import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { buildPartVisualMap } from '../domain/characterVisual'
import Character3D from '../components/Character3D'

export default function Completion() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === id))

  if (!challenge || !challenge.completionResult) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-body text-ink-3">완성 정보를 찾을 수 없어요.</p>
      </div>
    )
  }

  const result = challenge.completionResult

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-hero p-6 text-center">
      <p className="text-eyebrow text-accent-strong">완성식</p>
      <h1 className="text-display text-ink">우리만의 {challenge.character.name}</h1>

      <div className="h-44 w-44">
        <Character3D
          template={challenge.character.template}
          color={challenge.character.color}
          parts={buildPartVisualMap(challenge)}
          bodyFill={1}
          sparkles={result.goodTraces}
          ariaLabel={`완성된 ${challenge.character.name}`}
        />
      </div>

      <p className="text-stat text-ink">{result.similarity}%</p>
      <p className="text-caption text-ink-3">목표와 닮은 정도 · 흔적이 없을수록 100%에 가까워요</p>
      <p className="text-body-sm text-ink-2">
        총 인증 {result.totalCheckIns}회 · 좋은 흔적 {result.goodTraces}개
      </p>

      <div className="mt-2 flex w-full gap-2">
        <button
          onClick={() => navigate(`/goods/${challenge.id}`)}
          className="h-[52px] flex-1 rounded-full border border-hairline bg-surface text-button text-ink shadow-level1"
        >
          굿즈로 만들기
        </button>
        <button
          onClick={() => navigate('/dex')}
          className="h-[52px] flex-1 rounded-full bg-ink text-button text-white active:scale-[.97]"
        >
          도감으로 이동
        </button>
      </div>
    </div>
  )
}

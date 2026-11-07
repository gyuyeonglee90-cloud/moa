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
        <p className="text-gray-400">캐릭터를 찾을 수 없어요.</p>
      </div>
    )
  }

  const result = challenge.completionResult

  return (
    <div className="flex h-full flex-col p-4">
      <button onClick={() => navigate(-1)} className="self-start text-gray-400">
        ← 뒤로
      </button>
      <h1 className="mt-2 text-xl font-bold">{challenge.character.name}</h1>
      <p className="text-sm text-gray-500">{challenge.title}</p>

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
          <p className="mt-2 text-sm text-gray-500">
            목표와 닮은 정도 {result.similarity}% · 총 인증 {result.totalCheckIns}회 · 좋은 흔적{' '}
            {result.goodTraces}개
          </p>

          <div className="mt-4 flex-1 space-y-1 overflow-y-auto text-sm text-gray-600">
            {result.history.map((event, i) => (
              <div key={i}>{event.message}</div>
            ))}
          </div>
        </>
      )}

      {challenge.goodsOrder ? (
        <p className="mt-4 rounded-lg bg-gray-50 p-2 text-center text-sm text-gray-500">
          굿즈 예약 완료 ({challenge.goodsOrder.type})
        </p>
      ) : (
        <button
          onClick={() => navigate(`/goods/${challenge.id}`)}
          className="mt-4 rounded-full border border-gray-300 py-3 font-medium text-gray-700"
        >
          굿즈로 만들기
        </button>
      )}
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function Completion() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === id))

  if (!challenge || !challenge.completionResult) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">완성 정보를 찾을 수 없어요.</p>
      </div>
    )
  }

  const result = challenge.completionResult

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-6xl">✨</div>
      <h1 className="text-xl font-bold">우리만의 {challenge.character.name} 완성!</h1>
      <p className="text-sm text-gray-500">
        목표와 닮은 정도 {result.similarity}% · 총 인증 {result.totalCheckIns}회 · 좋은 흔적{' '}
        {result.goodTraces}개
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/goods/${challenge.id}`)}
          className="rounded-full border border-gray-300 px-5 py-3 font-medium text-gray-700"
        >
          굿즈로 만들기
        </button>
        <button
          onClick={() => navigate('/dex')}
          className="rounded-full bg-pink-500 px-6 py-3 font-medium text-white"
        >
          도감으로 이동
        </button>
      </div>
    </div>
  )
}

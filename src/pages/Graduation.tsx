import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function Graduation() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === id))

  if (!challenge || !challenge.graduationResult) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">졸업 정보를 찾을 수 없어요.</p>
      </div>
    )
  }

  const result = challenge.graduationResult

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="text-6xl">🎓</div>
      <h1 className="text-xl font-bold">{challenge.character.name} 졸업!</h1>
      <p className="text-sm text-gray-500">
        최종 단계 {result.finalStage} · 달성률 {Math.round(result.finalProgress * 100)}% · 총 인증{' '}
        {result.totalCheckIns}회 · 최고 콤보 {result.bestCrewCombo}일
      </p>

      <button
        onClick={() => navigate('/dex')}
        className="rounded-full bg-pink-500 px-6 py-3 font-medium text-white"
      >
        도감으로 이동
      </button>
    </div>
  )
}

import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { calcGrowthStage, calcProgress } from '../domain/progress'
import { calcMood } from '../domain/mood'
import { calcCurrentCrewCombo } from '../domain/combo'

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === id))

  if (!challenge) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">챌린지를 찾을 수 없어요.</p>
      </div>
    )
  }

  const progress = calcProgress(challenge)
  const stage = calcGrowthStage(progress)
  const mood = calcMood(challenge, challenge.currentDay)
  const combo = calcCurrentCrewCombo(challenge)

  return (
    <div className="flex h-full flex-col p-4">
      <button onClick={() => navigate(-1)} className="self-start text-gray-400">
        ← 뒤로
      </button>
      <h1 className="mt-2 text-xl font-bold">{challenge.title}</h1>
      <p className="text-sm text-gray-500">
        {challenge.currentDay}/{challenge.totalDays}일차 · 단계 {stage} · 진행률{' '}
        {Math.round(progress * 100)}% · 기분 {mood} · 크루 콤보 {combo}일
      </p>

      <div className="mt-6 flex flex-1 items-center justify-center text-gray-400">
        (Phase 2에서 캐릭터, 인증 피드 구현)
      </div>

      <button
        onClick={() => navigate(`/challenge/${challenge.id}/checkin`)}
        className="rounded-full bg-pink-500 py-3 font-medium text-white"
      >
        인증하기
      </button>
    </div>
  )
}

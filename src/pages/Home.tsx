import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { calcGrowthStage, calcProgress } from '../domain/progress'
import BottomTabs from '../components/BottomTabs'

export default function Home() {
  const navigate = useNavigate()
  const challenges = useAppStore((s) => s.challenges)
  const ongoing = challenges.filter((c) => c.status === 'ongoing')

  return (
    <div className="flex h-full flex-col pb-16">
      <header className="p-4">
        <h1 className="text-xl font-bold">홈</h1>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {ongoing.map((challenge) => {
          const progress = calcProgress(challenge)
          const stage = calcGrowthStage(progress)
          return (
            <button
              key={challenge.id}
              onClick={() => navigate(`/challenge/${challenge.id}`)}
              className="w-full rounded-2xl border border-gray-200 p-4 text-left"
            >
              <div className="font-semibold">{challenge.title}</div>
              <div className="text-sm text-gray-500">
                {challenge.currentDay}/{challenge.totalDays}일차 · 성장 단계 {stage} ·{' '}
                {Math.round(progress * 100)}%
              </div>
            </button>
          )
        })}

        <button
          onClick={() => navigate('/challenge/new')}
          className="w-full rounded-2xl border border-dashed border-gray-300 p-4 text-center text-gray-500"
        >
          + 새 챌린지 만들기
        </button>
      </div>

      <BottomTabs />
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { bodyFill } from '../domain/progress'
import { CHAR_COLOR_TOKENS } from '../domain/characterColor'
import BottomTabs from '../components/BottomTabs'

export default function Home() {
  const navigate = useNavigate()
  const challenges = useAppStore((s) => s.challenges)
  const ongoing = challenges.filter((c) => c.status === 'ongoing')

  return (
    <div className="flex h-full flex-col overflow-y-auto pb-24">
      <header className="p-4">
        <h1 className="text-h1 text-ink">홈</h1>
      </header>

      <div className="grid grid-cols-2 gap-sm px-4">
        {ongoing.map((challenge) => {
          const fill = bodyFill(challenge)
          const tint = CHAR_COLOR_TOKENS[challenge.character.color].tint
          return (
            <button
              key={challenge.id}
              onClick={() => navigate(`/challenge/${challenge.id}`)}
              className="rounded-2xl p-4 text-left shadow-level0"
              style={{ background: tint }}
            >
              <div className="text-h3 text-ink">{challenge.character.name}</div>
              <div className="mt-1 text-caption text-ink-2">{challenge.title}</div>
              <div className="mt-2 text-caption text-ink-3">
                {challenge.currentDay}/{challenge.totalDays}일차 · 완성도{' '}
                {Math.round(fill * 100)}%
              </div>
            </button>
          )
        })}

        <button
          onClick={() => navigate('/challenge/new')}
          className="col-span-2 rounded-2xl border border-dashed border-field-border p-4 text-center text-body text-ink-3"
        >
          + 새 챌린지 만들기
        </button>
      </div>

      <BottomTabs />
    </div>
  )
}

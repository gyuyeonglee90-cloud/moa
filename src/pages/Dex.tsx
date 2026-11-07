import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import BottomTabs from '../components/BottomTabs'

export default function Dex() {
  const navigate = useNavigate()
  const challenges = useAppStore((s) => s.challenges)
  const graduated = challenges.filter((c) => c.status === 'graduated')

  return (
    <div className="flex h-full flex-col pb-16">
      <header className="p-4">
        <h1 className="text-xl font-bold">도감</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {graduated.length === 0 ? (
          <p className="text-gray-400">아직 졸업한 캐릭터가 없어요.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {graduated.map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => navigate(`/dex/${challenge.id}`)}
                className="rounded-2xl border border-gray-200 p-3 text-left"
              >
                <div className="font-semibold">{challenge.character.name}</div>
                <div className="text-xs text-gray-500">{challenge.title}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomTabs />
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { bodyFill } from '../domain/progress'
import { CHAR_COLOR_TOKENS } from '../domain/characterColor'
import BottomTabs from '../components/BottomTabs'
import StaticThumbnail from '../components/character3d/StaticThumbnail'

export default function Dex() {
  const navigate = useNavigate()
  const challenges = useAppStore((s) => s.challenges)
  const completed = challenges.filter((c) => c.status === 'completed')

  return (
    <div className="flex h-full flex-col overflow-y-auto pb-24">
      <header className="p-4">
        <h1 className="text-h1 text-ink">도감</h1>
      </header>

      <div className="px-4">
        {completed.length === 0 ? (
          <p className="text-body text-ink-3">아직 완성한 캐릭터가 없어요.</p>
        ) : (
          <div className="grid grid-cols-2 gap-sm">
            {completed.map((challenge) => {
              const tint = CHAR_COLOR_TOKENS[challenge.character.color].tint
              return (
                <button
                  key={challenge.id}
                  onClick={() => navigate(`/dex/${challenge.id}`)}
                  className="rounded-2xl p-3 text-left shadow-level0"
                  style={{ background: tint }}
                >
                  <div className="h-20 w-full">
                    <StaticThumbnail color={challenge.character.color} bodyFill={bodyFill(challenge)} />
                  </div>
                  <div className="mt-2 text-h3 text-ink">{challenge.character.name}</div>
                  <div className="text-caption text-ink-3">{challenge.title}</div>
                  {challenge.goodsOrder && (
                    <div className="mt-1 text-caption text-success">굿즈 예약 완료</div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <BottomTabs />
    </div>
  )
}

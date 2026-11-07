import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

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

  return (
    <div className="flex h-full flex-col p-4">
      <button onClick={() => navigate(-1)} className="self-start text-gray-400">
        ← 뒤로
      </button>
      <h1 className="mt-2 text-xl font-bold">{challenge.character.name}</h1>
      <p className="text-sm text-gray-500">{challenge.title}</p>

      <div className="mt-6 flex flex-1 items-center justify-center text-gray-400">
        (Phase 2에서 졸업 카드 + 여정 앨범 구현)
      </div>
    </div>
  )
}

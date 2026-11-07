import { useNavigate } from 'react-router-dom'

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="text-6xl">🥚</div>
      <h1 className="text-2xl font-bold">MOA</h1>
      <p className="text-gray-500">친구들과 함께 캐릭터를 키우는 챌린지</p>
      <button
        onClick={() => navigate('/home')}
        className="rounded-full bg-pink-500 px-6 py-3 font-medium text-white"
      >
        체험 시작
      </button>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'

const steps = ['정보', '캐릭터', '크루']

export default function ChallengeCreate() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col p-4">
      <button onClick={() => navigate(-1)} className="self-start text-gray-400">
        ← 뒤로
      </button>
      <h1 className="mt-2 text-xl font-bold">챌린지 만들기</h1>
      <div className="mt-2 flex gap-2 text-sm text-gray-400">
        {steps.map((step) => (
          <span key={step}>{step}</span>
        ))}
      </div>
      <div className="flex flex-1 items-center justify-center text-gray-400">
        (Phase 2에서 3스텝 폼 구현)
      </div>
    </div>
  )
}

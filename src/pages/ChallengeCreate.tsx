import { useNavigate } from 'react-router-dom'

const steps = ['정보', '목표 캐릭터', '부위 나누기']

export default function ChallengeCreate() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col p-4">
      <button onClick={() => navigate(-1)} className="self-start text-body-sm text-ink-3">
        ← 뒤로
      </button>
      <h1 className="mt-2 text-h1 text-ink">챌린지 만들기</h1>
      <div className="mt-2 flex gap-2 text-caption text-ink-3">
        {steps.map((step) => (
          <span key={step}>{step}</span>
        ))}
      </div>
      <div className="flex flex-1 items-center justify-center text-center text-body text-ink-3">
        이 데모에서는 더미 챌린지로 체험하며, 직접 만들기는 범위 밖이에요.
        <br />
        홈의 챌린지를 눌러 체험해보세요.
      </div>
    </div>
  )
}

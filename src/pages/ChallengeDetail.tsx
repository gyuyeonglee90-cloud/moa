import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { bodyFill, partProgress } from '../domain/progress'
import { traces } from '../domain/traces'
import { goodTraces } from '../domain/goodTraces'
import { buildPartVisualMap } from '../domain/characterVisual'
import { PART_IDS } from '../types'
import type { PartId } from '../types'
import { PART_LABELS } from '../domain/constants'
import Character3D from '../components/Character3D'

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === id))
  const [tappedPart, setTappedPart] = useState<PartId | null>(null)

  if (!challenge) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">챌린지를 찾을 수 없어요.</p>
      </div>
    )
  }

  const fill = bodyFill(challenge)
  const sparkles = goodTraces(challenge)
  const partVisuals = buildPartVisualMap(challenge)

  return (
    <div className="flex h-full flex-col p-4">
      <button onClick={() => navigate(-1)} className="self-start text-gray-400">
        ← 뒤로
      </button>
      <h1 className="mt-2 text-xl font-bold">{challenge.title}</h1>
      <p className="text-sm text-gray-500">
        {challenge.currentDay}/{challenge.totalDays}일차 · 완성도 {Math.round(fill * 100)}% · 좋은
        흔적 {sparkles}개
      </p>

      <div className="mt-2 h-56 w-full">
        <Character3D
          template={challenge.character.template}
          color={challenge.character.color}
          parts={partVisuals}
          bodyFill={fill}
          sparkles={sparkles}
          onPartTap={setTappedPart}
          ariaLabel={`${challenge.character.name}, 완성도 ${Math.round(fill * 100)}%`}
        />
      </div>

      <div className="mt-2 space-y-2">
        {PART_IDS.map((partId) => {
          const progress = partProgress(challenge, partId)
          const trace = traces(challenge, partId)
          const owner = challenge.character.parts[partId]
          return (
            <div
              key={partId}
              className={`flex items-center justify-between rounded-lg border p-2 text-sm ${
                tappedPart === partId ? 'border-pink-400 bg-pink-50' : 'border-gray-100'
              }`}
            >
              <span>
                {PART_LABELS[partId]} · {owner === 'shared' ? '공동' : owner}
              </span>
              <span className="text-gray-500">
                {Math.round(progress * 100)}% · 흔적 {trace.missedCount}회
                {trace.wavy ? ' (물결)' : trace.rotate ? ' (기울어짐)' : ''}
              </span>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => navigate(`/challenge/${challenge.id}/checkin`)}
        className="mt-6 rounded-full bg-pink-500 py-3 font-medium text-white"
      >
        인증하기
      </button>
    </div>
  )
}

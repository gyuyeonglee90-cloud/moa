import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { bodyFill, partProgress } from '../domain/progress'
import { traces } from '../domain/traces'
import { goodTraces } from '../domain/goodTraces'
import { buildPartVisualMap } from '../domain/characterVisual'
import { PART_IDS } from '../types'
import type { PartId } from '../types'
import { CURRENT_USER_ID, PART_LABELS } from '../domain/constants'
import Character3D from '../components/Character3D'
import Toast from '../components/Toast'

type Segment = 'today' | 'traces' | 'album'

const SEGMENTS: { id: Segment; label: string }[] = [
  { id: 'today', label: '오늘' },
  { id: 'traces', label: '흔적' },
  { id: 'album', label: '앨범' },
]

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === id))
  const users = useAppStore((s) => s.users)
  const pokedKeys = useAppStore((s) => s.pokedKeys)
  const poke = useAppStore((s) => s.poke)
  const [tappedPart, setTappedPart] = useState<PartId | null>(null)
  const [segment, setSegment] = useState<Segment>('today')
  const [toast, setToast] = useState<string | null>(null)

  if (!challenge) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-body text-ink-3">챌린지를 찾을 수 없어요.</p>
      </div>
    )
  }

  function nicknameOf(userId: string) {
    return users.find((u) => u.id === userId)?.nickname ?? userId
  }

  function handlePoke(userId: string) {
    if (!id) return
    poke(id, userId)
    const name = nicknameOf(userId)
    setToast(`${name}에게 콕! 알림을 보냈어요(데모)`)
    window.setTimeout(() => setToast(null), 3000)
  }

  const fill = bodyFill(challenge)
  const sparkles = goodTraces(challenge)
  const partVisuals = buildPartVisualMap(challenge)
  const checkedInToday = (userId: string) =>
    challenge.checkIns.some((c) => c.userId === userId && c.day === challenge.currentDay)
  const iCheckedInToday = checkedInToday(CURRENT_USER_ID)

  return (
    <main className="flex h-full flex-col overflow-y-auto pb-24">
      <div className="bg-hero p-4">
        <button onClick={() => navigate(-1)} className="text-body-sm text-ink-3">
          ← 뒤로
        </button>
        <h1 className="mt-2 text-h1 text-ink">{challenge.character.name}</h1>
        <p className="text-caption text-ink-3">{challenge.title}</p>

        <div className="mt-2 h-48 w-full">
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

        <p className="mt-1 text-caption text-ink-3">
          {challenge.currentDay}/{challenge.totalDays}일차 · 완성도 {Math.round(fill * 100)}% ·
          좋은 흔적 {sparkles}개
        </p>
      </div>

      <div className="rounded-t-3xl bg-canvas p-4 -mt-5">
        <div role="tablist" aria-label="챌린지 상세 탭" className="flex gap-1 rounded-full bg-surface p-1 shadow-level1">
          {SEGMENTS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={segment === s.id}
              onClick={() => setSegment(s.id)}
              className={`h-11 flex-1 rounded-full text-title ${
                segment === s.id ? 'bg-ink text-white' : 'text-ink-2'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {segment === 'today' && (
          <div className="mt-3 space-y-4">
            <div>
              <h2 className="mb-2 text-title text-ink-2">오늘의 크루</h2>
              <div className="space-y-2">
                {challenge.memberIds.map((userId) => {
                  const done = checkedInToday(userId)
                  const isMe = userId === CURRENT_USER_ID
                  const pokeKey = `${challenge.id}:${challenge.currentDay}:${userId}`
                  const alreadyPoked = pokedKeys.includes(pokeKey)
                  return (
                    <div
                      key={userId}
                      className="flex items-center justify-between rounded-lg border border-hairline p-2 text-body-sm"
                    >
                      <span className="text-ink-2">
                        {done ? '✓' : '⏳'} {nicknameOf(userId)}
                        {isMe ? ' (나)' : ''}
                      </span>
                      {!isMe && !done && (
                        <button
                          onClick={() => handlePoke(userId)}
                          disabled={alreadyPoked}
                          className="h-9 rounded-full border border-hairline px-3 text-caption text-ink-2 disabled:text-ink-4"
                        >
                          {alreadyPoked ? '찔렀어요' : '콕 찌르기'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-title text-ink-2">부위별 담당</h2>
              <div className="space-y-2">
                {PART_IDS.map((partId) => {
                  const progress = partProgress(challenge, partId)
                  const owner = challenge.character.parts[partId]
                  return (
                    <div
                      key={partId}
                      className={`flex items-center justify-between rounded-lg border p-2 text-body-sm ${
                        tappedPart === partId ? 'border-accent bg-canvas' : 'border-hairline'
                      }`}
                    >
                      <span className="text-ink-2">
                        {PART_LABELS[partId]} · {owner === 'shared' ? '다 같이' : nicknameOf(owner)}
                      </span>
                      <span className="text-ink-3">{Math.round(progress * 100)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {segment === 'traces' && (
          <div className="mt-3 space-y-2">
            {PART_IDS.map((partId) => {
              const trace = traces(challenge, partId)
              const owner = challenge.character.parts[partId]
              return (
                <div key={partId} className="rounded-lg border border-hairline p-2 text-body-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-2">
                      {PART_LABELS[partId]} · {owner === 'shared' ? '다 같이' : nicknameOf(owner)}
                    </span>
                    <span className="text-ink-3">흔적 {trace.missedCount}회</span>
                  </div>
                  {trace.missedCount > 0 && (
                    <p className="mt-1 text-caption text-notice">
                      {Math.round((trace.scale - 1) * 100)}% 커짐
                      {trace.rotate ? ` · ${trace.rotate}도 기울어짐` : ''}
                      {trace.wavy ? ' · 물결 모양' : ''}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {segment === 'album' && (
          <div className="mt-3 space-y-2">
            {challenge.checkIns.length === 0 ? (
              <p className="text-body-sm text-ink-3">아직 인증이 없어요.</p>
            ) : (
              [...challenge.checkIns]
                .sort((a, b) => b.day - a.day)
                .map((c, i) => (
                  <div key={i} className="rounded-lg border border-hairline p-2 text-body-sm">
                    <span className="text-ink-2">
                      {c.day}일차 · {nicknameOf(c.userId)} {c.stamp}
                    </span>
                    {c.memo && <p className="mt-1 text-caption text-ink-3">{c.memo}</p>}
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      <Toast message={toast} />

      <div className="absolute inset-x-4 bottom-4">
        {iCheckedInToday ? (
          <div>
            <button
              disabled
              className="h-[52px] w-full rounded-full bg-ink text-button text-white opacity-50"
            >
              오늘 인증 완료 ✓
            </button>
            <p className="mt-1 text-center text-caption text-ink-3">내일 다시 인증할 수 있어요</p>
          </div>
        ) : (
          <button
            onClick={() => navigate(`/challenge/${challenge.id}/checkin`)}
            className="h-[52px] w-full rounded-full bg-ink text-button text-white shadow-level2 active:scale-[.97]"
          >
            오늘 인증하기
          </button>
        )}
      </div>
    </main>
  )
}

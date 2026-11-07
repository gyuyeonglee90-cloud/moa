import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function CheckIn() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const checkIn = useAppStore((s) => s.checkIn)
  const [memo, setMemo] = useState('')

  function handleSubmit() {
    if (!id) return
    checkIn(id, { stamp: '👍', memo: memo || undefined })
    navigate(`/challenge/${id}`)
  }

  return (
    <div className="flex h-full flex-col justify-end">
      <div className="rounded-t-2xl bg-white p-4 shadow-xl">
        <h2 className="text-lg font-bold">인증하기</h2>
        <p className="mt-1 text-sm text-gray-500">사진 또는 스탬프 + 한 줄 메모 (Phase 2에서 사진 업로드 구현)</p>
        <input
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="오늘 한 줄 메모"
          className="mt-3 w-full rounded-lg border border-gray-200 p-2 text-sm"
        />
        <button
          onClick={handleSubmit}
          className="mt-3 w-full rounded-full bg-pink-500 py-3 font-medium text-white"
        >
          인증 완료
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import {
  DONATION_CATEGORIES,
  GOODS_TYPES,
  PRICE_SPLIT,
  VIRTUAL_PARTNER_NAME,
} from '../domain/goods'
import type { DonationCategory, GoodsType } from '../types'

export default function GoodsCreate() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const challenge = useAppStore((s) => s.challenges.find((c) => c.id === id))
  const reserveGoods = useAppStore((s) => s.reserveGoods)

  const [type, setType] = useState<GoodsType>(GOODS_TYPES[0].id)
  const [donationCategory, setDonationCategory] = useState<DonationCategory>(
    DONATION_CATEGORIES[0].id,
  )
  const [reserved, setReserved] = useState(false)

  if (!challenge) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-body text-ink-3">챌린지를 찾을 수 없어요.</p>
      </div>
    )
  }

  function handleReserve() {
    if (!id) return
    reserveGoods(id, type, donationCategory)
    setReserved(true)
  }

  if (reserved || challenge.goodsOrder) {
    return (
      <main className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-5xl" aria-hidden="true">
          🎁
        </div>
        <h1 className="text-h1 text-ink">가상 주문 예약 완료!</h1>
        <p className="text-body-sm text-ink-3">포트폴리오 데모라서 실제 주문·결제는 되지 않아요.</p>
        <button
          onClick={() => navigate('/dex')}
          className="mt-2 h-[52px] rounded-full bg-ink px-6 text-button text-white active:scale-[.97]"
        >
          도감으로 이동
        </button>
      </main>
    )
  }

  return (
    <main className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <button onClick={() => navigate(-1)} className="self-start text-body-sm text-ink-3">
        ← 뒤로
      </button>
      <h1 className="text-h1 text-ink">{challenge.character.name} 굿즈 만들기</h1>

      <div
        className="flex h-28 items-center justify-center rounded-2xl text-body-sm text-ink-3"
        style={{ background: '#F6F5F4' }}
      >
        {GOODS_TYPES.find((g) => g.id === type)?.label} 목업 미리보기
      </div>

      <div>
        <h2 className="mb-2 text-title text-ink-2">종류</h2>
        <div className="grid grid-cols-2 gap-2">
          {GOODS_TYPES.map((g) => (
            <button
              key={g.id}
              onClick={() => setType(g.id)}
              aria-pressed={type === g.id}
              className={`rounded-xl border p-3 text-body-sm ${
                type === g.id ? 'border-ink bg-canvas' : 'border-hairline'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-title text-ink-2">기부처 선택</h2>
        <div className="flex gap-2">
          {DONATION_CATEGORIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDonationCategory(d.id)}
              aria-pressed={donationCategory === d.id}
              className={`h-11 rounded-full border px-3 text-body-sm ${
                donationCategory === d.id ? 'border-ink bg-canvas' : 'border-hairline'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-canvas p-3 text-caption text-ink-3">
        제작 {PRICE_SPLIT.production}% · 기부 {PRICE_SPLIT.donation}% · 배송 {PRICE_SPLIT.shipping}%
        · MOA 운영 {PRICE_SPLIT.operation}%
        <br />
        가상의 사회적기업 파트너 "{VIRTUAL_PARTNER_NAME}"이 제작합니다. 포트폴리오 데모라서 실제
        주문·결제는 되지 않아요.
      </div>

      <button
        onClick={handleReserve}
        className="mt-auto h-[52px] w-full rounded-full bg-ink text-button text-white active:scale-[.97]"
      >
        가상 주문 예약하기
      </button>
    </main>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { DONATION_CATEGORIES, GOODS_TYPES, PRICE_SPLIT } from '../domain/goods'
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
        <p className="text-gray-400">챌린지를 찾을 수 없어요.</p>
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
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="text-5xl">🎁</div>
        <h1 className="text-lg font-bold">가상 주문 예약 완료!</h1>
        <p className="text-sm text-gray-500">포트폴리오 데모라서 실제 주문은 되지 않아요.</p>
        <button
          onClick={() => navigate('/dex')}
          className="mt-2 rounded-full bg-pink-500 px-6 py-3 font-medium text-white"
        >
          도감으로 이동
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <button onClick={() => navigate(-1)} className="self-start text-gray-400">
        ← 뒤로
      </button>
      <h1 className="text-xl font-bold">{challenge.character.name} 굿즈 만들기</h1>

      <div>
        <h2 className="mb-2 text-sm font-semibold">종류</h2>
        <div className="grid grid-cols-2 gap-2">
          {GOODS_TYPES.map((g) => (
            <button
              key={g.id}
              onClick={() => setType(g.id)}
              className={`rounded-xl border p-3 text-sm ${
                type === g.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">기부처 선택</h2>
        <div className="flex gap-2">
          {DONATION_CATEGORIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDonationCategory(d.id)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                donationCategory === d.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
        제작 {PRICE_SPLIT.production}% · 기부 {PRICE_SPLIT.donation}% · 배송 {PRICE_SPLIT.shipping}%
        · MOA 운영 {PRICE_SPLIT.operation}%
        <br />
        가상의 사회적기업 파트너가 제작합니다. 포트폴리오 데모라서 실제 주문·결제는 되지 않아요.
      </div>

      <button
        onClick={handleReserve}
        className="mt-auto rounded-full bg-pink-500 py-3 font-medium text-white"
      >
        가상 주문 예약하기
      </button>
    </div>
  )
}

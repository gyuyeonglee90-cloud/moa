import { describe, expect, it } from 'vitest'
import { createGoodsOrder, DONATION_CATEGORIES, GOODS_TYPES, PRICE_SPLIT } from '../goods'

describe('goods', () => {
  it('굿즈 종류는 4가지다', () => {
    expect(GOODS_TYPES).toHaveLength(4)
  })

  it('기부처 카테고리가 있다', () => {
    expect(DONATION_CATEGORIES.length).toBeGreaterThan(0)
  })

  it('가격 배분은 합이 100이다', () => {
    const total = Object.values(PRICE_SPLIT).reduce((sum, v) => sum + v, 0)
    expect(total).toBe(100)
  })

  it('createGoodsOrder는 예약 상태로 생성한다', () => {
    const order = createGoodsOrder('keyring', 'animal', new Date('2026-11-07T00:00:00Z'))
    expect(order.status).toBe('reserved')
    expect(order.type).toBe('keyring')
    expect(order.donationCategory).toBe('animal')
    expect(order.reservedAt).toBe('2026-11-07T00:00:00.000Z')
  })
})

import type { DonationCategory, GoodsOrder, GoodsType } from '../types'

export interface GoodsTypeInfo {
  id: GoodsType
  label: string
}

export const GOODS_TYPES: GoodsTypeInfo[] = [
  { id: 'sticker', label: '스티커 팩' },
  { id: 'keyring', label: '아크릴 키링' },
  { id: 'grip', label: '그립톡' },
  { id: 'doll', label: '미니 인형' },
]

export interface DonationCategoryInfo {
  id: DonationCategory
  label: string
}

export const DONATION_CATEGORIES: DonationCategoryInfo[] = [
  { id: 'children', label: '아동' },
  { id: 'animal', label: '동물' },
  { id: 'environment', label: '환경' },
]

/** 가상의 사회적기업 파트너 이름 (실제 기관 아님 — D19, PO 지정) */
export const VIRTUAL_PARTNER_NAME = '모아손 공방'

/** 판매가 배분 구조 (PRD 5-5, 상생 구조·가상) */
export const PRICE_SPLIT = {
  production: 55,
  donation: 15,
  shipping: 15,
  operation: 15,
} as const

export function createGoodsOrder(
  type: GoodsType,
  donationCategory: DonationCategory,
  now: Date = new Date(),
): GoodsOrder {
  return {
    type,
    donationCategory,
    reservedAt: now.toISOString(),
    status: 'reserved',
  }
}

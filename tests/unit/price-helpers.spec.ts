import { describe, expect, it } from 'vitest'
import {
  formatPrice,
  priceFromCents,
  priceInCents,
} from '../../src/utils/price-in-cents.js'

describe('price helpers', () => {
  describe('priceInCents', () => {
    it('should convert reais to cents', () => {
      expect(priceInCents(19.99)).toBe(1999)
      expect(priceInCents(2.5)).toBe(250)
      expect(priceInCents(0)).toBe(0)
    })

    it('should handle floating point precision safely', () => {
      expect(priceInCents(1.005)).toBe(101)
    })

    it('should round values correctly', () => {
      expect(priceInCents(19.995)).toBe(2000)
      expect(priceInCents(19.994)).toBe(1999)
    })
  })

  describe('priceFromCents', () => {
    it('should convert cents to reais', () => {
      expect(priceFromCents(1999)).toBe(19.99)
      expect(priceFromCents(250)).toBe(2.5)
      expect(priceFromCents(0)).toBe(0)
    })
  })

  describe('formatPrice', () => {
    it('should format cents into BRL currency', () => {
      expect(formatPrice(1999)).toContain('19,99')
      expect(formatPrice(250)).toContain('2,50')
      expect(formatPrice(0)).toContain('0,00')
    })

    it('should include BRL currency symbol', () => {
      expect(formatPrice(1999)).toContain('R$')
    })
  })
})

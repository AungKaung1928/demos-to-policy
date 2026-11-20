import { describe, expect, it } from 'vitest'
import { bcBound, daggerBound } from './bounds'

describe('chapter 1 illustration: imitation-learning error bounds', () => {
  it('BC grows with T squared, DAgger linearly', () => {
    expect(bcBound(0.001, 10)).toBeCloseTo(0.1)
    expect(bcBound(0.001, 20)).toBeCloseTo(0.4)
    expect(daggerBound(0.001, 20)).toBeCloseTo(0.02)
  })

  it('the gap is a factor of T until the cap', () => {
    expect(bcBound(0.0001, 50) / daggerBound(0.0001, 50)).toBeCloseTo(50)
  })

  it('never exceeds the episode length', () => {
    expect(bcBound(0.5, 100)).toBe(100)
    expect(daggerBound(2, 100)).toBe(100)
  })
})

import { describe, expect, it } from 'vitest'
import { mean, sd, seeds } from './seeds'

describe('chapter 4 data: training-seed spread', () => {
  it('reproduces the README summary 0.51 ± 0.36', () => {
    expect(seeds).toHaveLength(6)
    expect(mean(seeds).toFixed(2)).toBe('0.51')
    expect(sd(seeds).toFixed(2)).toBe('0.36')
  })

  it('one-seed reports span 0.12 to 0.92 from the same recipe', () => {
    expect(Math.min(...seeds)).toBe(0.12)
    expect(Math.max(...seeds)).toBe(0.92)
  })
})

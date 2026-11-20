import { describe, expect, it } from 'vitest'
import { rows } from './valloss'

describe('chapter 3 data: validation loss vs rollout success', () => {
  it('has the two measured policies', () => {
    expect(rows.map((r) => r.policy)).toEqual(['ImagePolicy', 'ACTLite'])
  })

  it('the lower-loss policy is the less successful one (the chapter claim)', () => {
    const [img, act] = rows
    expect(img.valL1).toBeLessThan(act.valL1)
    expect(img.success).toBeLessThan(act.success)
    expect(act.valL1 / img.valL1).toBeGreaterThan(3)
  })

  it('success values are rates', () => {
    for (const r of rows) {
      expect(r.success).toBeGreaterThanOrEqual(0)
      expect(r.success).toBeLessThanOrEqual(1)
    }
  })
})

import { describe, expect, it } from 'vitest'
import { allInsideSpread, encoders, splits } from './language'

describe('chapter 5 data: language splits and the encoder ablation', () => {
  it('README claim: every row inside the others spread, on every split', () => {
    for (const s of splits) expect(allInsideSpread(s)).toBe(true)
  })

  it('held-out pairs (combo) are the hardest split for every encoder', () => {
    for (const e of encoders) {
      expect(e.score.combo[0]).toBeLessThan(e.score.paraphrase[0])
      expect(e.score.paraphrase[0]).toBeLessThanOrEqual(e.score.seen[0])
    }
  })
})

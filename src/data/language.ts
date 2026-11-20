// so-arm100-vla README lines 17-21 (at a glance) and 61 (key point "The encoder ablation has no power"),
// measured 2026-09-24: lift/push/reach/pick_place pooled, nominal physics, 20 episodes x 5 evaluation
// seeds per (task, colour) cell, mean ± sd over evaluation seeds, one training seed per row.
export type Split = 'seen' | 'paraphrase' | 'combo'

export interface Encoder {
  id: string
  label: string
  score: Record<Split, [number, number]> // mean, sd
}

export const encoders: Encoder[] = [
  { id: 'minilm-film', label: 'MiniLM + FiLM', score: { seen: [0.11, 0.081], paraphrase: [0.097, 0.06], combo: [0.027, 0.046] } },
  { id: 'hashed', label: 'Hashed bag of words', score: { seen: [0.092, 0.046], paraphrase: [0.073, 0.057], combo: [0.027, 0.021] } },
  { id: 'minilm-nofilm', label: 'MiniLM, no FiLM', score: { seen: [0.137, 0.075], paraphrase: [0.11, 0.056], combo: [0.033, 0.038] } },
]

export const splits: Split[] = ['seen', 'paraphrase', 'combo']

/** True when every encoder's mean lies inside every other encoder's mean ± sd. */
export function allInsideSpread(split: Split): boolean {
  return encoders.every((a) =>
    encoders.every((b) => Math.abs(a.score[split][0] - b.score[split][0]) <= b.score[split][1]),
  )
}

export const source = { label: 'so-arm100-vla README, at a glance', ref: 'github.com/AungKaung1928/so-arm100-vla' }

// so-arm100-il README (results tables, lines 31-32 and 40), measured 2026-09: 200 demos, 30 epochs,
// 4 threads; success = lift, nominal physics, 100 episodes x 5 seeds, one training seed.
// Val L1 is on normalised actions, final epoch.
export interface Row {
  policy: string
  valL1: number
  success: number
  successSd: number
}

export const rows: Row[] = [
  { policy: 'ImagePolicy', valL1: 0.0339, success: 0.05, successSd: 0.02 },
  { policy: 'ACTLite', valL1: 0.1229, success: 0.77, successSd: 0.05 },
]

export const source = { label: 'so-arm100-il README, results', ref: 'github.com/AungKaung1928/so-arm100-il' }

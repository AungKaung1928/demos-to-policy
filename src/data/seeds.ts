// so-arm100-il README line 36 and key point at line 47: ACTLite, 200 demonstrations, 20 epochs,
// 6 training seeds, lift success over 50 evaluation episodes each. The README lists the six values
// sorted, not by seed number, so they are labelled run 1..6 here.
export const seeds = [0.92, 0.82, 0.76, 0.24, 0.18, 0.12]

export function mean(x: number[]): number {
  return x.reduce((a, b) => a + b, 0) / x.length
}

/** Sample standard deviation (n - 1), as in the README's 0.51 ± 0.36. */
export function sd(x: number[]): number {
  const m = mean(x)
  return Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (x.length - 1))
}

export const source = { label: 'so-arm100-il README, scaling curve', ref: 'github.com/AungKaung1928/so-arm100-il' }

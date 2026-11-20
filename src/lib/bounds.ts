// Illustration, not a measurement. Upper bounds on extra mistakes over a T-step episode when the
// learner errs with probability eps on the states it is trained on:
//   behaviour cloning  T^2 * eps   (Ross & Bagnell, AISTATS 2010, "Efficient Reductions for Imitation Learning")
//   DAgger             ~ T * eps   (Ross, Gordon & Bagnell, AISTATS 2011, arXiv 1011.0686; constants dropped)
// Both capped at T: an episode cannot contain more than T mistakes.
export function bcBound(eps: number, T: number): number {
  return Math.min(T, T * T * eps)
}

export function daggerBound(eps: number, T: number): number {
  return Math.min(T, T * eps)
}

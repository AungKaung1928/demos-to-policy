# Demos to Policy

An interactive guide to reading the numbers of imitation-learned robot policies: why a lower validation loss can mean a worse robot, why one training seed proves little, and when an ablation cannot tell its rows apart. English and Japanese.

Status: three chapters built, **Validation loss lies** (a single-step policy with 3.6x lower loss lifts the cube 0.05 of the time, a 20-action chunk policy 0.77), **One seed is an anecdote** (six training runs of one recipe from 0.12 to 0.92) and **An ablation with no power** (three text encoders inside each other's spread at 3–14% success). Chapters 1–2 (compounding error, action chunking) are planned.

- Every number comes from a measured result in one of the author's repositories, cited on the page: [so-arm100-il](https://github.com/AungKaung1928/so-arm100-il) (simulated SO-100 arm, lift, behaviour cloning, DAgger, ACT-style chunking) and [so-arm100-vla](https://github.com/AungKaung1928/so-arm100-vla) (language-conditioned policy, held-out instruction splits). Simulation only, no real arm.
- Data lives in `src/data/`; `src/data/*.test.ts` check the claims the text makes (ranking flip, 0.51 ± 0.36 over seeds, every encoder inside the others' spread).

```
npm ci
npm run lint && npm test && npm run build
npm run dev
```

MIT licence.

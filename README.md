# Demos to Policy

An interactive guide to reading the numbers of imitation-learned robot policies: why a lower validation loss can mean a worse robot, why one training seed proves little, and when an ablation cannot tell its rows apart. English and Japanese.

Status: five chapters built, **Small mistakes compound** (behaviour-cloning vs DAgger error bounds as a labelled illustration, then the measured 0.05 vs 0.14), **Predict a chunk, decide less often** (T/k decisions per episode, and the chunk policy under shifted physics), **Validation loss lies** (a single-step policy with 3.6x lower loss lifts the cube 0.05 of the time, a 20-action chunk policy 0.77), **One seed is an anecdote** (six training runs of one recipe from 0.12 to 0.92) and **An ablation with no power** (three text encoders inside each other's spread at 3–14% success).

- Every number comes from a measured result in one of the author's repositories, cited on the page: [so-arm100-il](https://github.com/AungKaung1928/so-arm100-il) (simulated SO-100 arm, lift, behaviour cloning, DAgger, ACT-style chunking) and [so-arm100-vla](https://github.com/AungKaung1928/so-arm100-vla) (language-conditioned policy, held-out instruction splits). Simulation only, no real arm.
- Data lives in `src/data/`, the bound formulas in `src/lib/bounds.ts` (Ross & Bagnell 2010; Ross, Gordon & Bagnell 2011, arXiv 1011.0686); the tests check the claims the text makes (ranking flip, 0.51 ± 0.36 over seeds, every encoder inside the others' spread).

## Run locally

Needs Node.js 20.19+ or 22.12+ (required by Vite) and npm.

Clone the repository, then:

```bash
cd demos-to-policy
npm ci          # once after cloning: installs the exact versions in package-lock.json
npm run dev     # starts the app
```

Open the address `npm run dev` prints, usually http://localhost:5173, in a browser. The page reloads when a file changes. Ctrl+C in the terminal stops the server.

Run every `npm` command from inside the `demos-to-policy` folder. From any other folder npm stops with `Could not read package.json`.

That is all you need to read the app. The commands below are only for changing the code:

```bash
npm run lint    # oxlint
npm test        # unit tests: the claims the text makes
npm run build   # type check + static build into dist/
```

MIT licence.

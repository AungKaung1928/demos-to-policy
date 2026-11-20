import { useState } from 'react'
import { bcBound } from './lib/bounds'
import { useLang } from './i18n'

const KS = [1, 2, 5, 10, 20]
const EPISODE = 200 // steps, illustration only
const EPS = 0.001 // per-decision error, illustration only

// so-arm100-il README lines 31 and 34-35: ACTLite (chunk of 20), lift, 100 episodes x 5 seeds (nominal).
const CELLS = [
  { id: 'nominal', chunk: [0.77, 0.05] },
  { id: 'small', chunk: [0.38, 0.05] },
  { id: 'laggy', chunk: [0.65, 0.02] },
  { id: 'weak', chunk: [0.7, 0.04] },
] as const

const T = {
  en: {
    eyebrow: 'Chapter 2',
    title: 'Predict a chunk, decide less often',
    intro:
      'If the policy outputs the next k actions at once and executes them, it makes T / k decisions per episode instead of T. Fewer decisions means fewer chances to drift off the demonstrations: the ACT paper argues chunking shrinks the effective horizon k-fold.',
    illus: `Illustration, not measured: ${EPISODE}-step episode, error ${EPS} per decision, behaviour-cloning bound on the shortened horizon`,
    k: 'Chunk length k:',
    decisions: 'Decisions per episode',
    bound: 'Bound on extra mistakes, (T/k)²ε',
    measured: 'Measured: the chunk-of-20 policy under shifted physics, lift success',
    cells: { nominal: 'Nominal physics', small: 'Smaller cube', laggy: 'Action latency', weak: 'Weaker motors' },
    note: 'On nominal physics the chunk policy reaches 0.77 where single-step cloning reached 0.05 (chapter 1). Its weak spot is a smaller cube: 0.38, while the scripted expert still gets 0.73 there. Committing to 20 actions also means not reacting for 20 steps.',
    caveat:
      'so-arm100-il ACTLite, 200 demonstrations, one training seed, 100 episodes × 5 evaluation seeds. On latency and weaker motors the expert loses at most 0.01.',
    src: 'Zhao et al. 2023, ACT',
  },
  ja: {
    eyebrow: '第 2 章',
    title: 'チャンクで予測し、判断の回数を減らす',
    intro:
      '方策が次の k 個のアクションをまとめて出力して実行すると、1 エピソードの判断回数は T 回ではなく T / k 回になります。判断が減れば、デモから外れる機会も減ります。ACT の論文は、チャンク化で実効的なホライズンが k 分の 1 になると論じています。',
    illus: `説明用 (計測値ではありません): ${EPISODE} ステップのエピソード、判断 1 回あたりの誤り率 ${EPS}、短くなったホライズンでの行動クローニングの上界`,
    k: 'チャンク長 k:',
    decisions: 'エピソードあたりの判断回数',
    bound: '余分なミスの上界 (T/k)²ε',
    measured: '計測値: 20 アクションのチャンク方策を物理を変えて評価 (持ち上げ成功率)',
    cells: { nominal: '標準の物理', small: '小さいキューブ', laggy: 'アクションの遅延', weak: '弱いモーター' },
    note: '標準の物理では、チャンク方策は 0.77 に達します。1 ステップの行動クローニングは 0.05 でした (第 1 章)。弱点は小さいキューブで 0.38 です。スクリプトのエキスパートはそこでも 0.73 を出します。20 アクション先まで決めることは、20 ステップの間反応しないことでもあります。',
    caveat:
      'so-arm100-il の ACTLite、デモ 200 本、学習シード 1、100 エピソード × 評価シード 5。遅延と弱いモーターでは、エキスパートの低下は最大 0.01 です。',
    src: 'Zhao et al. 2023, ACT',
  },
}

export function ChunkChapter() {
  const t = T[useLang()]
  const [ki, setKi] = useState(0)
  const k = KS[ki]
  const decisions = EPISODE / k
  const bound = bcBound(EPS, decisions)
  const max = bcBound(EPS, EPISODE)
  return (
    <>
      <section className="intro chapter-break" id="chunk">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>
      <section className="panel" aria-labelledby="chunk-h">
        <h2 id="chunk-h">{t.bound}</h2>
        <p className="muted">{t.illus}</p>
        <div className="controls">
          <label>
            <span>
              {t.k} <b className="num">{k}</b>
            </span>
            <input type="range" min={0} max={KS.length - 1} step={1} value={ki} onChange={(e) => setKi(Number(e.target.value))} />
          </label>
        </div>
        <ul className="bars">
          <li>
            <span className="bar-label">{t.decisions}</span>
            <span className="bar-track">
              <span className="bar win" style={{ width: `${(decisions / EPISODE) * 100}%` }} />
            </span>
            <span className="bar-value num">{decisions}</span>
          </li>
          <li>
            <span className="bar-label">{t.bound}</span>
            <span className="bar-track">
              <span className="bar" style={{ width: `${(bound / max) * 100}%` }} />
            </span>
            <span className="bar-value num">{bound.toFixed(3)}</span>
          </li>
        </ul>
        <p className="muted">
          <a href="https://arxiv.org/abs/2304.13705" lang="en">
            {t.src}
          </a>
        </p>
      </section>
      <section className="panel" aria-labelledby="cells-h">
        <h2 id="cells-h">{t.measured}</h2>
        <ul className="bars wide-value">
          {CELLS.map((c) => (
            <li key={c.id}>
              <span className="bar-label">{t.cells[c.id]}</span>
              <span className="bar-track">
                <span className={c.id === 'small' ? 'bar' : 'bar win'} style={{ width: `${c.chunk[0] * 100}%` }} />
              </span>
              <span className="bar-value num">
                {c.chunk[0].toFixed(2)} ± {c.chunk[1].toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <p className="muted">{t.note}</p>
        <p className="muted">{t.caveat}</p>
        <p className="muted">
          <a href="https://github.com/AungKaung1928/so-arm100-il" lang="en">
            so-arm100-il README, results
          </a>
        </p>
      </section>
    </>
  )
}

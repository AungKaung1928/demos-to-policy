import { useState } from 'react'
import { bcBound, daggerBound } from './lib/bounds'
import { useLang } from './i18n'

const EPS = [0.0001, 0.0002, 0.0005, 0.001, 0.002, 0.005, 0.01]
const TS = [25, 50, 100, 200, 400]

// so-arm100-il README results table (lines 22-25): lift, nominal physics, 100 episodes x 5 seeds.
const MEASURED = [
  { id: 'expert', success: 0.93, sd: 0.02 },
  { id: 'bc', success: 0.05, sd: 0.02 },
  { id: 'dagger', success: 0.14, sd: 0.07 },
  { id: 'chunk', success: 0.77, sd: 0.05 },
] as const

const T = {
  en: {
    eyebrow: 'Chapter 1',
    title: 'Small mistakes compound',
    intro:
      'A cloned policy is trained on states the expert visited. One small mistake puts the robot somewhere the expert never went, where the policy is worse, so the next mistake is more likely. The theory says the damage grows with the square of the episode length.',
    illus: 'Illustration: bounds from the papers, not measured',
    eps: 'Per-step error on expert states, ε:',
    len: 'Episode length, T steps:',
    bc: 'Behaviour cloning, ≤ T²ε',
    dagger: 'DAgger, ~ Tε',
    unit: 'Extra mistakes per episode (upper bound)',
    ratio: (r: string) => `Behaviour cloning's bound is ${r}× DAgger's.`,
    capped: 'Behaviour cloning hit the cap: every step may be a mistake.',
    srcBc: 'Ross & Bagnell, AISTATS 2010',
    srcDagger: 'Ross, Gordon & Bagnell, AISTATS 2011 (DAgger)',
    measured: 'Measured on the simulated arm: lift success',
    rows: { expert: 'Scripted expert', bc: 'Behaviour cloning, 1 action', dagger: 'DAgger, 1 action', chunk: 'Chunk of 20 actions' },
    note: 'DAgger, which asks the expert to label the states the policy actually reaches, lifts behaviour cloning from 0.05 to 0.14, the direction the theory predicts, but far below the expert. Predicting a chunk of actions (chapter 2) did much more on this task.',
    caveat:
      'Measured rows: so-arm100-il, 200 demonstrations, image + proprioception, nominal physics, 100 episodes × 5 evaluation seeds, one training seed each; DAgger adds 100 relabelled rollouts over 5 iterations.',
  },
  ja: {
    eyebrow: '第 1 章',
    title: '小さなミスは積み重なる',
    intro:
      '模倣した方策は、エキスパートが訪れた状態で学習します。小さなミスを 1 つすると、ロボットはエキスパートが行ったことのない状態に入ります。そこでは方策はもっと下手なので、次のミスが起きやすくなります。理論では、損失はエピソード長の 2 乗で増えます。',
    illus: '説明用: 論文の上界であり、計測値ではありません',
    eps: 'エキスパートの状態での 1 ステップあたりの誤り率 ε:',
    len: 'エピソード長 T ステップ:',
    bc: '行動クローニング ≤ T²ε',
    dagger: 'DAgger ~ Tε',
    unit: 'エピソードあたりの余分なミス (上界)',
    ratio: (r: string) => `行動クローニングの上界は DAgger の ${r} 倍です。`,
    capped: '行動クローニングは上限に達しました。すべてのステップがミスになりえます。',
    srcBc: 'Ross & Bagnell, AISTATS 2010',
    srcDagger: 'Ross, Gordon & Bagnell, AISTATS 2011 (DAgger)',
    measured: 'シミュレーションのアームでの計測: 持ち上げ成功率',
    rows: { expert: 'スクリプトのエキスパート', bc: '行動クローニング (1 アクション)', dagger: 'DAgger (1 アクション)', chunk: '20 アクションのチャンク' },
    note: 'DAgger は、方策が実際にたどり着いた状態にエキスパートのラベルを付け直します。行動クローニングの 0.05 を 0.14 に上げ、理論の予測どおりの方向ですが、エキスパートには遠く及びません。この課題では、アクションをチャンクで予測すること (第 2 章) のほうがはるかに効きました。',
    caveat:
      '計測値: so-arm100-il、デモ 200 本、画像 + 固有受容、標準の物理、100 エピソード × 評価シード 5、各行で学習シード 1。DAgger は 5 回の反復で 100 本のロールアウトにラベルを付け直したものです。',
  },
}

export function CompoundChapter() {
  const t = T[useLang()]
  const [ei, setEi] = useState(3)
  const [ti, setTi] = useState(3)
  const eps = EPS[ei]
  const len = TS[ti]
  const bc = bcBound(eps, len)
  const dg = daggerBound(eps, len)
  const pct = (v: number) => `${(v / len) * 100}%`
  return (
    <>
      <section className="intro" id="compound">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>
      <section className="panel" aria-labelledby="bound-h">
        <h2 id="bound-h">{t.unit}</h2>
        <p className="muted">{t.illus}</p>
        <div className="controls">
          <label>
            <span>
              {t.eps} <b className="num">{eps}</b>
            </span>
            <input type="range" min={0} max={EPS.length - 1} step={1} value={ei} onChange={(e) => setEi(Number(e.target.value))} />
          </label>
          <label>
            <span>
              {t.len} <b className="num">{len}</b>
            </span>
            <input type="range" min={0} max={TS.length - 1} step={1} value={ti} onChange={(e) => setTi(Number(e.target.value))} />
          </label>
        </div>
        <ul className="bars">
          <li>
            <span className="bar-label">{t.bc}</span>
            <span className="bar-track">
              <span className="bar" style={{ width: pct(bc) }} />
            </span>
            <span className="bar-value num">{bc.toFixed(2)}</span>
          </li>
          <li>
            <span className="bar-label">{t.dagger}</span>
            <span className="bar-track">
              <span className="bar win" style={{ width: pct(dg) }} />
            </span>
            <span className="bar-value num">{dg.toFixed(2)}</span>
          </li>
        </ul>
        <p className="readout">{bc >= len ? t.capped : t.ratio((bc / dg).toFixed(0))}</p>
        <p className="muted">
          <span lang="en">{t.srcBc}</span> · <a href="https://arxiv.org/abs/1011.0686" lang="en">{t.srcDagger}</a>
        </p>
      </section>
      <section className="panel" aria-labelledby="meas-h">
        <h2 id="meas-h">{t.measured}</h2>
        <ul className="bars wide-value">
          {MEASURED.map((r) => (
            <li key={r.id}>
              <span className="bar-label">{t.rows[r.id]}</span>
              <span className="bar-track">
                <span className={r.id === 'bc' || r.id === 'dagger' ? 'bar' : 'bar win'} style={{ width: `${r.success * 100}%` }} />
              </span>
              <span className="bar-value num">
                {r.success.toFixed(2)} ± {r.sd.toFixed(2)}
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

import { useState } from 'react'
import { rows, source } from './data/valloss'
import { ChunkChapter } from './ChunkChapter'
import { CompoundChapter } from './CompoundChapter'
import { LanguageChapter } from './LanguageChapter'
import { SeedsChapter } from './SeedsChapter'
import { LangContext, initialLang, saveLang } from './i18n'
import type { Lang } from './i18n'

type Metric = 'loss' | 'success'

const T = {
  en: {
    eyebrow: 'Chapter 3',
    title: 'Validation loss lies',
    intro:
      'Two policies learn to lift a cube from the same 200 demonstrations. One predicts the next action, the other a chunk of 20. Rank them by validation loss and the single-step policy wins by 3.6×. Rank them by what the arm actually does and it loses, 0.05 against 0.77.',
    rank: 'Rank by',
    loss: 'Validation loss (lower looks better)',
    success: 'Lift success (higher is better)',
    lossShort: 'Validation loss',
    successShort: 'Lift success',
    best: 'ranked first',
    table: 'Both numbers',
    cols: ['Policy', 'Output', 'Val L1', 'Lift success'],
    why: 'Validation loss scores one prediction at a time against the demonstrator. On the arm, small errors push the policy into states the demonstrations never showed, and a one-step policy has no plan to recover. The chunk commits to 20 actions, so fewer decisions are made off the demonstration path. Lesson: rank policies by rollouts, not by loss.',
    caveat:
      'Simulated SO-100 arm, nominal physics, 100 episodes × 5 evaluation seeds, one training seed per policy; val L1 on normalised actions, final epoch. The two losses come from different output heads, so they are not on exactly the same footing; the ranking flip is the point, not the ratio.',
    lang: 'Language',
    contents: 'Chapters',
    toc: [
      ['compound', 'Small mistakes compound'],
      ['chunk', 'Predict a chunk'],
      ['valloss', 'Validation loss lies'],
      ['seeds', 'One seed is an anecdote'],
      ['language', 'An ablation with no power'],
    ],
  },
  ja: {
    eyebrow: '第 3 章',
    title: '検証ロスはうそをつく',
    intro:
      '同じ 200 本のデモから、2 つの方策がキューブの持ち上げを学びます。一方は次の 1 アクションを、もう一方は 20 アクションのチャンクを予測します。検証ロスで並べると 1 ステップの方策が 3.6 倍良く見えます。アームが実際にどう動くかで並べると、0.05 対 0.77 で負けます。',
    rank: '並べ替えの基準',
    loss: '検証ロス (低いほど良く見える)',
    success: '持ち上げ成功率 (高いほど良い)',
    lossShort: '検証ロス',
    successShort: '持ち上げ成功率',
    best: '1 位',
    table: '両方の数値',
    cols: ['方策', '出力', '検証 L1', '持ち上げ成功率'],
    why: '検証ロスは、予測を 1 回ずつデモと比べて採点します。アーム上では小さな誤差が積み重なり、デモにない状態へ方策を押し出します。1 ステップの方策には立て直す計画がありません。チャンクは 20 アクション先まで決めるので、デモの経路から外れたところで下す判断が減ります。教訓: 方策はロスではなくロールアウトで比べること。',
    caveat:
      'シミュレーションの SO-100 アーム、標準の物理、100 エピソード × 評価シード 5、方策ごとに学習シード 1。検証 L1 は正規化したアクションでの最終エポックの値です。2 つのロスは出力ヘッドが異なるため厳密には同じ土俵ではありません。大事なのは比ではなく順位の逆転です。',
    lang: '表示言語',
    contents: '章',
    toc: [
      ['compound', '小さなミスは積み重なる'],
      ['chunk', 'チャンクで予測する'],
      ['valloss', '検証ロスはうそをつく'],
      ['seeds', 'シード 1 つは逸話にすぎない'],
      ['language', '検出力のないアブレーション'],
    ],
  },
}

const OUTPUT = { en: ['1 action', 'chunk of 20 actions'], ja: ['1 アクション', '20 アクションのチャンク'] }

export default function App() {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [metric, setMetric] = useState<Metric>('loss')
  const t = T[lang]
  const pick = (l: Lang) => {
    setLang(l)
    saveLang(l)
    document.documentElement.lang = l
  }
  const value = (i: number) => (metric === 'loss' ? rows[i].valL1 : rows[i].success)
  const order = rows
    .map((_, i) => i)
    .sort((a, b) => (metric === 'loss' ? value(a) - value(b) : value(b) - value(a)))
  const max = Math.max(...rows.map((_, i) => value(i)))
  return (
    <LangContext.Provider value={lang}>
      <div className="page">
        <header className="top">
          <p className="brand">Demos to Policy</p>
          <div className="lang" role="group" aria-label={t.lang}>
            {(['en', 'ja'] as const).map((l) => (
              <button key={l} id={`lang-${l}`} type="button" aria-pressed={lang === l} onClick={() => pick(l)}>
                {l === 'en' ? 'EN' : '日本語'}
              </button>
            ))}
          </div>
        </header>
        <nav aria-label={t.contents}>
          <ol className="toc">
            {t.toc.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ol>
        </nav>
        <main>
          <CompoundChapter />
          <ChunkChapter />
          <section className="intro chapter-break" id="valloss">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
          </section>

          <section className="panel" aria-labelledby="rank-h">
            <h2 id="rank-h">{metric === 'loss' ? t.loss : t.success}</h2>
            <div className="seg" role="group" aria-label={t.rank}>
              <button id="rank-loss" type="button" aria-pressed={metric === 'loss'} onClick={() => setMetric('loss')}>
                {t.lossShort}
              </button>
              <button
                id="rank-success"
                type="button"
                aria-pressed={metric === 'success'}
                onClick={() => setMetric('success')}
              >
                {t.successShort}
              </button>
            </div>
            <ul className="bars">
              {order.map((i, rank) => (
                <li key={rows[i].policy}>
                  <span className="bar-label">
                    {rows[i].policy}
                    {rank === 0 ? ` · ${t.best}` : ''}
                  </span>
                  <span className="bar-track">
                    <span className={rank === 0 ? 'bar win' : 'bar'} style={{ width: `${(value(i) / max) * 100}%` }} />
                  </span>
                  <span className="bar-value num">{metric === 'loss' ? value(i).toFixed(4) : value(i).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="muted">{t.why}</p>
          </section>

          <section className="panel" aria-labelledby="table-h">
            <h2 id="table-h">{t.table}</h2>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {t.cols.map((c, i) => (
                      <th key={c} scope="col" className={i > 1 ? 'num' : undefined}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.policy}>
                      <th scope="row">{r.policy}</th>
                      <td>{OUTPUT[lang][i]}</td>
                      <td className="num">{r.valL1.toFixed(4)}</td>
                      <td className="num">
                        {r.success.toFixed(2)} ± {r.successSd.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted">{t.caveat}</p>
            <p className="muted">
              <a href={`https://${source.ref}`} lang="en">
                {source.label}
              </a>
            </p>
          </section>
          <SeedsChapter />
          <LanguageChapter />
        </main>
      </div>
    </LangContext.Provider>
  )
}

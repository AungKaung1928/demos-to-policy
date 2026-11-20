import { useState } from 'react'
import { mean, sd, seeds, source } from './data/seeds'
import { useLang } from './i18n'

const T = {
  en: {
    eyebrow: 'Chapter 4',
    title: 'One seed is an anecdote',
    intro:
      'Same 200 demonstrations, same chunking policy, same 20 epochs. Only the random seed of training changes. Six runs land in two groups with nothing between them.',
    report: 'What the write-up reports',
    run: (i: number) => `Run ${i + 1} only`,
    all: 'All six',
    headline: 'Headline number:',
    allRead: (m: string, s: string) => `${m} ± ${s} over 6 training seeds`,
    oneRead: (v: string) => `${v} from one training seed`,
    chart: 'Lift success per training run',
    note: 'A paper that trains once can report anything from 0.12 to 0.92 for this recipe. The ± over evaluation episodes on one run (0.77 ± 0.05 for the 30-epoch run in chapter 3) hides this, because it measures the robot, not the training. Report several training seeds, or say that you did not.',
    caveat:
      'ACTLite, 200 demonstrations, 20 epochs, lift on nominal physics, 50 evaluation episodes per run. The README lists the six values sorted, so the runs here are in that order, not seed order.',
  },
  ja: {
    eyebrow: '第 4 章',
    title: 'シード 1 つは逸話にすぎない',
    intro:
      '同じ 200 本のデモ、同じチャンク方策、同じ 20 エポック。変えるのは学習の乱数シードだけです。6 回の学習結果は 2 つのグループに分かれ、その間には何もありません。',
    report: '報告で書く数値',
    run: (i: number) => `学習 ${i + 1} だけ`,
    all: '6 回すべて',
    headline: '見出しの数値:',
    allRead: (m: string, s: string) => `学習シード 6 つで ${m} ± ${s}`,
    oneRead: (v: string) => `学習シード 1 つで ${v}`,
    chart: '学習ごとの持ち上げ成功率',
    note: '1 回だけ学習する論文なら、この手順で 0.12 から 0.92 までどの値でも報告できます。1 回の学習に対する評価エピソードの ± (第 3 章の 30 エポックの学習での 0.77 ± 0.05) ではこれは見えません。それはロボットのばらつきで、学習のばらつきではないからです。学習シードを複数回して報告するか、していないと明記しましょう。',
    caveat:
      'ACTLite、デモ 200 本、20 エポック、標準の物理で持ち上げ、学習ごとに評価 50 エピソード。README には 6 つの値が大きい順に並んでいるため、ここでの学習番号はその順で、シード番号ではありません。',
  },
}

export function SeedsChapter() {
  const t = T[useLang()]
  const [pick, setPick] = useState<number | null>(null)
  const read =
    pick === null ? t.allRead(mean(seeds).toFixed(2), sd(seeds).toFixed(2)) : t.oneRead(seeds[pick].toFixed(2))
  return (
    <>
      <section className="intro chapter-break" id="seeds">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
      </section>
      <section className="panel" aria-labelledby="seeds-h">
        <h2 id="seeds-h">{t.chart}</h2>
        <div className="seg seg-wrap" role="group" aria-label={t.report}>
          <button id="seed-all" type="button" aria-pressed={pick === null} onClick={() => setPick(null)}>
            {t.all}
          </button>
          {seeds.map((_, i) => (
            <button key={i} id={`seed-${i}`} type="button" aria-pressed={pick === i} onClick={() => setPick(i)}>
              {t.run(i)}
            </button>
          ))}
        </div>
        <p className="readout">
          {t.headline} <b className="num">{read}</b>
        </p>
        <ul className="bars">
          {seeds.map((v, i) => (
            <li key={i}>
              <span className="bar-label">{t.run(i).replace(/ only$|だけ$/, '')}</span>
              <span className="bar-track">
                <span
                  className={pick === null || pick === i ? 'bar win' : 'bar dim'}
                  style={{ width: `${v * 100}%` }}
                />
              </span>
              <span className="bar-value num">{v.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="muted">{t.note}</p>
        <p className="muted">{t.caveat}</p>
        <p className="muted">
          <a href={`https://${source.ref}`} lang="en">
            {source.label}
          </a>
        </p>
      </section>
    </>
  )
}
